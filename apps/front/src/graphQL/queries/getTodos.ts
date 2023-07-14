import { ApolloError, gql, QueryHookOptions, useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';

import { GetTodoOutput, GetTodosOutput, GetTodosQueryInput } from '../types';

export const GET_TODOS = gql`
  query Todos($input: TodosInput!) {
    todos(input: $input) {
      id
      content
      startedAt
      finishedAt
      completedAt
    }
  }
`;

type Variables = {
  input: GetTodosQueryInput;
};

type Data = {
  todos: GetTodoOutput[];
};

type UseGetTodosQuery = {
  data?: GetTodosOutput;
  loading: boolean;
  error?: ApolloError;
  refetch: (variables?: Variables) => void;
};

export const useGetTodosQuery = (
  input: GetTodosQueryInput,
  today: Date,
  options?: QueryHookOptions<Data, Variables>,
): UseGetTodosQuery => {
  const {
    data: response,
    loading,
    error,
    refetch,
  } = useQuery<Data, Variables>(GET_TODOS, {
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

  const data = response?.todos.reduce(
    (obj: GetTodosOutput, cur: GetTodoOutput) => {
      if (cur.startedAt && cur.finishedAt) {
        if (
          todayStartTimestamp <= cur.startedAt &&
          cur.finishedAt <= nextStartTimestamp
        ) {
          obj.todos.push(cur);
        }
      } else {
        obj.timeUndecidedTodos.push(cur);
      }
      return obj;
    },
    { timeUndecidedTodos: [], todos: [] },
  );

  return {
    data,
    loading,
    error: loading ? undefined : error,
    refetch,
  };
};
