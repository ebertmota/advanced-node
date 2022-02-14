import {
  setupFacebookAuthentication,
  FacebookAuthentication,
} from '@/domain/use-cases';
import {
  makeFacebookApi,
  makeJwtTokenHandler,
  makePgUserAccountRepository,
} from '@/main/factories';

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenHandler(),
  );
};
