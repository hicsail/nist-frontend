/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type AccessToken = {
  __typename?: 'AccessToken';
  accessToken: Scalars['String'];
};

export type CargoPermissionChange = {
  admin: Scalars['Boolean'];
  delete: Scalars['Boolean'];
  read: Scalars['Boolean'];
  write: Scalars['Boolean'];
};

export type CargoPermissions = {
  __typename?: 'CargoPermissions';
  _id: Scalars['ID'];
  /** If the user can modify permissions on the bucket */
  admin: Scalars['Boolean'];
  /** The bucket that the user permission is on */
  bucket: Scalars['String'];
  /** If the user can delete objects in the bucket */
  delete: Scalars['Boolean'];
  /** If the user has read access to the bucket */
  read: Scalars['Boolean'];
  user: UserModel;
  /** If the user has write access to the bucket */
  write: Scalars['Boolean'];
};

/** Wrapper for AWS HttpRequest */
export type CargoResourceRequest = {
  body?: InputMaybe<Scalars['JSON']>;
  headers: Scalars['JSON'];
  hostname: Scalars['String'];
  method: Scalars['String'];
  path: Scalars['String'];
  port?: InputMaybe<Scalars['Float']>;
  protocol: Scalars['String'];
  query: Scalars['JSON'];
};

export type CargoSignedRequest = {
  __typename?: 'CargoSignedRequest';
  /** SHA256 Hashed Body */
  bodyHash: Scalars['String'];
  /** AWS Signature based on the request */
  signature: Scalars['String'];
  /** AWS format timestamp */
  timestamp: Scalars['String'];
};

