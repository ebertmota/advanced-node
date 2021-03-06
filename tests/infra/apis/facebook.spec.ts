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
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({
        data: {
          user_id: 'any_user_id',
        },
      })
      .mockResolvedValueOnce({
        id: 'any_fb_id',
        name: 'any_fb_name',
        email: 'any_fb_email',
      });

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

  it('should get debug token', async () => {
    const token = 'any_client_token';
    await sut.loadUser({ token });

    expect(httpClient.get).toBeCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: token,
      },
    });
  });

  it('should get user info', async () => {
    const token = 'any_client_token';
    await sut.loadUser({ token });

    expect(httpClient.get).toBeCalledWith({
      url: `https://graph.facebook.com/debug_token/any_user_id`,
      params: {
        fields: 'id,name,email',
        access_token: token,
      },
    });
  });

  it('should returns facebook user', async () => {
    const fbUser = await sut.loadUser({ token: 'any_client_token' });

    expect(fbUser).toEqual({
      facebook_id: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
    });
  });
});
