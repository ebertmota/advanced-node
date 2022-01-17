import { mock, MockProxy } from 'jest-mock-extended';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/models';

type HttpResponse = { statusCode: number; data: any };

class ServerError extends Error {
  constructor(error?: Error) {
    super('Internal server error, try again soon');
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
          data: new Error('The field token is required'),
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
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error as Error),
      };
    }
  }
}

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let accessToken: AccessToken;
  let sut: FacebookLoginController;

  beforeAll(() => {
    facebookAuth = mock();
    accessToken = new AccessToken('any_value');
    facebookAuth.perform.mockResolvedValue(accessToken);
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('should return 400 if token is empty', async () => {
    const result = await sut.handle({ token: '' });

    expect(result).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('should return 400 if token is null', async () => {
    const result = await sut.handle({ token: null });

    expect(result).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('should return 400 if token is undefined', async () => {
    const result = await sut.handle({ token: undefined });

    expect(result).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' });

    expect(facebookAuth.perform).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if authentication fails', async () => {
    const error = new AuthenticationError();
    facebookAuth.perform.mockResolvedValueOnce(error);
    const result = await sut.handle({ token: 'any_token' });

    expect(result).toEqual({
      statusCode: 401,
      data: error,
    });
  });

  it('should return 200 if authentication succeeds', async () => {
    const result = await sut.handle({ token: 'any_token' });

    expect(result).toEqual({
      statusCode: 200,
      data: { accessToken: accessToken.value },
    });
  });

  it('should return 500 if authentication throws', async () => {
    const error = new Error('authentication fails');
    facebookAuth.perform.mockRejectedValueOnce(error);
    const result = await sut.handle({ token: 'any_token' });

    expect(result).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