export type ConfigurableProjectSettings = {
  description?: InputMaybe<Scalars['String']>;
  homePage?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  muiTheme?: InputMaybe<Scalars['JSON']>;
  name?: InputMaybe<Scalars['String']>;
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export type EmailLoginDto = {
  email: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
};

export type ForgotDto = {
  email: Scalars['String'];
  projectId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cargoChangePermissions: CargoPermissions;
  cargoServiceAddUser: Array<CargoPermissions>;
  cargoServiceChangePermissions: CargoPermissions;
  createProject: ProjectModel;
  forgotPassword: Scalars['Boolean'];
  loginEmail: AccessToken;
  loginUsername: AccessToken;
  resetPassword: Scalars['Boolean'];
  signup: AccessToken;
  updateProject: ProjectModel;
  updateProjectAuthMethods: ProjectModel;
  updateProjectSettings: ProjectModel;
};


export type MutationCargoChangePermissionsArgs = {
  bucket: Scalars['String'];
  change: CargoPermissionChange;
  user: Scalars['String'];
};


export type MutationCargoServiceAddUserArgs = {
  project: Scalars['String'];
  user: Scalars['String'];
};


export type MutationCargoServiceChangePermissionsArgs = {
  bucket: Scalars['String'];
  change: CargoPermissionChange;
  user: Scalars['String'];
};


export type MutationCreateProjectArgs = {
  authServiceUser: UsernameLoginDto;
  project: ProjectCreateInput;
};


export type MutationForgotPasswordArgs = {
  user: ForgotDto;
};


export type MutationLoginEmailArgs = {
  user: EmailLoginDto;
};


export type MutationLoginUsernameArgs = {
  user: UsernameLoginDto;
};


export type MutationResetPasswordArgs = {
  user: ResetDto;
};


export type MutationSignupArgs = {
  user: UserSignupDto;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['String'];
  settings: ConfigurableProjectSettings;
};


export type MutationUpdateProjectAuthMethodsArgs = {
  id: Scalars['String'];
  projectAuthMethods: ProjectAuthMethodsInput;
};


export type MutationUpdateProjectSettingsArgs = {
  id: Scalars['String'];
  projectSettings: ProjectSettingsInput;
};

export type Organization = {
  __typename?: 'Organization';
  _id: Scalars['ID'];
  bucket: Scalars['String'];
  name: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
};

export type ProjectAuthMethodsInput = {
  googleAuth?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectAuthMethodsModel = {
  __typename?: 'ProjectAuthMethodsModel';
  googleAuth: Scalars['Boolean'];
};

export type ProjectCreateInput = {
  allowSignup: Scalars['Boolean'];
  description: Scalars['String'];
  displayProjectName: Scalars['Boolean'];
  googleAuth: Scalars['Boolean'];
  homePage?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  muiTheme?: InputMaybe<Scalars['JSON']>;
  name: Scalars['String'];
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export type ProjectModel = {
  __typename?: 'ProjectModel';
  authMethods: ProjectAuthMethodsModel;
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  homePage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  logo?: Maybe<Scalars['String']>;
  muiTheme: Scalars['JSON'];
  name: Scalars['String'];
  redirectUrl?: Maybe<Scalars['String']>;
  settings: ProjectSettingsModel;
  updatedAt: Scalars['DateTime'];
  users: Array<UserModel>;
};

export type ProjectSettingsInput = {
  allowSignup?: InputMaybe<Scalars['Boolean']>;
  displayProjectName?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectSettingsModel = {
  __typename?: 'ProjectSettingsModel';
  allowSignup: Scalars['Boolean'];
  displayProjectName: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  /** Means for the admin to get all permissions for a given bucket */
  cargoGetAllBucketPermissions: Array<CargoPermissions>;
  /** Get all permissions for the user of the JWT for their project */
  cargoGetPermissions: Array<CargoPermissions>;
  /** Allows the currently authenticated user to get their own permisisons for a bucket */
  cargoGetPermissionsForBucket: CargoPermissions;
  cargoSignRequest: CargoSignedRequest;
  getOriganizations: Array<Organization>;
  getProject: ProjectModel;
  getUser: UserModel;
  listProjects: Array<ProjectModel>;
  projectUsers: Array<UserModel>;
  publicKey: Array<Scalars['String']>;
  users: Array<UserModel>;
};


export type QueryCargoGetAllBucketPermissionsArgs = {
  bucket: Scalars['String'];
};


export type QueryCargoGetPermissionsForBucketArgs = {
  bucket: Scalars['String'];
};


export type QueryCargoSignRequestArgs = {
  request: CargoResourceRequest;
};


export type QueryGetProjectArgs = {
  id: Scalars['String'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryProjectUsersArgs = {
  projectId: Scalars['String'];
};


export type QueryUsersArgs = {
  projectId: Scalars['ID'];
};

export type ResetDto = {
  code: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
};

export type UserModel = {
  __typename?: 'UserModel';
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  fullname?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  projectId: Scalars['String'];
  role: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  username?: Maybe<Scalars['String']>;
};

export type UserSignupDto = {
  email: Scalars['String'];
  fullname: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type UsernameLoginDto = {
  password: Scalars['String'];
  projectId: Scalars['String'];
  username: Scalars['String'];
};

export type CargoGetPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type CargoGetPermissionsQuery = { __typename?: 'Query', cargoGetPermissions: Array<{ __typename?: 'CargoPermissions', read: boolean, write: boolean, delete: boolean, admin: boolean, bucket: string }> };

export type GetOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationsQuery = { __typename?: 'Query', getOriganizations: Array<{ __typename?: 'Organization', _id: string, name: string, bucket: string }> };

export type CargoChangePermissionsMutationVariables = Exact<{
  change: CargoPermissionChange;
  user: Scalars['String'];
  bucket: Scalars['String'];
}>;


export type CargoChangePermissionsMutation = { __typename?: 'Mutation', cargoChangePermissions: { __typename?: 'CargoPermissions', _id: string, bucket: string, read: boolean, write: boolean, delete: boolean, admin: boolean, user: { __typename?: 'UserModel', id: string, email?: string | null } } };

export type CargoGetAllBucketPermissionsQueryVariables = Exact<{
  bucket: Scalars['String'];
}>;


export type CargoGetAllBucketPermissionsQuery = { __typename?: 'Query', cargoGetAllBucketPermissions: Array<{ __typename?: 'CargoPermissions', _id: string, bucket: string, read: boolean, write: boolean, delete: boolean, admin: boolean, user: { __typename?: 'UserModel', id: string, email?: string | null } }> };


export const CargoGetPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cargoGetPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cargoGetPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"delete"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}}]} as unknown as DocumentNode<CargoGetPermissionsQuery, CargoGetPermissionsQueryVariables>;
export const GetOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOriganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const CargoChangePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"cargoChangePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"change"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CargoPermissionChange"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cargoChangePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"change"},"value":{"kind":"Variable","name":{"kind":"Name","value":"change"}}},{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"delete"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}}]}}]}}]} as unknown as DocumentNode<CargoChangePermissionsMutation, CargoChangePermissionsMutationVariables>;
export const CargoGetAllBucketPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CargoGetAllBucketPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cargoGetAllBucketPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bucket"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bucket"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"delete"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}}]}}]}}]} as unknown as DocumentNode<CargoGetAllBucketPermissionsQuery, CargoGetAllBucketPermissionsQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type AccessToken = {
  __typename?: 'AccessToken';
  accessToken: Scalars['String'];
};

