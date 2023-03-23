import fetch from 'node-fetch';

const GITHUB_API_ROOT = 'https://api.github.com';

export const handler = async (event) => {
  const { userName, repoName, prNumber, bearerToken } =
    event.arguments.getDiffInput;

  const pull = await (
    await fetch(
      `${GITHUB_API_ROOT}/repos/${userName}/${repoName}/pulls/${prNumber}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(bearerToken != null && {
            Authorization: `Bearer ${bearerToken}`,
          }),
        },
      }
    )
  ).json();

  // github does this by the 'Accept' header which I think is a bad pattern but no matter
  const diff = await (
    await fetch(
      `${GITHUB_API_ROOT}/repos/${userName}/${repoName}/pulls/${prNumber}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.diff',
          ...(bearerToken != null && {
            Authorization: `Bearer ${bearerToken}`,
          }),
        },
      }
    )
  ).text();

  const info = {
    branchName: pull.head.ref,
    title: pull.title ?? '',
    description: pull.body ?? '',
  };

  return { diff, info };
};
