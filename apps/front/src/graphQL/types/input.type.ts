export type CreateUserInput = {
  email: string;
  name: string;
  profileImageUrl: string;
};

export type CreateTodoMutationInput = {
  content?: string;
  finishedAt?: number;
  startedAt?: number;
};

export type CreateReviewMutationInput = CreateTodoMutationInput;

export type UpdateTodoMutationInput = {
  id: number;
  content?: string;
  startedAt?: number;
  finishedAt?: number;
  isCompleted?: boolean;
};

export type UpdateReviewMutationInput = Omit<
  UpdateTodoMutationInput,
  'completedAt'
>;

export type GetTodosQueryInput = {
  endDate: number;
  startDate: number;
};

export type GetReviewsQueryInput = GetTodosQueryInput;

export type DeleteTodoMutationInput = {
  id: number;
};

export type DeleteReviewMutationInput = DeleteTodoMutationInput;
