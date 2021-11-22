import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication';
import { AuthenticationError } from '@/domain/errors';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repos';
import { FacebookAccount } from '@/domain/models';

type UserAccountRepo = LoadUserAccountRepository &
  SaveFacebookAccountRepository;

jest.mock('@/domain/models/facebook-account');

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
});
