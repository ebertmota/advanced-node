import { FacebookAuthenticationUseCase } from '@/domain/use-cases';
import {
  makeFacebookApi,
  makeJwtTokenGenerator,
  makePgUserAccountRepository,
} from '@/main/factories';

export const makeFacebookAuthentication = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenGenerator(),
  );
};
