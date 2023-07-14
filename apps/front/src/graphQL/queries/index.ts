import { gql } from '@apollo/client';

export * from './getTodos';
export * from './getMe';
export * from './getReviews';

export const VERIFY_USER = gql`
  query VerifyUser {
    verifyUser
  }
`;
