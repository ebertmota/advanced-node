import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { RequiredFieldError } from '../errors';
import {
  badRequest,
  HttpResponse,
  serverError,
  unauthorized,
  ok,
} from '../helpers';

export namespace FacebookLoginProtocols {
  export type Request = {
    token: string;
  };
}

type Request = FacebookLoginProtocols.Request;

type Model =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: Request): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest);
      if (error) {
        return badRequest(error);
      }

      const accessToken = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });

      if (accessToken instanceof AccessToken) {
        return ok({
          accessToken: accessToken.value,
        });
      }

      return unauthorized();
    } catch (error) {
      return serverError(error);
    }
  }

  private validate(httpRequest: Request): Error | undefined {
    if (!httpRequest.token) {
      return new RequiredFieldError('token');
    }

    return undefined;
  }
}
