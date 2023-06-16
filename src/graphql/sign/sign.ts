/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CargoPresignQueryVariables = Types.Exact<{
  presignRequest: Types.CargoPresignRequest;
}>;


export type CargoPresignQuery = { __typename?: 'Query', cargoPresign: string };


export const CargoPresignDocument = gql`
    query cargoPresign($presignRequest: CargoPresignRequest!) {
  cargoPresign(presignRequest: $presignRequest)
}
    `;

/**
 * __useCargoPresignQuery__
 *
 * To run a query within a React component, call `useCargoPresignQuery` and pass it any options that fit your needs.
 * When your component renders, `useCargoPresignQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCargoPresignQuery({
 *   variables: {
 *      presignRequest: // value for 'presignRequest'
 *   },
 * });
 */
export function useCargoPresignQuery(baseOptions: Apollo.QueryHookOptions<CargoPresignQuery, CargoPresignQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CargoPresignQuery, CargoPresignQueryVariables>(CargoPresignDocument, options);
      }
export function useCargoPresignLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CargoPresignQuery, CargoPresignQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CargoPresignQuery, CargoPresignQueryVariables>(CargoPresignDocument, options);
        }
export type CargoPresignQueryHookResult = ReturnType<typeof useCargoPresignQuery>;
export type CargoPresignLazyQueryHookResult = ReturnType<typeof useCargoPresignLazyQuery>;
export type CargoPresignQueryResult = Apollo.QueryResult<CargoPresignQuery, CargoPresignQueryVariables>;