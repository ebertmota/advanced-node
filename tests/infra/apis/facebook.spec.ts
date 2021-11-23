import { mock, MockProxy } from 'jest-mock-extended';

import { HttpGetClient } from '@/infra/http';
import { FacebookApi } from '@/infra/apis';

describe('FacebookApi', () => {
  let sut: FacebookApi;
  let client_id: string;
  let client_secret: string;
  let httpClient: MockProxy<HttpGetClient>;

  beforeAll(() => {
    client_id = 'any_client_id';
    client_secret = 'any_client_secret';
    httpClient = mock();
  });

  beforeEach(() => {
    sut = new FacebookApi(httpClient, client_id, client_secret);
  });

  it('should get app token', async () => {
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
