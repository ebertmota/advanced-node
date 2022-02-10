import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';
import { LoadFacebookUserApi } from '@/domain/contracts/apis';
import {
  setupFacebookAuthentication,
  FacebookAuthentication,
} from '@/domain/use-cases/facebook-authentication';
import { AuthenticationError } from '@/domain/entities/errors';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/domain/contracts/repos';
import { AccessToken, FacebookAccount } from '@/domain/entities';
import { TokenGenerator } from '@/domain/contracts/crypto';

type UserAccountRepo = LoadUserAccountRepository &
  SaveFacebookAccountRepository;

jest.mock('@/domain/entities/facebook-account');

describe('FacebookAuthentication', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepo: MockProxy<UserAccountRepo>;
  let sut: FacebookAuthentication;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookApi = mock<LoadFacebookUserApi>({
      loadUser: jest.fn(() =>
        Promise.resolve({
          name: 'any_fb_name',
          email: 'any_fb_email',
          facebook_id: 'any_fb_id',
        }),
      ),
    });
    userAccountRepo = mock();
    userAccountRepo.load.mockResolvedValue(undefined);
    userAccountRepo.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id',
    });
    crypto = mock<TokenGenerator>({
      generateToken: jest.fn(() => Promise.resolve('any_generated_token')),
    });
  });

  beforeEach(() => {
    sut = setupFacebookAuthentication(facebookApi, userAccountRepo, crypto);
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut({
      token,
    });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should throw AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new AuthenticationError());
  });

  it('should call UserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut({
      token,
    });

    expect(userAccountRepo.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const fbAccount = {
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebook_id: 'any_fb_id',
    };

    const FacebookAccountStub = jest.fn().mockImplementation(() => fbAccount);
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

    await sut({
      token,
    });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith(fbAccount);
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    await sut({
      token,
    });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should return an AccessToken on success', async () => {
    const authResult = await sut({
      token,
    });

    expect(authResult).toEqual({ accessToken: 'any_generated_token' });
  });

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    const error = new Error('fb_error');
    facebookApi.loadUser.mockRejectedValueOnce(error);
    const promise = sut({
      token,
    });

    expect(promise).rejects.toThrow(error);
  });

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    const error = new Error('load_error');
    userAccountRepo.load.mockRejectedValueOnce(error);
    const promise = sut({
      token,
    });

    expect(promise).rejects.toThrow(error);
  });

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    const error = new Error('save_error');
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(error);
    const promise = sut({
      token,
    });

    expect(promise).rejects.toThrow(error);
  });

  it('should rethrow if TokenGenerator throws', async () => {
    const error = new Error('token_error');
    crypto.generateToken.mockRejectedValueOnce(error);
    const promise = sut({
      token,
    });

    expect(promise).rejects.toThrow(error);
  });
});
