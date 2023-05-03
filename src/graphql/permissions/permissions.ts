/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CargoGetAllBucketPermissionsQueryVariables = Types.Exact<{
  bucket: Types.Scalars['String'];
}>;


export type CargoGetAllBucketPermissionsQuery = { __typename?: 'Query', cargoGetAllBucketPermissions: Array<{ __typename?: 'CargoPermissions', _id: string, bucket: string, read: boolean, write: boolean, delete: boolean, admin: boolean, user: { __typename?: 'UserModel', id: string, email?: string | null } }> };


export const CargoGetAllBucketPermissionsDocument = gql`
    query cargoGetAllBucketPermissions($bucket: String!) {
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