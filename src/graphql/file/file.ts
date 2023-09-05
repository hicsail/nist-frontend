/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetFileQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetFileQuery = { __typename?: 'Query', getFileByFileId?: { __typename?: 'File', _id: string, fileId: string, bucket: string, comments: Array<{ __typename?: 'Comment', _id: string, date: any, content: string, user: { __typename?: 'UserModel', id: string, username?: string | null, fullname?: string | null, email?: string | null }, replies: Array<{ __typename?: 'Comment', _id: string, date: any, content: string, user: { __typename?: 'UserModel', id: string, username?: string | null, fullname?: string | null, email?: string | null } }> }> } | null };

export type AddFileMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  bucket: Types.Scalars['String'];
}>;


export type AddFileMutation = { __typename?: 'Mutation', addFile: { __typename?: 'File', _id: string, fileId: string, bucket: string } };

export type DeleteFileMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: boolean };


export const GetFileDocument = gql`
    query GetFile($id: String!) {
  getFileByFileId(fileId: $id) {
    _id
    fileId
    bucket
    comments {
      _id
      user {
        id
        username
        fullname
        email
      }
      date
      content
      replies {
        _id
        user {
          id
          username
          fullname
          email
        }
        date
        content
      }
    }
  }
}
    `;

/**
 * __useGetFileQuery__
 *
 * To run a query within a React component, call `useGetFileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFileQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFileQuery(baseOptions: Apollo.QueryHookOptions<GetFileQuery, GetFileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFileQuery, GetFileQueryVariables>(GetFileDocument, options);
      }
export function useGetFileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFileQuery, GetFileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFileQuery, GetFileQueryVariables>(GetFileDocument, options);
        }
export type GetFileQueryHookResult = ReturnType<typeof useGetFileQuery>;
export type GetFileLazyQueryHookResult = ReturnType<typeof useGetFileLazyQuery>;
export type GetFileQueryResult = Apollo.QueryResult<GetFileQuery, GetFileQueryVariables>;
export const AddFileDocument = gql`
    mutation AddFile($id: String!, $bucket: String!) {
  addFile(input: {fileId: $id, bucket: $bucket}) {
    _id
    fileId
    bucket
  }
}
    `;
export type AddFileMutationFn = Apollo.MutationFunction<AddFileMutation, AddFileMutationVariables>;

/**
 * __useAddFileMutation__
 *
 * To run a mutation, you first call `useAddFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFileMutation, { data, loading, error }] = useAddFileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      bucket: // value for 'bucket'
 *   },
 * });
 */
export function useAddFileMutation(baseOptions?: Apollo.MutationHookOptions<AddFileMutation, AddFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFileMutation, AddFileMutationVariables>(AddFileDocument, options);
      }
export type AddFileMutationHookResult = ReturnType<typeof useAddFileMutation>;
export type AddFileMutationResult = Apollo.MutationResult<AddFileMutation>;
export type AddFileMutationOptions = Apollo.BaseMutationOptions<AddFileMutation, AddFileMutationVariables>;
export const DeleteFileDocument = gql`
    mutation DeleteFile($id: String!) {
  deleteFile(fileId: $id)
}
    `;
export type DeleteFileMutationFn = Apollo.MutationFunction<DeleteFileMutation, DeleteFileMutationVariables>;

/**
 * __useDeleteFileMutation__
 *
 * To run a mutation, you first call `useDeleteFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFileMutation, { data, loading, error }] = useDeleteFileMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFileMutation, DeleteFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFileMutation, DeleteFileMutationVariables>(DeleteFileDocument, options);
      }
export type DeleteFileMutationHookResult = ReturnType<typeof useDeleteFileMutation>;
export type DeleteFileMutationResult = Apollo.MutationResult<DeleteFileMutation>;
export type DeleteFileMutationOptions = Apollo.BaseMutationOptions<DeleteFileMutation, DeleteFileMutationVariables>;