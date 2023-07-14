import { ApolloError, gql, useMutation } from '@apollo/client';

import { GET_TODOS } from '../queries';
import { GetTodosQueryInput, UpdateTodoMutationInput } from '../types';

export const UPDATE_TODO = gql`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      id
      content
      completedAt
      finishedAt
      startedAt
    }
  }
`;

type UseUpdateTodoMutation = {
  updateTodo: (input: UpdateTodoMutationInput) => Promise<void>;
  loading: boolean;
  error?: ApolloError;
};

type Variables = {
  input: UpdateTodoMutationInput;
};

export const useUpdateTodoMutation = (
  getTodosQueryInput: GetTodosQueryInput,
): UseUpdateTodoMutation => {
  const [updateTodoMutation, { loading, error }] = useMutation<void, Variables>(
    UPDATE_TODO,
    {
      refetchQueries: [
        {
          query: GET_TODOS,
          variables: {
            input: getTodosQueryInput,
          },
        },
      ],
      onError: (err) => {
        console.log('updateTodoMutation');
        console.log(err.message);
      },
    },
  );

  const updateTodo = async (input: UpdateTodoMutationInput) => {
    await updateTodoMutation({
      variables: {
        input,
      },
    });
  };

  return { updateTodo, loading, error };
};
