import { mock, MockProxy } from 'jest-mock-extended';
import { ServerError } from '@/application/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/models';
import { FacebookLoginController } from '@/application/controllers';

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
    const result = await sut.handle({ token: null! });

    expect(result).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('should return 400 if token is undefined', async () => {
    const result = await sut.handle({ token: undefined! });

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
