import { ApolloError, gql, useMutation } from '@apollo/client';

import { GET_TODOS } from '../queries';
import { CreateTodoMutationInput } from '../types';
import { GetTodosQueryInput } from '../types/input.type';

export const CREATE_TODO = gql`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      id
      content
      completedAt
      finishedAt
      startedAt
    }
  }
`;

type UseCreateTodoMutation = {
  createTodo: (input: CreateTodoMutationInput) => Promise<void>;
  loading: boolean;
  error?: ApolloError;
};

type Variables = {
  input: CreateTodoMutationInput;
};

export const useCreateTodoMutation = (
  getTodosQueryInput: GetTodosQueryInput,
): UseCreateTodoMutation => {
  const [createTodoMutation, { loading, error }] = useMutation<
    { createTodo: any },
    Variables
  >(CREATE_TODO, {
    refetchQueries: [
      {
        query: GET_TODOS,
        variables: {
          input: getTodosQueryInput,
        },
      },
    ],
    onError: (err) => {
      console.log('createTodoMutation');
      console.log(err.message);
    },
  });

  const createTodo = async (
    input: CreateTodoMutationInput,
    options?: { setContent: () => void },
  ) => {
    const { data } = await createTodoMutation({
      variables: {
        input,
      },
    });

    if (data && data.createTodo && options) {
      options.setContent();
    }
  };

  return { createTodo, loading, error };
};
