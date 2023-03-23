/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDiff = /* GraphQL */ `
  mutation GetDiff($getDiffInput: GetDiffInput!) {
    getDiff(getDiffInput: $getDiffInput) {
      diff
      info {
        prTitle
      }
    }
  }
`;
export const createPlaceholder = /* GraphQL */ `
  mutation CreatePlaceholder(
    $input: CreatePlaceholderInput!
    $condition: ModelPlaceholderConditionInput
  ) {
    createPlaceholder(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
    }
  }
`;
export const updatePlaceholder = /* GraphQL */ `
  mutation UpdatePlaceholder(
    $input: UpdatePlaceholderInput!
    $condition: ModelPlaceholderConditionInput
  ) {
    updatePlaceholder(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
    }
  }
`;
export const deletePlaceholder = /* GraphQL */ `
  mutation DeletePlaceholder(
    $input: DeletePlaceholderInput!
    $condition: ModelPlaceholderConditionInput
  ) {
    deletePlaceholder(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
    }
  }
`;
