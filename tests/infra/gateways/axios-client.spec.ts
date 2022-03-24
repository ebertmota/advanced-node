import axios from 'axios';
import { AxiosHttpClient } from '@/infra/gateways';
import { HttpGetClient } from '@/domain/contracts/gateways';

jest.mock('axios');

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
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data',
    });
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

  it('should return data on success', async () => {
    const result = await sut.get(sutParams);

    expect(result).toEqual('any_data');
    expect(fakeAxios.get).toHaveBeenCalledTimes(1);
  });

  it('should rethrow if get throws', async () => {
    const axiosError = new Error('Axios fails');
    fakeAxios.get.mockRejectedValueOnce(axiosError);

    const promise = sut.get(sutParams);

    await expect(promise).rejects.toEqual(axiosError);
  });
});
