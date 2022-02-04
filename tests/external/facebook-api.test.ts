import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient, HttpGetClient } from '@/infra/http';
import { env } from '@/main/config';

describe('FacebookApi', () => {
  let httpClient: HttpGetClient;
  let sut: FacebookApi;

  beforeEach(() => {
    httpClient = new AxiosHttpClient();
    sut = new FacebookApi(
      httpClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret,
    );
  });

  it('should return a Facebook User if token is valid', async () => {
    const result = await sut.loadUser({
      token: env.facebookApi.accessToken,
    });

    expect(result).toEqual({
      facebookId: '106591411942653',
      email: 'test_xmsmvvk_user@tfbnw.net',
      name: 'Test User',
    });
  });

  it('should return a undefined if token is invalid', async () => {
    const result = await sut.loadUser({
      token: 'invalid_token',
    });

    expect(result).toBe(undefined);
  });
});
