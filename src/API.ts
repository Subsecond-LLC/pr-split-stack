/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type GetDiffInput = {
  bearerToken?: string | null,
  userName: string,
  repoName: string,
  prNumber: string,
};

export type GetDiffResponse = {
  __typename: "GetDiffResponse",
  diff: string,
  info: PRInfo,
};

export type PRInfo = {
  __typename: "PRInfo",
  branchName: string,
  title: string,
  description: string,
};

export type ApplySplitInput = {
  bearerToken: string,
  userName: string,
  repoName: string,
  prNumber: string,
  splitMode: SplitMode,
  base: PRPatchInfo,
  split: PRPatchInfo,
};

export enum SplitMode {
  SPLIT = "SPLIT",
  STACK = "STACK",
}


export type PRPatchInfo = {
  branchName: string,
  title: string,
  description: string,
  patches: Array< FilePatch >,
};

export type FilePatch = {
  fileName: string,
  patch: string,
};

export type ApplySplitResponse = {
  __typename: "ApplySplitResponse",
  newPRNumber: number,
};

export type GithubProfile = {
  __typename: "GithubProfile",
  githubName: string,
  email: string,
  bearerToken: string,
  id: string,
  createdAt: string,
  updatedAt: string,
};

export type CreateGithubProfileInput = {
  githubName: string,
  email: string,
  bearerToken: string,
  id?: string | null,
};

export type ModelGithubProfileConditionInput = {
  githubName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  bearerToken?: ModelStringInput | null,
  and?: Array< ModelGithubProfileConditionInput | null > | null,
  or?: Array< ModelGithubProfileConditionInput | null > | null,
  not?: ModelGithubProfileConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdateGithubProfileInput = {
  githubName?: string | null,
  email?: string | null,
  bearerToken?: string | null,
  id: string,
};

export type DeleteGithubProfileInput = {
  id: string,
};

export type ModelGithubProfileFilterInput = {
  githubName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  bearerToken?: ModelStringInput | null,
  and?: Array< ModelGithubProfileFilterInput | null > | null,
  or?: Array< ModelGithubProfileFilterInput | null > | null,
  not?: ModelGithubProfileFilterInput | null,
};

export type ModelGithubProfileConnection = {
  __typename: "ModelGithubProfileConnection",
  items:  Array<GithubProfile | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionGithubProfileFilterInput = {
  githubName?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  bearerToken?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionGithubProfileFilterInput | null > | null,
  or?: Array< ModelSubscriptionGithubProfileFilterInput | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type GetDiffMutationVariables = {
  getDiffInput: GetDiffInput,
};

export type GetDiffMutation = {
  getDiff?:  {
    __typename: "GetDiffResponse",
    diff: string,
    info:  {
      __typename: "PRInfo",
      branchName: string,
      title: string,
      description: string,
    },
  } | null,
};

export type ApplySplitMutationVariables = {
  applySplitInput: ApplySplitInput,
};

export type ApplySplitMutation = {
  applySplit?:  {
    __typename: "ApplySplitResponse",
    newPRNumber: number,
  } | null,
};

export type GithubAuthMutationVariables = {
  code: string,
};

export type GithubAuthMutation = {
  githubAuth?:  {
    __typename: "GithubProfile",
    githubName: string,
    email: string,
    bearerToken: string,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateGithubProfileMutationVariables = {
  input: CreateGithubProfileInput,
  condition?: ModelGithubProfileConditionInput | null,
};

export type CreateGithubProfileMutation = {
  createGithubProfile?:  {
    __typename: "GithubProfile",
    githubName: string,
    email: string,
    bearerToken: string,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGithubProfileMutationVariables = {
  input: UpdateGithubProfileInput,
  condition?: ModelGithubProfileConditionInput | null,
};

export type UpdateGithubProfileMutation = {
  updateGithubProfile?:  {
    __typename: "GithubProfile",
    githubName: string,
    email: string,
    bearerToken: string,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGithubProfileMutationVariables = {
  input: DeleteGithubProfileInput,
  condition?: ModelGithubProfileConditionInput | null,
};

export type DeleteGithubProfileMutation = {
  deleteGithubProfile?:  {
    __typename: "GithubProfile",
    githubName: string,
    email: string,
    bearerToken: string,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetGithubProfileQueryVariables = {
  id: string,
};

export type GetGithubProfileQuery = {
  getGithubProfile?:  {
    __typename: "GithubProfile",
    githubName: string,
    email: string,
    bearerToken: string,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGithubProfilesQueryVariables = {
  filter?: ModelGithubProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGithubProfilesQuery = {
  listGithubProfiles?:  {
    __typename: "ModelGithubProfileConnection",
    items:  Array< {
      __typename: "GithubProfile",
      githubName: string,
      email: string,
      bearerToken: string,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateGithubProfileSubscriptionVariables = {
  filter?: ModelSubscriptionGithubProfileFilterInput | null,
};

export type OnCreateGithubProfileSubscription = {
  onCreateGithubProfile?:  {
    __typename: "GithubProfile",
    githubName: string,
    email: string,
    bearerToken: string,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGithubProfileSubscriptionVariables = {
  filter?: ModelSubscriptionGithubProfileFilterInput | null,
};

export type OnUpdateGithubProfileSubscription = {
  onUpdateGithubProfile?:  {
    __typename: "GithubProfile",
    githubName: string,
    email: string,
    bearerToken: string,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGithubProfileSubscriptionVariables = {
  filter?: ModelSubscriptionGithubProfileFilterInput | null,
};

export type OnDeleteGithubProfileSubscription = {
  onDeleteGithubProfile?:  {
    __typename: "GithubProfile",
    githubName: string,
    email: string,
    bearerToken: string,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