export type CargoPermissionChange = {
  admin: Scalars['Boolean'];
  delete: Scalars['Boolean'];
  read: Scalars['Boolean'];
  write: Scalars['Boolean'];
};

export type CargoPermissions = {
  __typename?: 'CargoPermissions';
  _id: Scalars['ID'];
  /** If the user can modify permissions on the bucket */
  admin: Scalars['Boolean'];
  /** The bucket that the user permission is on */
  bucket: Scalars['String'];
  /** If the user can delete objects in the bucket */
  delete: Scalars['Boolean'];
  /** If the user has read access to the bucket */
  read: Scalars['Boolean'];
  user: UserModel;
  /** If the user has write access to the bucket */
  write: Scalars['Boolean'];
};

/** Wrapper for AWS HttpRequest */
export type CargoResourceRequest = {
  body?: InputMaybe<Scalars['JSON']>;
  headers: Scalars['JSON'];
  hostname: Scalars['String'];
  method: Scalars['String'];
  path: Scalars['String'];
  port?: InputMaybe<Scalars['Float']>;
  protocol: Scalars['String'];
  query: Scalars['JSON'];
};

export type CargoSignedRequest = {
  __typename?: 'CargoSignedRequest';
  /** SHA256 Hashed Body */
  bodyHash: Scalars['String'];
  /** AWS Signature based on the request */
  signature: Scalars['String'];
  /** AWS format timestamp */
  timestamp: Scalars['String'];
};

