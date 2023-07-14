import { ApolloError, ApolloQueryResult, gql, useQuery } from '@apollo/client';

import { GetMeOutput } from '../types';

export const GET_ME = gql`
  query Me {
    me {
      email
      id
      name
      profileImageUrl
    }
  }
`;
type UseGetMyQuery = {
  data?: GetMeOutput;
  loading: boolean;
  error?: ApolloError;
  refetch: () => Promise<
    ApolloQueryResult<{
      me: GetMeOutput;
    }>
  >;
};

export const useGetMeQuery = (): UseGetMyQuery => {
  const { data, loading, error, refetch } =
    useQuery<{ me: GetMeOutput }>(GET_ME);

  return {
    data: data?.me,
    loading,
    error,
    refetch,
  };
};
