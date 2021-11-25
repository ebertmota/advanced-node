import axios from 'axios';
import { HttpGetClient } from '@/infra/http';

jest.mock('axios');

class AxiosHttpClient {
  async get(agrs: HttpGetClient.Params): Promise<void> {
    await axios.get(agrs.url, { params: agrs.params });
  }
}

const makeFakeParams = (): HttpGetClient.Params => ({
  url: 'any_url',
  params: {
    any: 'any',
  },
});

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient;
  let sutParams: HttpGetClient.Params;
  let fakeAxios: jest.Mocked<typeof axios>;

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>;
    sutParams = makeFakeParams();
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  it('should call get with correct params', async () => {
    await sut.get(sutParams);

    expect(fakeAxios.get).toHaveBeenCalledWith(sutParams.url, {
      params: sutParams.params,
    });
    expect(fakeAxios.get).toHaveBeenCalledTimes(1);
  });
});
