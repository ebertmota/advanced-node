/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse, forbidden } from '@/application/helpers';
import { ForbiddenError } from '@/application/errors';

type Request = {
  authorization: string;
};

class AuthenticationMiddleware {
  async handle(request: Request): Promise<HttpResponse<Error>> {
    return forbidden();
  }
}

describe('AuthenticationMiddleware', () => {
  it('should return 403 if authorization is empty', async () => {
    const sut = new AuthenticationMiddleware();

    const response = await sut.handle({ authorization: '' });

    expect(response).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 403 if authorization is null', async () => {
    const sut = new AuthenticationMiddleware();

    const response = await sut.handle({ authorization: null as any });

    expect(response).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('should return 403 if authorization is undefined', async () => {
    const sut = new AuthenticationMiddleware();

    const response = await sut.handle({ authorization: undefined as any });

    expect(response).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });
});
