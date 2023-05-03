/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    query cargoGetPermissions {\n        cargoGetPermissions {\n            read\n            write\n            delete\n            admin\n            bucket\n        }\n    }\n  ": types.CargoGetPermissionsDocument,
    "\n    query GetOrganizations {\n        getOriganizations {\n            _id\n            name\n            bucket\n        }\n    }\n  ": types.GetOrganizationsDocument,
    "\n  mutation cargoChangePermissions($change : CargoPermissionChange!, $user: String!, $bucket: String!) {\n    cargoChangePermissions(change: $change, user: $user, bucket: $bucket) {\n      _id\n      user {\n        id\n        email\n      }\n      bucket\n      read\n      write\n      delete\n      admin\n    }\n  }\n": types.CargoChangePermissionsDocument,
    "\n    query CargoGetAllBucketPermissions($bucket: String!) {\n      cargoGetAllBucketPermissions(bucket: $bucket) {\n        _id\n        user {\n          id\n          email\n        }\n        bucket\n        read\n        write\n        delete\n        admin\n      }\n    }\n  ": types.CargoGetAllBucketPermissionsDocument,
    "\n        query GetOrganizations {\n            getOriganizations {\n                _id\n                name \n                bucket\n            }\n        }\n    ": types.GetOrganizationsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query cargoGetPermissions {\n        cargoGetPermissions {\n            read\n            write\n            delete\n            admin\n            bucket\n        }\n    }\n  "): (typeof documents)["\n    query cargoGetPermissions {\n        cargoGetPermissions {\n            read\n            write\n            delete\n            admin\n            bucket\n        }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetOrganizations {\n        getOriganizations {\n            _id\n            name\n            bucket\n        }\n    }\n  "): (typeof documents)["\n    query GetOrganizations {\n        getOriganizations {\n            _id\n            name\n            bucket\n        }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation cargoChangePermissions($change : CargoPermissionChange!, $user: String!, $bucket: String!) {\n    cargoChangePermissions(change: $change, user: $user, bucket: $bucket) {\n      _id\n      user {\n        id\n        email\n      }\n      bucket\n      read\n      write\n      delete\n      admin\n    }\n  }\n"): (typeof documents)["\n  mutation cargoChangePermissions($change : CargoPermissionChange!, $user: String!, $bucket: String!) {\n    cargoChangePermissions(change: $change, user: $user, bucket: $bucket) {\n      _id\n      user {\n        id\n        email\n      }\n      bucket\n      read\n      write\n      delete\n      admin\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query CargoGetAllBucketPermissions($bucket: String!) {\n      cargoGetAllBucketPermissions(bucket: $bucket) {\n        _id\n        user {\n          id\n          email\n        }\n        bucket\n        read\n        write\n        delete\n        admin\n      }\n    }\n  "): (typeof documents)["\n    query CargoGetAllBucketPermissions($bucket: String!) {\n      cargoGetAllBucketPermissions(bucket: $bucket) {\n        _id\n        user {\n          id\n          email\n        }\n        bucket\n        read\n        write\n        delete\n        admin\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        query GetOrganizations {\n            getOriganizations {\n                _id\n                name \n                bucket\n            }\n        }\n    "): (typeof documents)["\n        query GetOrganizations {\n            getOriganizations {\n                _id\n                name \n                bucket\n            }\n        }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;