/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
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
  /** ID of the user from the Auth microservice */
  user: Scalars['ID'];
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

export type CargoSignedReqeuest = {
  __typename?: 'CargoSignedReqeuest';
  /** SHA256 Hashed Body */
  bodyHash: Scalars['String'];
  /** AWS Signature based on the request */
  signature: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cargoChangePermissions: CargoPermissions;
  cargoServiceAddUser: Array<CargoPermissions>;
  cargoServiceChangePermissions: CargoPermissions;
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

export type Organization = {
  __typename?: 'Organization';
  _id: Scalars['ID'];
  bucket: Scalars['String'];
  name: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** Means for the admin to get all permissions for a given bucket */
  cargoGetAllBucketPermissions: Array<CargoPermissions>;
  /** Get all permissions for the user of the JWT for their project */
  cargoGetPermissions: Array<CargoPermissions>;
  /** Allows the currently authenticated user to get their own permisisons for a bucket */
  cargoGetPermissionsForBucket: CargoPermissions;
  cargoSignRequest: CargoSignedReqeuest;
  getOriganizations: Array<Organization>;
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

export type CargoGetPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type CargoGetPermissionsQuery = { __typename?: 'Query', cargoGetPermissions: Array<{ __typename?: 'CargoPermissions', read: boolean, write: boolean, delete: boolean, admin: boolean, bucket: string }> };

export type GetOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationsQuery = { __typename?: 'Query', getOriganizations: Array<{ __typename?: 'Organization', _id: string, name: string, bucket: string }> };


export const CargoGetPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cargoGetPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cargoGetPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"delete"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}}]} as unknown as DocumentNode<CargoGetPermissionsQuery, CargoGetPermissionsQueryVariables>;
export const GetOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOriganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bucket"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;