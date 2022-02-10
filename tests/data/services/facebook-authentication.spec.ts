import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';
import { LoadFacebookUserApi } from '@/domain/contracts/apis';
import { FacebookAuthenticationService } from '@/domain/services/facebook-authentication';
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

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepo: MockProxy<UserAccountRepo>;
  let sut: FacebookAuthenticationService;
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
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo,
      crypto,
    );
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({
      token,
    });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token,
    });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform({
      token,
    });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call UserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({
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

    await sut.perform({
      token,
    });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith(fbAccount);
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({
      token,
    });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should return an AccessToken on success', async () => {
    const authResult = await sut.perform({
      token,
    });

    expect(authResult).toEqual(new AccessToken('any_generated_token'));
  });

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    const error = new Error('fb_error');
    facebookApi.loadUser.mockRejectedValueOnce(error);
    const promise = sut.perform({
      token,
    });

    expect(promise).rejects.toThrow(error);
  });

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    const error = new Error('load_error');
    userAccountRepo.load.mockRejectedValueOnce(error);
    const promise = sut.perform({
      token,
    });

    expect(promise).rejects.toThrow(error);
  });

  it('should rethrow if SaveFacebookAccountRepository throws', async () => {
    const error = new Error('save_error');
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(error);
    const promise = sut.perform({
      token,
    });

    expect(promise).rejects.toThrow(error);
  });

  it('should rethrow if TokenGenerator throws', async () => {
    const error = new Error('token_error');
    crypto.generateToken.mockRejectedValueOnce(error);
    const promise = sut.perform({
      token,
    });

    expect(promise).rejects.toThrow(error);
  });
});
