/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NistGetJupterNotebookMutationVariables = Types.Exact<{
  fileURL: Types.Scalars['String'];
  fileName: Types.Scalars['String'];
}>;


export type NistGetJupterNotebookMutation = { __typename?: 'Mutation', nistGetJupterNotebook: string };


export const NistGetJupterNotebookDocument = gql`
    mutation nistGetJupterNotebook($fileURL: String!, $fileName: String!) {
  nistGetJupterNotebook(fileURL: $fileURL, fileName: $fileName)
}
    `;
export type NistGetJupterNotebookMutationFn = Apollo.MutationFunction<NistGetJupterNotebookMutation, NistGetJupterNotebookMutationVariables>;

/**
 * __useNistGetJupterNotebookMutation__
 *
 * To run a mutation, you first call `useNistGetJupterNotebookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNistGetJupterNotebookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [nistGetJupterNotebookMutation, { data, loading, error }] = useNistGetJupterNotebookMutation({
 *   variables: {
 *      fileURL: // value for 'fileURL'
 *      fileName: // value for 'fileName'
 *   },
 * });
 */
export function useNistGetJupterNotebookMutation(baseOptions?: Apollo.MutationHookOptions<NistGetJupterNotebookMutation, NistGetJupterNotebookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<NistGetJupterNotebookMutation, NistGetJupterNotebookMutationVariables>(NistGetJupterNotebookDocument, options);
      }
export type NistGetJupterNotebookMutationHookResult = ReturnType<typeof useNistGetJupterNotebookMutation>;
export type NistGetJupterNotebookMutationResult = Apollo.MutationResult<NistGetJupterNotebookMutation>;
export type NistGetJupterNotebookMutationOptions = Apollo.BaseMutationOptions<NistGetJupterNotebookMutation, NistGetJupterNotebookMutationVariables>;