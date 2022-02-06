import { Router } from 'express';
import { adaptExpressRoute as adapt } from '@/infra/http';
import { makeFacebookLoginController } from '../factories';

export default (router: Router): void => {
  router.post('/api/login/facebook', adapt(makeFacebookLoginController()));
};
