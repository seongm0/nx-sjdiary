import { ApolloError, gql, useMutation } from '@apollo/client';

import { GET_TODOS } from '../queries';
import { DeleteTodoMutationInput } from '../types';

export const DELETE_TODO = gql`
  mutation DeleteTodo($input: DeleteTodoInput!) {
    deleteTodo(input: $input)
  }
`;

type UseDeleteTodoMutation = {
  deleteTodo: (input: DeleteTodoMutationInput) => Promise<void>;
  loading: boolean;
  error?: ApolloError;
};

type Variables = {
  input: DeleteTodoMutationInput;
};

export const useDeleteTodoMutation = (): UseDeleteTodoMutation => {
  const [deleteTodoMutation, { loading, error }] = useMutation<
    boolean,
    Variables
  >(DELETE_TODO, {
    refetchQueries: [GET_TODOS],
  });

  const deleteTodo = async (input: DeleteTodoMutationInput) => {
    await deleteTodoMutation({
      variables: {
        input,
      },
    });
  };

  return {
    deleteTodo,
    loading,
    error,
  };
};
