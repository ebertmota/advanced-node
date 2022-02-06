import { FacebookAuthenticationService } from '@/data/services';
import {
  makeFacebookApi,
  makeJwtTokenGenerator,
  makePgUserAccountRepository,
} from '@/main/factories';

export const makeFacebookAuthenticationService =
  (): FacebookAuthenticationService => {
    return new FacebookAuthenticationService(
      makeFacebookApi(),
      makePgUserAccountRepository(),
      makeJwtTokenGenerator(),
    );
  };
