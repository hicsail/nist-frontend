/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetCommentsQueryVariables = Types.Exact<{
  fileId: Types.Scalars['String'];
}>;


export type GetCommentsQuery = { __typename?: 'Query', getFileByFileId?: { __typename?: 'File', comments: Array<{ __typename?: 'Comment', _id: string, date: any, content: string, user: { __typename?: 'UserModel', id: string, username?: string | null, fullname?: string | null, email?: string | null }, replies: Array<{ __typename?: 'Comment', _id: string, date: any, content: string, user: { __typename?: 'UserModel', id: string, username?: string | null, fullname?: string | null, email?: string | null }, replyTo?: { __typename?: 'UserModel', id: string, username?: string | null, fullname?: string | null, email?: string | null } | null }> }> } | null };

export type AddCommentMutationVariables = Types.Exact<{
  fileId: Types.Scalars['String'];
  content: Types.Scalars['String'];
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment: { __typename?: 'Comment', _id: string, date: any, content: string, file?: { __typename?: 'File', _id: string, fileId: string, bucket: string } | null, user: { __typename?: 'UserModel', id: string, username?: string | null, fullname?: string | null, email?: string | null }, replyTo?: { __typename?: 'UserModel', id: string, username?: string | null, fullname?: string | null, email?: string | null } | null } };

export type AddReplyMutationVariables = Types.Exact<{
  fileId: Types.Scalars['String'];
  parentId: Types.Scalars['String'];
  content: Types.Scalars['String'];
  replyTo?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type AddReplyMutation = { __typename?: 'Mutation', addComment: { __typename?: 'Comment', _id: string, parentId?: string | null, date: any, content: string, file?: { __typename?: 'File', _id: string, fileId: string, bucket: string } | null, user: { __typename?: 'UserModel', id: string, username?: string | null, fullname?: string | null, email?: string | null }, replyTo?: { __typename?: 'UserModel', id: string, username?: string | null, fullname?: string | null, email?: string | null } | null } };

export type DeleteCommentMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: boolean };


export const GetCommentsDocument = gql`
    query GetComments($fileId: String!) {
  getFileByFileId(fileId: $fileId) {
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
        replyTo {
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
 * __useGetCommentsQuery__
 *
 * To run a query within a React component, call `useGetCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentsQuery({
 *   variables: {
 *      fileId: // value for 'fileId'
 *   },
 * });
 */
export function useGetCommentsQuery(baseOptions: Apollo.QueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, options);
      }
export function useGetCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, options);
        }
export type GetCommentsQueryHookResult = ReturnType<typeof useGetCommentsQuery>;
export type GetCommentsLazyQueryHookResult = ReturnType<typeof useGetCommentsLazyQuery>;
export type GetCommentsQueryResult = Apollo.QueryResult<GetCommentsQuery, GetCommentsQueryVariables>;
export const AddCommentDocument = gql`
    mutation AddComment($fileId: String!, $content: String!) {
  addComment(input: {file: $fileId, content: $content}) {
    _id
    file {
      _id
      fileId
      bucket
    }
    user {
      id
      username
      fullname
      email
    }
    replyTo {
      id
      username
      fullname
      email
    }
    date
    content
  }
}
    `;
export type AddCommentMutationFn = Apollo.MutationFunction<AddCommentMutation, AddCommentMutationVariables>;

/**
 * __useAddCommentMutation__
 *
 * To run a mutation, you first call `useAddCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCommentMutation, { data, loading, error }] = useAddCommentMutation({
 *   variables: {
 *      fileId: // value for 'fileId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useAddCommentMutation(baseOptions?: Apollo.MutationHookOptions<AddCommentMutation, AddCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCommentMutation, AddCommentMutationVariables>(AddCommentDocument, options);
      }
export type AddCommentMutationHookResult = ReturnType<typeof useAddCommentMutation>;
export type AddCommentMutationResult = Apollo.MutationResult<AddCommentMutation>;
export type AddCommentMutationOptions = Apollo.BaseMutationOptions<AddCommentMutation, AddCommentMutationVariables>;
export const AddReplyDocument = gql`
    mutation AddReply($fileId: String!, $parentId: String!, $content: String!, $replyTo: String) {
  addComment(
    input: {file: $fileId, parentId: $parentId, content: $content, replyTo: $replyTo}
  ) {
    _id
    file {
      _id
      fileId
      bucket
    }
    parentId
    user {
      id
      username
      fullname
      email
    }
    replyTo {
      id
      username
      fullname
      email
    }
    date
    content
  }
}
    `;
export type AddReplyMutationFn = Apollo.MutationFunction<AddReplyMutation, AddReplyMutationVariables>;

/**
 * __useAddReplyMutation__
 *
 * To run a mutation, you first call `useAddReplyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddReplyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addReplyMutation, { data, loading, error }] = useAddReplyMutation({
 *   variables: {
 *      fileId: // value for 'fileId'
 *      parentId: // value for 'parentId'
 *      content: // value for 'content'
 *      replyTo: // value for 'replyTo'
 *   },
 * });
 */
export function useAddReplyMutation(baseOptions?: Apollo.MutationHookOptions<AddReplyMutation, AddReplyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddReplyMutation, AddReplyMutationVariables>(AddReplyDocument, options);
      }
export type AddReplyMutationHookResult = ReturnType<typeof useAddReplyMutation>;
export type AddReplyMutationResult = Apollo.MutationResult<AddReplyMutation>;
export type AddReplyMutationOptions = Apollo.BaseMutationOptions<AddReplyMutation, AddReplyMutationVariables>;
export const DeleteCommentDocument = gql`
    mutation DeleteComment($id: String!) {
  deleteComment(id: $id)
}
    `;
export type DeleteCommentMutationFn = Apollo.MutationFunction<DeleteCommentMutation, DeleteCommentMutationVariables>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCommentMutation, DeleteCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, options);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<DeleteCommentMutation, DeleteCommentMutationVariables>;