import { Router } from 'express';
import { adaptExpressRoute as adapt } from '@/main/adapters';
import { makeFacebookLoginController } from '../factories';

export default (router: Router): void => {
  router.post('/login/facebook', adapt(makeFacebookLoginController()));
};
