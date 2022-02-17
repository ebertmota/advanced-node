import { AuthenticationMiddleware } from '@/application/middlewares';
import { makeJwtTokenHandler } from '../..';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJwtTokenHandler();
  return new AuthenticationMiddleware(jwt.validate.bind(jwt));
};
