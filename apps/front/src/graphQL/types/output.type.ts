export type GetMeOutput = {
  email: string;
  id: number;
  name: string;
  profileImageUrl: string;
};

export type GetTodoOutput = {
  completedAt?: number;
  content: string;
  finishedAt?: number;
  id: number;
  startedAt?: number;
};

export type GetTodosOutput = {
  timeUndecidedTodos: GetTodoOutput[];
  todos: GetTodoOutput[];
};

export type GetReviewOutput = {
  content: string;
  finishedAt?: number;
  id: number;
  startedAt?: number;
};

export type GetReviewsOutput = {
  timeUndecidedReviews: GetReviewOutput[];
  reviews: GetReviewOutput[];
};
