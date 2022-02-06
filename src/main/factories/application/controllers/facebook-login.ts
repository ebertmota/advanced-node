import { FacebookLoginController } from '@/application/controllers';
import { makeFacebookAuthenticationService } from '@/main/factories';

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthenticationService());
};
