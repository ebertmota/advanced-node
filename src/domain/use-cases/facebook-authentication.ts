import { AuthenticationError } from '@/domain/entities/errors';
import { LoadFacebookUserApi } from '@/domain/contracts/apis';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '../contracts/repos';
import { AccessToken, FacebookAccount } from '@/domain/entities';
import { TokenGenerator } from '../contracts/crypto';

export type FacebookAuthentication = (params: {
  token: string;
}) => Promise<{ accessToken: string }>;

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator,
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup =
  (facebookApi, userAccountRepo, crypto) => async params => {
    const fbData = await facebookApi.loadUser(params);

    if (fbData) {
      const accountData = await userAccountRepo.load({
        email: fbData.email,
      });
      const fbAccount = new FacebookAccount(fbData, accountData);
      const { id } = await userAccountRepo.saveWithFacebook(fbAccount);
      const accessToken = await crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs,
      });
      return {
        accessToken,
      };
    }

    throw new AuthenticationError();
  };
