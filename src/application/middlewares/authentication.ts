import { Authorize } from '@/domain/use-cases';
import { Middleware } from '.';
import { forbidden, HttpResponse, ok } from '../helpers';
import { RequiredStringValidator } from '../validation';

type Request = {
  authorization: string;
};

type Model = Error | { user_id: string };

export class AuthenticationMiddleware implements Middleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({ authorization }: Request): Promise<HttpResponse<Model>> {
    const isValid = this.validate({ authorization });

    if (!isValid) {
      return forbidden();
    }

    try {
      const user_id = await this.authorize({
        token: authorization,
      });

      return ok({ user_id });
    } catch {
      return forbidden();
    }
  }

  private validate({ authorization }: Request): boolean {
    const error = new RequiredStringValidator(
      authorization,
      'authorization',
    ).validate();

    return error === undefined;
  }
}
