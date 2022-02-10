import { FacebookAuthentication } from '@/domain/use-cases';
import { Controller } from '.';
import { HttpResponse, unauthorized, ok } from '../helpers';
import { ValidationBuilder, Validator } from '../validation';

export namespace FacebookLoginProtocols {
  export type Request = {
    token: string;
  };
}

type Request = FacebookLoginProtocols.Request;

type Model = Error | { accessToken: string };

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform({ token }: Request): Promise<HttpResponse<Model>> {
    try {
      const { accessToken } = await this.facebookAuthentication({
        token,
      });

      return ok({ accessToken });
    } catch (err) {
      return unauthorized();
    }
  }

  override buildValidators({ token }: Request): Validator[] {
    return ValidationBuilder.of({
      value: token,
      fieldName: 'token',
    })
      .required()
      .build();
  }
}
