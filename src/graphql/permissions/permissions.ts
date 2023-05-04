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

export type CargoGetPermissionsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CargoGetPermissionsQuery = { __typename?: 'Query', cargoGetPermissions: Array<{ __typename?: 'CargoPermissions', read: boolean, write: boolean, delete: boolean, admin: boolean, bucket: string }> };

export type CargoChangePermissionsMutationVariables = Types.Exact<{
  change: Types.CargoPermissionChange;
  user: Types.Scalars['String'];
  bucket: Types.Scalars['String'];
}>;


export type CargoChangePermissionsMutation = { __typename?: 'Mutation', cargoChangePermissions: { __typename?: 'CargoPermissions', _id: string, bucket: string, read: boolean, write: boolean, delete: boolean, admin: boolean, user: { __typename?: 'UserModel', id: string, email?: string | null } } };


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