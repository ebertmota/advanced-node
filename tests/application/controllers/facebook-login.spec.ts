import { mock, MockProxy } from 'jest-mock-extended';
import { FacebookAuthentication } from '@/domain/features';

type HttpResponse = {
  statusCode: number;
  data: any;
};

class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuthentication.perform({
      token: httpRequest.token,
    });
    return {
      statusCode: 400,
      data: new Error('token is required'),
    };
  }
}

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let sut: FacebookLoginController;

  beforeEach(() => {
    facebookAuth = mock();
    sut = new FacebookLoginController(facebookAuth);
  });

  it('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('token is required'),
    });
  });

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('token is required'),
    });
  });

  it('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('token is required'),
    });
  });

  it('should call FacebookAuthentication with correct params', async () => {
    const sutParams = {
      token: 'any_token',
    };

    await sut.handle(sutParams);

    expect(facebookAuth.perform).toHaveBeenCalledWith(sutParams);
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });
});
