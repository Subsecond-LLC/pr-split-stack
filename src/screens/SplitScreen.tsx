import { TypedDocumentNode, gql, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ApplySplitMutation,
  ApplySplitMutationVariables,
  GetDiffMutation,
  GetDiffMutationVariables,
  GithubAuthMutation,
  GithubAuthMutationVariables,
  SplitMode,
} from '../API';
import parseDiff, { File } from 'parse-diff';
import DiffFile from '../components/DiffFile';
import styled from 'styled-components';
import getGithubAuthURL from '../util/getGithubAuthURL';
import useQueryParams from '../util/useQueryParams';
import nullThrows from 'capital-t-null-throws';
import TopBar from '../components/TopBar';
import Card from '../ui/Card';
import LoadingModal from '../components/LoadingModal';

const Page = styled.div`
  background-color: #fafbfc;
`;

const Content = styled.div`
  margin: 0 auto;
  padding-top: 94px;
`;

const DescriptionSections = styled.div`
  display: flex;
  flex-direction: row;
`;

const Label = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
  color: #555;
`;

const DescriptionTextInput = styled.input`
  font-size: 18px;
  padding: 8px 12px;
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: calc(100% - 32px);
  margin-bottom: 16px;
  font-size: 15px;
`;

const TextArea = styled.textarea`
  font-size: 15px;
  padding: 8px 12px;
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: calc(100% - 32px);
`;

function DescriptionSection({
  modifier,
  data,
  onChangeData,
}: {
  modifier: string;
  data: { branchName: string; title: string; description: string };
  onChangeData: (data: {
    branchName: string;
    title: string;
    description: string;
  }) => void;
}) {
  const capitalizedModifier = modifier[0].toUpperCase() + modifier.slice(1);
  return (
    <Card>
      <Label>{capitalizedModifier} branch name</Label>
      <DescriptionTextInput
        value={data.branchName}
        onChange={(e) => onChangeData({ ...data, branchName: e.target.value })}
      />
      <Label>{capitalizedModifier} pull request title</Label>
      <DescriptionTextInput
        value={data.title}
        onChange={(e) => onChangeData({ ...data, title: e.target.value })}
      />
      <Label>{capitalizedModifier} pull request description</Label>
      <TextArea
        value={data.description}
        onChange={(e) => onChangeData({ ...data, description: e.target.value })}
      />
    </Card>
  );
}

function generateFilePatches(diffFiles: File[], splitDiffIndexes: number[]) {
  // TODO: DRY this out.
  return {
    baseFilePatches: diffFiles.map((file, i) => {
      const startIndex = diffFiles
        .slice(0, i)
        .reduce((acc, file) => acc + file.chunks.length, 0);

      return {
        fileName: file.to ?? file.from ?? '', // TODO additions deletions
        patch: file.chunks
          .filter(
            (_, chunkIndex) =>
              !splitDiffIndexes.includes(startIndex + chunkIndex)
          )
          .map(
            (chunk) =>
              `${chunk.content}\n${chunk.changes
                .map((change) => change.content)
                .join('\n')}`
          )
          .join('\n'),
      };
    }),
    splitFilePatches: diffFiles.map((file, i) => {
      const startIndex = diffFiles
        .slice(0, i)
        .reduce((acc, file) => acc + file.chunks.length, 0);

      return {
        fileName: file.to ?? file.from ?? '', // TODO additions deletions
        patch: file.chunks
          .filter((_, chunkIndex) =>
            splitDiffIndexes.includes(startIndex + chunkIndex)
          )
          .map(
            (chunk) =>
              `${chunk.content}\n${chunk.changes
                .map((change) => change.content)
                .join('\n')}`
          )
          .join('\n'),
      };
    }),
  };
}

const GET_DIFF_MUTATION = gql`
  mutation SplitScreenGetDiffMutation($getDiffInput: GetDiffInput!) {
    getDiff(getDiffInput: $getDiffInput) {
      diff
      info {
        branchName
        title
        description
      }
    }
  }
` as TypedDocumentNode<GetDiffMutation, GetDiffMutationVariables>;

const APPLY_SPLIT_MUTATION = gql`
  mutation SplitScreenApplySplitMutation($applySplitInput: ApplySplitInput!) {
    applySplit(applySplitInput: $applySplitInput) {
      newPRNumber
    }
  }
