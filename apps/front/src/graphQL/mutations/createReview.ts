import { ApolloError, gql, useMutation } from '@apollo/client';

import { GET_REVIEWS } from '../queries';
import { CreateReviewMutationInput, GetReviewsQueryInput } from '../types';

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      content
      finishedAt
      startedAt
    }
  }
`;

type UseCreateReviewMutation = {
  createReview: (input: CreateReviewMutationInput) => Promise<void>;
  loading: boolean;
  error?: ApolloError;
};

type Variables = {
  input: CreateReviewMutationInput;
};

export const useCreateReviewMutation = (
  getReviewsQueryInput: GetReviewsQueryInput,
): UseCreateReviewMutation => {
  const [createReviewMutation, { loading, error }] = useMutation<
    void,
    Variables
  >(CREATE_REVIEW, {
    refetchQueries: [
      {
        query: GET_REVIEWS,
        variables: {
          input: getReviewsQueryInput,
        },
      },
    ],
  });

  const createReview = async (input: CreateReviewMutationInput) => {
    await createReviewMutation({
      variables: {
        input,
      },
    });
  };

  return { createReview, loading, error };
};
