import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IAuth0User } from './auth.interface';

export const Auth0User = createParamDecorator(
  (data: unknown, context: ExecutionContext): IAuth0User =>
    GqlExecutionContext.create(context).getContext().req.user,
);
