import { adaptExpressMiddleware } from '../adapters';
import { makeAuthenticationMiddleware } from '../factories';

export const auth = adaptExpressMiddleware(makeAuthenticationMiddleware());
