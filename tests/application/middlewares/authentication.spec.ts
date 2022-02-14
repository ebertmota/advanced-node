/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse, forbidden } from '@/application/helpers';
import { ForbiddenError } from '@/application/errors';
import { RequiredStringValidator } from '@/application/validation';
import { Authorize } from '@/domain/use-cases';

type Request = {
  authorization: string;
};

class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({
    authorization,
  }: Request): Promise<HttpResponse<Error> | undefined> {
    const error = new RequiredStringValidator(
      authorization,
      'authorization',
    ).validate();

    if (error !== undefined) {
      return forbidden();
    }

    try {
      await this.authorize({
        token: authorization,
      });
    } catch {
      return forbidden();
    }

    return undefined;
  }
}

describe('AuthenticationMiddleware', () => {
  let authorize: jest.Mock;
  let sut: AuthenticationMiddleware;
  let authorization: string;

  beforeAll(() => {
    authorization = 'any_authorization';
    authorize = jest.fn();
  });

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize);
  });

  it('should return 403 if authorization is empty', async () => {
    const response = await sut.handle({ authorization: '' });

    expect(response).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 403 if authorization is null', async () => {
    const response = await sut.handle({ authorization: null as any });

    expect(response).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 403 if authorization is undefined', async () => {
    const response = await sut.handle({ authorization: undefined as any });

    expect(response).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should call Authorize with correct input', async () => {
    await sut.handle({ authorization });

    expect(authorize).toHaveBeenCalledWith({ token: authorization });
    expect(authorize).toHaveBeenCalledTimes(1);
  });

  it('should return 403 if Authorize throws', async () => {
    authorize.mockRejectedValueOnce(new Error('any_error'));
    const response = await sut.handle({ authorization });

    expect(response).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });
});