` as TypedDocumentNode<ApplySplitMutation, ApplySplitMutationVariables>;

const GITHUB_AUTH_MUTATION = gql`
  mutation SplitScreenGithubAuthMutation($code: String!) {
    githubAuth(code: $code) {
      email
      githubName
      bearerToken
    }
  }
` as TypedDocumentNode<GithubAuthMutation, GithubAuthMutationVariables>;

function SplitScreen() {
  const { code } = useQueryParams<{ code?: string }>();
  const { userName, repoName, prNumber } = useParams<{
    userName: string;
    repoName: string;
    prNumber: string;
  }>();

  const [bearerToken, setBearerToken] = useState<string | null>(
    localStorage.getItem('bearerToken')
  );

  const [diffFiles, setDiffFiles] = useState<File[] | null>(null);

  const [baseInfo, setBaseInfo] = useState<{
    branchName: string;
    title: string;
    description: string;
  } | null>(null);

  const [splitInfo, setSplitInfo] = useState<{
    branchName: string;
    title: string;
    description: string;
  } | null>(
    localStorage.getItem('inProgressSplitInfo') == null
      ? null
      : JSON.parse(localStorage.getItem('inProgressSplitInfo') ?? '{}')
  );

  const [isUnauthorized, setIsUnauthorized] = useState<boolean>(false);
  const [splitMode, setSplitMode] = useState<'split' | 'stack'>('split');
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [newPRNumber, setNewPRNumber] = useState<number | null>(null);

  const [splitDiffIndexes, setSplitDiffIndexes] = useState<number[]>(
    JSON.parse(localStorage.getItem('inProgress') ?? '[]')
  );

  const [getDiffMutation] = useMutation(GET_DIFF_MUTATION);
  const [applySplitMutation] = useMutation(APPLY_SPLIT_MUTATION);
  const [githubAuthMutation] = useMutation(GITHUB_AUTH_MUTATION);

  useEffect(() => {
    (async () => {
      if (userName == null || repoName == null || prNumber == null) return;

      // if we have a code to deal with, do that first...
      let newBearerToken = bearerToken;
      if (code != null) {
        const result = await githubAuthMutation({ variables: { code } });
        if (result.data?.githubAuth == null) throw new Error('Oauth failed');
        const { githubAuth } = result.data;

        localStorage.setItem('bearerToken', githubAuth.bearerToken);
        localStorage.setItem('githubName', githubAuth.githubName);
        setBearerToken(githubAuth.bearerToken);
        newBearerToken = githubAuth.bearerToken;
      }

      try {
        const result = await getDiffMutation({
          variables: {
            getDiffInput: {
              userName,
              repoName,
              prNumber,
              bearerToken: newBearerToken,
            },
          },
        });

        const _diffFiles = parseDiff(result.data?.getDiff?.diff);

        // garbage fix for typename forwarding into apollo query
        const _baseInfo = {
          ...nullThrows(result.data?.getDiff?.info),
          __typename: undefined,
        };
        delete _baseInfo.__typename;

        const _splitInfo = {
          branchName: `${_baseInfo.branchName}-split`,
          title: `Split from '${_baseInfo.title}'`,
          description: '',
        };

        setBaseInfo(_baseInfo);
        setSplitInfo(_splitInfo);
        setDiffFiles(_diffFiles);

        // were we in the middle of something?
        if (code != null && localStorage.getItem('inProgress') != null) {
          localStorage.removeItem('inProgress');
          localStorage.removeItem('inProgressSplitInfo');
          const { baseFilePatches, splitFilePatches } = generateFilePatches(
            _diffFiles,
            splitDiffIndexes
          );
          setShouldShowModal(true);
          setLoadingMessage(
            'Sending git commands to github. This will take a few seconds...'
          );

          const result = await applySplitMutation({
            variables: {
              applySplitInput: {
                userName,
                repoName,
                prNumber,
                splitMode:
                  splitMode === 'split' ? SplitMode.SPLIT : SplitMode.STACK,
                base: {
                  ...nullThrows(_baseInfo),
                  patches: baseFilePatches,
                },
                split: {
                  ...nullThrows(splitInfo ?? _splitInfo),
                  patches: splitFilePatches,
                },
                bearerToken: nullThrows(newBearerToken),
              },
            },
          });
          setLoadingMessage('Done!');
          setNewPRNumber(result.data?.applySplit?.newPRNumber ?? null);
        }
      } catch (e) {
        console.log(e);
        // okay there's an error, it might be related to auth. show an error to that effect...
        setIsUnauthorized(true);
      }
    })();
  }, [getDiffMutation, prNumber, repoName, userName]);

  return (
    <Page>
      <TopBar
        splitMode={splitMode}
        onChangeSplitMode={(sm) => setSplitMode(sm)}
        initialGithubURL={`https://github.com/${userName}/${repoName}/pull/${prNumber}`}
        onSend={async () => {
          if (
            diffFiles == null ||
            userName == null ||
            repoName == null ||
            prNumber == null ||
            splitInfo == null
          )
            return;

          // if we don't have permissions, save progress and go ask for permission.
          if (bearerToken == null) {
            localStorage.setItem(
              'inProgress',
              JSON.stringify(splitDiffIndexes)
            );
            localStorage.setItem(
              'inProgressSplitInfo',
              JSON.stringify(splitInfo)
            );

            window.location.href = getGithubAuthURL(
              userName,
              repoName,
              prNumber
            );
            return;
          }

          const { baseFilePatches, splitFilePatches } = generateFilePatches(
            diffFiles,
            splitDiffIndexes
          );

          setShouldShowModal(true);
          setLoadingMessage(
            'Sending git commands to github. This will take a few seconds...'
          );
          const result = await applySplitMutation({
            variables: {
              applySplitInput: {
                userName,
                repoName,
                prNumber,
                splitMode:
                  splitMode === 'split' ? SplitMode.SPLIT : SplitMode.STACK,
                base: {
                  ...nullThrows(baseInfo),
                  patches: baseFilePatches,
                },
                split: {
                  ...nullThrows(splitInfo),
                  patches: splitFilePatches,
                },
                bearerToken,
              },
            },
          });
          setLoadingMessage('Done!');
          setNewPRNumber(result.data?.applySplit?.newPRNumber ?? null);
        }}
        isSendDisabled={splitDiffIndexes.length === 0}
      />
      <Content>
        {isUnauthorized ? (
          <Card>
            We're not able to grab that PR for you. It might be because you need
            to give{' '}
            <a href={getGithubAuthURL(userName, repoName, prNumber)}>
              Github OAuth Permissions
            </a>
            .
          </Card>
        ) : diffFiles == null ? (
          <Card>loading...</Card>
        ) : (
          <>
            {baseInfo != null && splitInfo != null && (
              <DescriptionSections>
                <DescriptionSection
                  modifier="base"
                  data={baseInfo}
                  onChangeData={(info) => setBaseInfo(info)}
                />
                <DescriptionSection
                  modifier={splitMode}
                  data={splitInfo}
                  onChangeData={(info) => setSplitInfo(info)}
                />
              </DescriptionSections>
            )}
            {diffFiles.map((file, i) => {
              const startIndex = diffFiles
                .slice(0, i)
                .reduce((acc, file) => acc + file.chunks.length, 0);
              return (
                <DiffFile
                  file={file}
                  areChunksSplit={file.chunks.map((_, i) =>
                    splitDiffIndexes.includes(i + startIndex)
                  )}
                  onToggleChunk={(chunkIndex) =>
                    setSplitDiffIndexes((prev) =>
                      prev.includes(chunkIndex + startIndex)
                        ? prev.filter(
                            (index) => index !== chunkIndex + startIndex
                          )
                        : prev.concat([chunkIndex + startIndex])
                    )
                  }
                  onToggleAllChunks={(value) =>
                    setSplitDiffIndexes((prev) =>
                      value
                        ? [
                            ...new Set(
                              prev.concat(
                                file.chunks.map((_, i) => startIndex + i)
                              )
                            ),
                          ]
                        : prev.filter((diffIndex) =>
                            file.chunks.every(
                              (_, i) => startIndex + i !== diffIndex
                            )
                          )
                    )
                  }
                />
              );
            })}
          </>
        )}
      </Content>
      {shouldShowModal && (
        <LoadingModal
          message={loadingMessage}
          pullRequestURL={
            newPRNumber == null
              ? null
              : `https://github.com/${userName}/${repoName}/pull/${newPRNumber}`
          }
        />
      )}
    </Page>
  );
}

export default SplitScreen;
