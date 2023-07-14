import { ApolloError, gql, QueryHookOptions, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import {
  GetReviewOutput,
  GetReviewsOutput,
  GetReviewsQueryInput,
  GetTodoOutput,
  GetTodosOutput,
  GetTodosQueryInput,
} from '../types';

export const GET_REVIEWS = gql`
  query Reviews($input: ReviewsInput!) {
    reviews(input: $input) {
      id
      content
      startedAt
      finishedAt
    }
  }
`;

type Data = {
  reviews: GetReviewOutput[];
};

type Variables = {
  input: GetReviewsQueryInput;
};

type UseGetReviewsQuery = {
  data?: GetReviewsOutput;
  loading: boolean;
  error?: ApolloError;
  refetch: (variables?: Variables) => void;
};

export const useGetReviewsQuery = (
  input: GetTodosQueryInput,
  today: Date,
  options?: QueryHookOptions<Data, Variables>,
): UseGetReviewsQuery => {
  const {
    data: response,
    loading,
    error,
    refetch,
  } = useQuery<Data, Variables>(GET_REVIEWS, {
    ...options,
    variables: { input },
  });

  const nowYear = today.getFullYear();
  const nowMonth = today.getMonth();
  const nowDate = today.getDate();

  const todayStartTimestamp = useMemo(
    () => new Date(nowYear, nowMonth, nowDate).getTime(),
    [nowYear, nowMonth, nowDate],
  );
  const nextStartTimestamp = useMemo(
    () => new Date(nowYear, nowMonth, nowDate + 1).getTime(),
    [nowYear, nowMonth, nowDate],
  );

  const data = response?.reviews.reduce(
    (obj: GetReviewsOutput, cur: GetReviewOutput) => {
      if (cur.startedAt && cur.finishedAt) {
        if (
          todayStartTimestamp <= cur.startedAt &&
          cur.finishedAt <= nextStartTimestamp
        ) {
          obj.reviews.push(cur);
        }
      } else {
        obj.timeUndecidedReviews.push(cur);
      }
      return obj;
    },
    { timeUndecidedReviews: [], reviews: [] },
  );

  return {
    data,
    loading,
    error: loading ? undefined : error,
    refetch,
  };
};
