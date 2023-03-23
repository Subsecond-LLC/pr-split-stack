/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDiff = /* GraphQL */ `
  mutation GetDiff($getDiffInput: GetDiffInput!) {
    getDiff(getDiffInput: $getDiffInput) {
      diff
      info {
        branchName
        title
        description
      }
    }
  }
`;
export const applySplit = /* GraphQL */ `
  mutation ApplySplit($applySplitInput: ApplySplitInput!) {
    applySplit(applySplitInput: $applySplitInput) {
      newPRNumber
    }
  }
`;
export const githubAuth = /* GraphQL */ `
  mutation GithubAuth($code: String!) {
    githubAuth(code: $code) {
      githubName
      email
      bearerToken
      id
      createdAt
      updatedAt
    }
  }
`;
export const createGithubProfile = /* GraphQL */ `
  mutation CreateGithubProfile(
    $input: CreateGithubProfileInput!
    $condition: ModelGithubProfileConditionInput
  ) {
    createGithubProfile(input: $input, condition: $condition) {
      githubName
      email
      bearerToken
      id
      createdAt
      updatedAt
    }
  }
`;
export const updateGithubProfile = /* GraphQL */ `
  mutation UpdateGithubProfile(
    $input: UpdateGithubProfileInput!
    $condition: ModelGithubProfileConditionInput
  ) {
    updateGithubProfile(input: $input, condition: $condition) {
      githubName
      email
      bearerToken
      id
      createdAt
      updatedAt
    }
  }
`;
export const deleteGithubProfile = /* GraphQL */ `
  mutation DeleteGithubProfile(
    $input: DeleteGithubProfileInput!
    $condition: ModelGithubProfileConditionInput
  ) {
    deleteGithubProfile(input: $input, condition: $condition) {
      githubName
      email
      bearerToken
      id
      createdAt
      updatedAt
    }
  }
`;
