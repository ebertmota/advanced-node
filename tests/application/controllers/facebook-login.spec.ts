/* eslint-disable @typescript-eslint/no-explicit-any */
import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';
import { ServerError, UnauthorizedError } from '@/application/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/models';
import { FacebookLoginController } from '@/application/controllers';
import {
  RequiredStringValidator,
  ValidationComposite,
} from '@/application/validation';

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

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation fails');

    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));
    mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy);

    const validators = [new RequiredStringValidator(token, 'token')];

    const result = await sut.handle({ token });

    expect(ValidationCompositeSpy).toHaveBeenCalledWith(validators);
    expect(result).toEqual({
      statusCode: 400,
      data: error,
    });
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

  it('should return 500 if authentication throws', async () => {
    const error = new Error('authentication fails');
    facebookAuth.perform.mockRejectedValueOnce(error);
    const result = await sut.handle({ token });

    expect(result).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
