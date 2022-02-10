import { FacebookLoginController } from '@/application/controllers';
import { makeFacebookAuthentication } from '@/main/factories';

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthentication());
};
