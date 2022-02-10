/* eslint-disable @typescript-eslint/no-explicit-any */
import { mock } from 'jest-mock-extended';
import { UnauthorizedError } from '@/application/errors';
import { AuthenticationError } from '@/domain/entities/errors';
import { FacebookLoginController } from '@/application/controllers';
import { RequiredStringValidator } from '@/application/validation';

jest.mock('@/application/validation/composite');

describe('FacebookLoginController', () => {
  let facebookAuth: jest.Mock;
  let accessToken: { accessToken: string };
  let sut: FacebookLoginController;
  let token: string;

  beforeAll(() => {
    facebookAuth = mock();
    token = 'any_token';
    accessToken = { accessToken: 'any_value' };
    facebookAuth = jest.fn();
    facebookAuth.mockResolvedValue(accessToken);
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

    expect(facebookAuth).toHaveBeenCalledWith({
      token,
    });
    expect(facebookAuth).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if authentication fails', async () => {
    const error = new AuthenticationError();
    facebookAuth.mockRejectedValueOnce(error);
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
      data: accessToken,
    });
  });
});
