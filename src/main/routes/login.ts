import { Router } from 'express';
import { adaptExpressRoute as adapt } from '@/infra/http';
import { makeFacebookLoginController } from '../factories';

export default (router: Router): void => {
  router.post('/login/facebook', adapt(makeFacebookLoginController()));
};
