import gunzip from 'gunzip-maybe';
import tar from 'tar-stream';
import from2 from 'from2';
import concat from 'concat-stream';
import fetch from 'node-fetch';
import { applyPatch } from 'diff';

const GITHUB_API_ROOT = 'https://api.github.com';

// TODO: Please typescriptify this please its so bad without it

async function pickAndPatchFilesFromTarball({
  url,
  splitMode,
  bearerToken,
  basePatches,
  splitPatches,
}) {
  const allPatches = basePatches.concat(splitPatches);

  // add auth to this...
  const tarball = await fetch(url, {
    headers: {
      ...(bearerToken != null && {
        Authorization: `Bearer ${bearerToken}`,
      }),
    },
  });
  if (!tarball.ok) {
    throw new Error(tarball.statusText);
  }

  // Streams make my brain hurt.
  const baseFiles = [];
  const splitFiles = [];
  let tarballBuffer = await tarball.arrayBuffer();
  return await new Promise((resolve, reject) => {
    from2(async (size, cb) => {
      if (tarballBuffer.byteLength === 0) cb(null, null);

      const nextChunk = tarballBuffer.slice(0, size);
      tarballBuffer = tarballBuffer.slice(size);

      cb(null, new Uint8Array(nextChunk));
    })
      .pipe(gunzip())
      .pipe(tar.extract())
      .on('entry', function (header, stream, next) {
        // header is the tar header
        // stream is the content body (might be an empty stream)
        // call next when you are done with this entry

        stream.on('end', function () {
          next(); // ready for next entry
        });

        stream.resume(); // just auto drain the stream

        const path = header.name.slice(header.name.indexOf('/') + 1);

        if (
          header.type === 'directory' ||
          !allPatches.some((patch) => patch.fileName === path)
        ) {
          stream.resume();
          next();
          return;
        }

        stream.pipe(
          concat(function (data) {
            const basePatched = applyPatch(
              data.toString(),
              basePatches.find((fp) => fp.fileName === path).patch ?? ''
            );
            if (basePatches.some((patch) => patch.fileName === path)) {
              baseFiles.push({
                path,
                content: basePatched,
              });
            }

            // if we are stacking, we need to repatch the changed file not the original
            if (splitPatches.some((patch) => patch.fileName === path)) {
              splitFiles.push({
                path,
                content: applyPatch(
                  splitMode === 'SPLIT' ? data.toString() : basePatched,
                  splitPatches.find((fp) => fp.fileName === path).patch
                ),
              });
            }
            next();
          })
        );
      })
      .on('finish', () => {
        resolve([baseFiles, splitFiles]);
      });
  });
}

