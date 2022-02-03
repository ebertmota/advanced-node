/* eslint-disable @typescript-eslint/no-explicit-any */
import { mock, MockProxy } from 'jest-mock-extended';
import { UnauthorizedError } from '@/application/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/models';
import { FacebookLoginController } from '@/application/controllers';
import { RequiredStringValidator } from '@/application/validation';

jest.mock('@/application/validation/composite');

describe('FacebookLoginController', () => {
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let accessToken: AccessToken;
  let sut: FacebookLoginController;
  let token: string;

  beforeAll(() => {
    facebookAuth = mock();
    token = 'any_token';
    accessToken = new AccessToken('any_value');
    facebookAuth.perform.mockResolvedValue(accessToken);
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('should build validators correctly', async () => {
    const validators = sut.buildValidators({ token });

    expect(validators).toEqual([new RequiredStringValidator(token, 'token')]);
  });

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token });

    expect(facebookAuth.perform).toHaveBeenCalledWith({
      token,
    });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if authentication fails', async () => {
    const error = new AuthenticationError();
    facebookAuth.perform.mockResolvedValueOnce(error);
    const result = await sut.handle({ token });

    expect(result).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('should return 200 if authentication succeeds', async () => {
    const result = await sut.handle({ token });

    expect(result).toEqual({
      statusCode: 200,
      data: { accessToken: accessToken.value },
    });
  });
});
