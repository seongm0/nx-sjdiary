import { ApolloError, gql, useMutation } from '@apollo/client';

import { GET_ME } from '../queries';
import { CreateUserInput } from '../types';

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
    }
  }
`;

type UseCreateUserMutation = {
  createUser: (input: CreateUserInput) => void;
  loading: boolean;
  error?: ApolloError;
};

type Variables = {
  input: CreateUserInput;
};

export const useCreateUserMutation = (): UseCreateUserMutation => {
  const [createUserMutation, { loading, error }] = useMutation<
    unknown,
    Variables
  >(CREATE_USER, {
    refetchQueries: [GET_ME],
  });

  const createUser = async (input: CreateUserInput) => {
    await createUserMutation({
      variables: {
        input,
      },
    });
  };

  return {
    createUser,
    loading,
    error,
  };
};
