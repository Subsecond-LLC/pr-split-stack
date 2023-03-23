/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGithubProfile = /* GraphQL */ `
  query GetGithubProfile($id: ID!) {
    getGithubProfile(id: $id) {
      githubName
      email
      bearerToken
      id
      createdAt
      updatedAt
    }
  }
`;
export const listGithubProfiles = /* GraphQL */ `
  query ListGithubProfiles(
    $filter: ModelGithubProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGithubProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        githubName
        email
        bearerToken
        id
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
