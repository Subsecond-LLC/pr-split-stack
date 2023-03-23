/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPlaceholder = /* GraphQL */ `
  query GetPlaceholder($id: ID!) {
    getPlaceholder(id: $id) {
      id
      createdAt
      updatedAt
    }
  }
`;
export const listPlaceholders = /* GraphQL */ `
  query ListPlaceholders(
    $filter: ModelPlaceholderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlaceholders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
