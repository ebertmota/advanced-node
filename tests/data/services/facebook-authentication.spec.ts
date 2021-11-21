import { mock, MockProxy } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication';
import { AuthenticationError } from '@/domain/errors';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository,
} from '@/data/contracts/repos';

type UserAccountRepo = LoadUserAccountRepository &
  CreateFacebookAccountRepository &
  UpdateFacebookAccountRepository;

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

  it('should call CreateFacebookAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    await sut.perform({
      token,
    });

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebook_id: 'any_fb_id',
    });
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call UpdateFacebookAccountRepo when LoadUserAccountRepo returns data', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
    });

    await sut.perform({
      token,
    });

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebook_id: 'any_fb_id',
    });
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
    });

    await sut.perform({
      token,
    });

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      facebook_id: 'any_fb_id',
    });
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
  });
});
