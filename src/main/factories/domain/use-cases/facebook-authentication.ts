import {
  setupFacebookAuthentication,
  FacebookAuthentication,
} from '@/domain/use-cases';
import {
  makeFacebookApi,
  makeJwtTokenGenerator,
  makePgUserAccountRepository,
} from '@/main/factories';

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenGenerator(),
  );
};
