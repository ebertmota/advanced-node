import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { env } from '@/main/config';

describe('FacebookApi', () => {
  it('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret,
    );

    const result = await sut.loadUser({
      token:
        'EAAJHA0yw77EBAM5ZCJyZBTCP43BpdKGQ7ZCOjf1r4i3gqnAGXEwfpdqAyqg61b41DgdtSnp85ZB6h2CrfmNUyrZCXfz2LC8lJBlcsS6XbZCNd2ERHlFAH3hk02DuIjKHAcM15SBPCUi6QtT3ICqRTZBQbX9lZCaEtDe9qPUZCayMJKB5R3LnSfagSHRrMCkPugJQGeBkLBhlm5DuUrpJOeeyr',
    });

    console.log(result);

    expect(result).toEqual({
      facebookId: '106591411942653',
      email: 'test_xmsmvvk_user@tfbnw.net',
      name: 'Test User',
    });
  });

  it('should return a undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret,
    );

    const result = await sut.loadUser({
      token: 'invalid_token',
    });

    expect(result).toBe(undefined);
  });
});
