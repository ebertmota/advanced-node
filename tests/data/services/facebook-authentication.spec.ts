import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication';
import { AuthenticationError } from '@/domain/errors';

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;

  callsCount = 0;

  result?: undefined;

  async loadUser(
    params: LoadFacebookUserApi.Params,
  ): Promise<LoadFacebookUserApi.Result> {
    // eslint-disable-next-line no-plusplus
    this.callsCount++;
    this.token = params.token;
    return this.result;
  }
}

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: LoadFacebookUserApiSpy;
  let sut: FacebookAuthenticationService;

  beforeEach(() => {
    loadFacebookUserApi = new LoadFacebookUserApiSpy();
    sut = new FacebookAuthenticationService(loadFacebookUserApi);
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({
      token: 'any_token',
    });

    expect(loadFacebookUserApi.token).toBe('any_token');
    expect(loadFacebookUserApi.callsCount).toBe(1);
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.result = undefined;
    const authResult = await sut.perform({
      token: 'any_token',
    });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
