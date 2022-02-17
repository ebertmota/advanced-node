import { AuthenticationError } from '@/domain/entities/errors';
import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways';
import { LoadUserAccount, SaveFacebookAccount } from '../contracts/repos';
import { AccessToken, FacebookAccount } from '@/domain/entities';

export type FacebookAuthentication = (params: {
  token: string;
}) => Promise<{ accessToken: string }>;

type Setup = (
  facebook: LoadFacebookUser,
  userAccountRepo: LoadUserAccount & SaveFacebookAccount,
  token: TokenGenerator,
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup =
  (facebook, userAccountRepo, token) => async params => {
    const fbData = await facebook.loadUser(params);

    if (fbData) {
      const accountData = await userAccountRepo.load({
        email: fbData.email,
      });
      const fbAccount = new FacebookAccount(fbData, accountData);
      const { id } = await userAccountRepo.saveWithFacebook(fbAccount);
      const accessToken = await token.generate({
        key: id,
        expirationInMs: AccessToken.expirationInMs,
      });
      return {
        accessToken,
      };
    }

    throw new AuthenticationError();
  };
