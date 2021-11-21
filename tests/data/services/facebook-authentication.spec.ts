import { FacebookAuthentication } from '@/domain/features';

class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserByTokenApi.loadUser(params);
  }
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token;
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
});
