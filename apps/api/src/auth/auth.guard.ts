import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export const JWT = 'jwt';

@Injectable()
export class GqlAuthGuard extends AuthGuard(JWT) {
  private readonly logger = new Logger(this.constructor.name);
  getRequest(context: ExecutionContext) {
    const req = GqlExecutionContext.create(context).getContext().req;
    this.logger.debug(JSON.stringify(req.user, null, 2));
    return req;
  }
}
