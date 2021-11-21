import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication';
import { AuthenticationError } from '@/domain/errors';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repos';

type UserAccountRepo = LoadUserAccountRepository &
  SaveFacebookAccountRepository;

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepo: MockProxy<UserAccountRepo>;
  let sut: FacebookAuthenticationService;
  const token = 'any_token';

  beforeEach(() => {
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
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);
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

  it('should create account with facebook data', async () => {
    await sut.perform({
      token,
    });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebook_id: 'any_fb_id',
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should not update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
    });

    await sut.perform({
      token,
    });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email',
      facebook_id: 'any_fb_id',
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
    });

    await sut.perform({
      token,
    });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebook_id: 'any_fb_id',
    });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });
});