export type ConfigurableProjectSettings = {
  description?: InputMaybe<Scalars['String']>;
  homePage?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  muiTheme?: InputMaybe<Scalars['JSON']>;
  name?: InputMaybe<Scalars['String']>;
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export type EmailLoginDto = {
  email: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
};

export type ForgotDto = {
  email: Scalars['String'];
  projectId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cargoChangePermissions: CargoPermissions;
  cargoServiceAddUser: Array<CargoPermissions>;
  cargoServiceChangePermissions: CargoPermissions;
  createProject: ProjectModel;
  forgotPassword: Scalars['Boolean'];
  loginEmail: AccessToken;
  loginUsername: AccessToken;
  resetPassword: Scalars['Boolean'];
  signup: AccessToken;
  updateProject: ProjectModel;
  updateProjectAuthMethods: ProjectModel;
  updateProjectSettings: ProjectModel;
};


export type MutationCargoChangePermissionsArgs = {
  bucket: Scalars['String'];
  change: CargoPermissionChange;
  user: Scalars['String'];
};


export type MutationCargoServiceAddUserArgs = {
  project: Scalars['String'];
  user: Scalars['String'];
};


export type MutationCargoServiceChangePermissionsArgs = {
  bucket: Scalars['String'];
  change: CargoPermissionChange;
  user: Scalars['String'];
};


export type MutationCreateProjectArgs = {
  authServiceUser: UsernameLoginDto;
  project: ProjectCreateInput;
};


export type MutationForgotPasswordArgs = {
  user: ForgotDto;
};


export type MutationLoginEmailArgs = {
  user: EmailLoginDto;
};


export type MutationLoginUsernameArgs = {
  user: UsernameLoginDto;
};


export type MutationResetPasswordArgs = {
  user: ResetDto;
};


export type MutationSignupArgs = {
  user: UserSignupDto;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['String'];
  settings: ConfigurableProjectSettings;
};


export type MutationUpdateProjectAuthMethodsArgs = {
  id: Scalars['String'];
  projectAuthMethods: ProjectAuthMethodsInput;
};


export type MutationUpdateProjectSettingsArgs = {
  id: Scalars['String'];
  projectSettings: ProjectSettingsInput;
};

export type Organization = {
  __typename?: 'Organization';
  _id: Scalars['ID'];
  bucket: Scalars['String'];
  name: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
};

export type ProjectAuthMethodsInput = {
  googleAuth?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectAuthMethodsModel = {
  __typename?: 'ProjectAuthMethodsModel';
  googleAuth: Scalars['Boolean'];
};

export type ProjectCreateInput = {
  allowSignup: Scalars['Boolean'];
  description: Scalars['String'];
  displayProjectName: Scalars['Boolean'];
  googleAuth: Scalars['Boolean'];
  homePage?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  muiTheme?: InputMaybe<Scalars['JSON']>;
  name: Scalars['String'];
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export type ProjectModel = {
  __typename?: 'ProjectModel';
  authMethods: ProjectAuthMethodsModel;
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  homePage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  logo?: Maybe<Scalars['String']>;
  muiTheme: Scalars['JSON'];
  name: Scalars['String'];
  redirectUrl?: Maybe<Scalars['String']>;
  settings: ProjectSettingsModel;
  updatedAt: Scalars['DateTime'];
  users: Array<UserModel>;
};

export type ProjectSettingsInput = {
  allowSignup?: InputMaybe<Scalars['Boolean']>;
  displayProjectName?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectSettingsModel = {
  __typename?: 'ProjectSettingsModel';
  allowSignup: Scalars['Boolean'];
  displayProjectName: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  /** Means for the admin to get all permissions for a given bucket */
  cargoGetAllBucketPermissions: Array<CargoPermissions>;
  /** Get all permissions for the user of the JWT for their project */
  cargoGetPermissions: Array<CargoPermissions>;
  /** Allows the currently authenticated user to get their own permisisons for a bucket */
  cargoGetPermissionsForBucket: CargoPermissions;
  cargoSignRequest: CargoSignedRequest;
  getOriganizations: Array<Organization>;
  getProject: ProjectModel;
  getUser: UserModel;
  listProjects: Array<ProjectModel>;
  projectUsers: Array<UserModel>;
  publicKey: Array<Scalars['String']>;
  users: Array<UserModel>;
};


export type QueryCargoGetAllBucketPermissionsArgs = {
  bucket: Scalars['String'];
};


export type QueryCargoGetPermissionsForBucketArgs = {
  bucket: Scalars['String'];
};


export type QueryCargoSignRequestArgs = {
  request: CargoResourceRequest;
};


export type QueryGetProjectArgs = {
  id: Scalars['String'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryProjectUsersArgs = {
  projectId: Scalars['String'];
};


export type QueryUsersArgs = {
  projectId: Scalars['ID'];
};

export type ResetDto = {
  code: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
};

export type UserModel = {
  __typename?: 'UserModel';
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  fullname?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  projectId: Scalars['String'];
  role: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  username?: Maybe<Scalars['String']>;
};

export type UserSignupDto = {
  email: Scalars['String'];
  fullname: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type UsernameLoginDto = {
  password: Scalars['String'];
  projectId: Scalars['String'];
  username: Scalars['String'];
};

export type CargoGetPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type CargoGetPermissionsQuery = { __typename?: 'Query', cargoGetPermissions: Array<{ __typename?: 'CargoPermissions', read: boolean, write: boolean, delete: boolean, admin: boolean, bucket: string }> };

export type GetOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationsQuery = { __typename?: 'Query', getOriganizations: Array<{ __typename?: 'Organization', _id: string, name: string, bucket: string }> };

export type CargoChangePermissionsMutationVariables = Exact<{
  change: CargoPermissionChange;
  user: Scalars['String'];
  bucket: Scalars['String'];
}>;


export type CargoChangePermissionsMutation = { __typename?: 'Mutation', cargoChangePermissions: { __typename?: 'CargoPermissions', _id: string, bucket: string, read: boolean, write: boolean, delete: boolean, admin: boolean, user: { __typename?: 'UserModel', id: string, email?: string | null } } };

export type CargoGetAllBucketPermissionsQueryVariables = Exact<{
  bucket: Scalars['String'];
}>;


export type CargoGetAllBucketPermissionsQuery = { __typename?: 'Query', cargoGetAllBucketPermissions: Array<{ __typename?: 'CargoPermissions', _id: string, bucket: string, read: boolean, write: boolean, delete: boolean, admin: boolean, user: { __typename?: 'UserModel', id: string, email?: string | null } }> };


export const CargoGetPermissionsDocument = gql`
    query cargoGetPermissions {
  cargoGetPermissions {
    read
    write
    delete
    admin
    bucket
  }
}
    `;

/**
 * __useCargoGetPermissionsQuery__
 *
 * To run a query within a React component, call `useCargoGetPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCargoGetPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCargoGetPermissionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCargoGetPermissionsQuery(baseOptions?: Apollo.QueryHookOptions<CargoGetPermissionsQuery, CargoGetPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CargoGetPermissionsQuery, CargoGetPermissionsQueryVariables>(CargoGetPermissionsDocument, options);
      }
export function useCargoGetPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CargoGetPermissionsQuery, CargoGetPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CargoGetPermissionsQuery, CargoGetPermissionsQueryVariables>(CargoGetPermissionsDocument, options);
        }
export type CargoGetPermissionsQueryHookResult = ReturnType<typeof useCargoGetPermissionsQuery>;
export type CargoGetPermissionsLazyQueryHookResult = ReturnType<typeof useCargoGetPermissionsLazyQuery>;
export type CargoGetPermissionsQueryResult = Apollo.QueryResult<CargoGetPermissionsQuery, CargoGetPermissionsQueryVariables>;
export const GetOrganizationsDocument = gql`
    query GetOrganizations {
  getOriganizations {
    _id
    name
    bucket
  }
}
    `;

/**
 * __useGetOrganizationsQuery__
 *
 * To run a query within a React component, call `useGetOrganizationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrganizationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrganizationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOrganizationsQuery(baseOptions?: Apollo.QueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>(GetOrganizationsDocument, options);
      }
export function useGetOrganizationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrganizationsQuery, GetOrganizationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrganizationsQuery, GetOrganizationsQueryVariables>(GetOrganizationsDocument, options);
        }
export type GetOrganizationsQueryHookResult = ReturnType<typeof useGetOrganizationsQuery>;
export type GetOrganizationsLazyQueryHookResult = ReturnType<typeof useGetOrganizationsLazyQuery>;
export type GetOrganizationsQueryResult = Apollo.QueryResult<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const CargoChangePermissionsDocument = gql`
    mutation cargoChangePermissions($change: CargoPermissionChange!, $user: String!, $bucket: String!) {
  cargoChangePermissions(change: $change, user: $user, bucket: $bucket) {
    _id
    user {
      id
      email
    }
    bucket
    read
    write
    delete
    admin
  }
}
    `;
export type CargoChangePermissionsMutationFn = Apollo.MutationFunction<CargoChangePermissionsMutation, CargoChangePermissionsMutationVariables>;

/**
 * __useCargoChangePermissionsMutation__
 *
 * To run a mutation, you first call `useCargoChangePermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCargoChangePermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cargoChangePermissionsMutation, { data, loading, error }] = useCargoChangePermissionsMutation({
 *   variables: {
 *      change: // value for 'change'
 *      user: // value for 'user'
 *      bucket: // value for 'bucket'
 *   },
 * });
 */
export function useCargoChangePermissionsMutation(baseOptions?: Apollo.MutationHookOptions<CargoChangePermissionsMutation, CargoChangePermissionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CargoChangePermissionsMutation, CargoChangePermissionsMutationVariables>(CargoChangePermissionsDocument, options);
      }
export type CargoChangePermissionsMutationHookResult = ReturnType<typeof useCargoChangePermissionsMutation>;
export type CargoChangePermissionsMutationResult = Apollo.MutationResult<CargoChangePermissionsMutation>;
export type CargoChangePermissionsMutationOptions = Apollo.BaseMutationOptions<CargoChangePermissionsMutation, CargoChangePermissionsMutationVariables>;
export const CargoGetAllBucketPermissionsDocument = gql`
    query CargoGetAllBucketPermissions($bucket: String!) {
  cargoGetAllBucketPermissions(bucket: $bucket) {
    _id
    user {
      id
      email
    }
    bucket
    read
    write
    delete
    admin
  }
}
    `;

/**
 * __useCargoGetAllBucketPermissionsQuery__
 *
 * To run a query within a React component, call `useCargoGetAllBucketPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCargoGetAllBucketPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCargoGetAllBucketPermissionsQuery({
 *   variables: {
 *      bucket: // value for 'bucket'
 *   },
 * });
 */
export function useCargoGetAllBucketPermissionsQuery(baseOptions: Apollo.QueryHookOptions<CargoGetAllBucketPermissionsQuery, CargoGetAllBucketPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CargoGetAllBucketPermissionsQuery, CargoGetAllBucketPermissionsQueryVariables>(CargoGetAllBucketPermissionsDocument, options);
      }
export function useCargoGetAllBucketPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CargoGetAllBucketPermissionsQuery, CargoGetAllBucketPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CargoGetAllBucketPermissionsQuery, CargoGetAllBucketPermissionsQueryVariables>(CargoGetAllBucketPermissionsDocument, options);
        }
export type CargoGetAllBucketPermissionsQueryHookResult = ReturnType<typeof useCargoGetAllBucketPermissionsQuery>;
export type CargoGetAllBucketPermissionsLazyQueryHookResult = ReturnType<typeof useCargoGetAllBucketPermissionsLazyQuery>;
export type CargoGetAllBucketPermissionsQueryResult = Apollo.QueryResult<CargoGetAllBucketPermissionsQuery, CargoGetAllBucketPermissionsQueryVariables>;