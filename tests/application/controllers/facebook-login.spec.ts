import { mock, MockProxy } from 'jest-mock-extended';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/models';

type HttpResponse = {
  statusCode: number;
  data: any;
};

class ServerError extends Error {
  constructor(error?: Error) {
    super('Internal server error');
    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}

class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (!httpRequest.token) {
        return {
          statusCode: 400,
          data: new Error('token is required'),
        };
      }

      const result = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });

      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: result.value,
          },
        };
      }

      return {
        statusCode: 401,
        data: result,
      };
    } catch (err) {
      return {
        statusCode: 500,
        data: new ServerError(),
      };
    }
  }
}

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let sut: FacebookLoginController;

  beforeAll(() => {
    facebookAuth = mock();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
  });

  beforeEach(() => {
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

  it('should return 401 if authentication fails', async () => {
    const error = new AuthenticationError();
    facebookAuth.perform.mockResolvedValueOnce(error);
    const httpResponse = await sut.handle({ token: 'any_token' });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: error,
    });
  });

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value',
      },
    });
  });

  it('should return 500 if authentication throws', async () => {
    const error = new Error('internal server error');
    facebookAuth.perform.mockRejectedValueOnce(error);
    const httpResponse = await sut.handle({ token: 'any_token' });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
