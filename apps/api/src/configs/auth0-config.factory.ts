import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

interface Auth0Config {
  domain: string;
  audience: string;
}

export const Auth0ConfigFactory = registerAs(
  'auth0',
  (): Auth0Config => ({
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
  }),
);

export const InjectAuth0Config = () => Inject(Auth0ConfigFactory.KEY);
