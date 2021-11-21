import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
  ) {}

  async perform(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params);
    return new AuthenticationError();
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;

  result?: undefined;

  async loadUser(
    params: LoadFacebookUserApi.Params,
  ): Promise<LoadFacebookUserApi.Result> {
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
  });

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.result = undefined;
    const authResult = await sut.perform({
      token: 'any_token',
    });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
