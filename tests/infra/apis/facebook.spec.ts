import { mock } from 'jest-mock-extended';
import { LoadFacebookUserApi } from '@/data/contracts/apis';

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>;
}

namespace HttpGetClient {
  export type Params = {
    url: string;
    params: object;
  };
}

describe('FacebookApi', () => {
  const client_id = 'any_client_id';
  const client_secret = 'any_client_secret';

  it('should get app token', async () => {
    const httpClient = mock<HttpGetClient>();
    const sut = new FacebookApi(httpClient, client_id, client_secret);

    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toBeCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id,
        client_secret,
        grant_type: 'client_credentials',
      },
    });
  });
});
