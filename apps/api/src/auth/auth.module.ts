import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JWT } from './auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: JWT })],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