async function fetchGithubAPI(endpoint, options) {
  const { method, body, bearerToken } = options ?? {};

  const response = await fetch(`${GITHUB_API_ROOT}${endpoint}`, {
    method: method ?? 'GET',
    body: body == null ? undefined : JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(bearerToken != null && {
        Authorization: `Bearer ${bearerToken}`,
      }),
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

// TODO make params less overkill here
async function createBranchAndPR(options) {
  const {
    pull,
    branchName,
    title,
    description,
    splitMode,
    splitFiles,
    baseFiles,
    userName,
    repoName,
    bearerToken,
    prNumber,
  } = options;

  // save all the blobs
  const baseBlobs = await Promise.all(
    baseFiles.map(async (file) => {
      const response = await fetchGithubAPI(
        `/repos/${userName}/${repoName}/git/blobs`,
        {
          bearerToken,
          method: 'POST',
          body: {
            content: file.content,
            encoding: 'utf-8',
          },
        }
      );

      return { path: file.path, sha: response.sha };
    })
  );

  const splitBlobs = await Promise.all(
    splitFiles.map(async (file) => {
      const response = await fetchGithubAPI(
        `/repos/${userName}/${repoName}/git/blobs`,
        {
          bearerToken,
          method: 'POST',
          body: {
            content: file.content,
            encoding: 'utf-8',
          },
        }
      );

      return { path: file.path, sha: response.sha };
    })
  );

  const splitBaseCommitSHA =
    splitMode === 'SPLIT' ? pull.base.sha : pull.head.sha;
  const splitBaseCommitRef =
    splitMode === 'SPLIT' ? pull.base.ref : pull.head.ref;

  const baseTreeSHA = (
    await fetchGithubAPI(
      `/repos/${userName}/${repoName}/git/commits/${pull.base.sha}`,
      { bearerToken }
    )
  ).tree.sha;

  const headTreeSHA = (
    await fetchGithubAPI(
      `/repos/${userName}/${repoName}/git/commits/${pull.head.sha}`,
      { bearerToken }
    )
  ).tree.sha;

  // create a fresh tree for the base to build from
  const newBaseTree = await fetchGithubAPI(
    `/repos/${userName}/${repoName}/git/trees`,
    {
      bearerToken,
      method: 'POST',
      body: {
        base_tree: baseTreeSHA,
        tree: baseBlobs.map((blob) => ({
          ...blob,
          mode: '100644',
          type: 'blob',
        })),
      },
    }
  );

  const newBaseCommit = await fetchGithubAPI(
    `/repos/${userName}/${repoName}/git/commits`,
    {
      bearerToken,
      method: 'POST',
      body: {
        message: `Split off to ${branchName}`,
        tree: newBaseTree.sha,
        parents: [pull.head.sha],
      },
    }
  );

  console.log(pull.head);
  console.log(newBaseCommit);

  // update branch to reflect new commit..
  const newBaseRef = await fetchGithubAPI(
    `/repos/${userName}/${repoName}/git/refs/heads/${pull.head.ref}`,
    {
      bearerToken,
      method: 'PATCH',
      body: {
        ref: `refs/heads/${pull.head.ref}`,
        sha: newBaseCommit.sha,
      },
    }
  );

  // and now the split tree
  const newSplitTree = await fetchGithubAPI(
    `/repos/${userName}/${repoName}/git/trees`,
    {
      bearerToken,
      method: 'POST',
      body: {
        base_tree: splitMode === 'SPLIT' ? baseTreeSHA : newBaseTree.sha,
        tree: splitBlobs.map((blob) => ({
          ...blob,
          mode: '100644',
          type: 'blob',
        })),
      },
    }
  );

  // Create commit from tree
  const commit = await fetchGithubAPI(
    `/repos/${userName}/${repoName}/git/commits`,
    {
      bearerToken,
      method: 'POST',
      body: {
        message: `Split from PR #${prNumber} to ${branchName}`,
        tree: newSplitTree.sha,
        parents: [newBaseCommit.sha],
      },
    }
  );

  // Move branch ref to newly created commit
  const ref = await fetchGithubAPI(`/repos/${userName}/${repoName}/git/refs`, {
    bearerToken,
    method: 'POST',
    body: {
      ref: `refs/heads/${branchName}`,
      sha: commit.sha,
    },
  });

  // create a pull request with everything we've gotten thus far.
  const newPR = await fetchGithubAPI(`/repos/${userName}/${repoName}/pulls`, {
    bearerToken,
    method: 'POST',
    body: {
      title,
      body: description,
      head: branchName,
      base: splitBaseCommitRef,
    },
  });

  console.log(newPR);

  return newPR.number.toFixed(0);
}

export const handler = async (event) => {
  const { userName, repoName, prNumber, bearerToken, splitMode, base, split } =
    event.arguments.applySplitInput;

  const pull = await fetchGithubAPI(
    `/repos/${userName}/${repoName}/pulls/${prNumber}`,
    {
      bearerToken,
    }
  );

  const beforeTarballURL = `${GITHUB_API_ROOT}/repos/${userName}/${repoName}/tarball/${pull.base.sha}`;

  const [baseFiles, splitFiles] = await pickAndPatchFilesFromTarball({
    url: beforeTarballURL,
    splitMode,
    bearerToken,
    basePatches: base.patches,
    splitPatches: split.patches,
  });

  const newPRNumber = await createBranchAndPR({
    baseFiles,
    splitFiles,
    bearerToken,
    userName,
    repoName,
    prNumber,
    splitMode,
    branchName: split.branchName,
    title: split.title,
    description: split.description,
    pull,
  });

  return { newPRNumber };
};
