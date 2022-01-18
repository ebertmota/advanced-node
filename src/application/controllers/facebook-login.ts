import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { RequiredFieldError } from '../errors';
import {
  badRequest,
  HttpResponse,
  serverError,
  unauthorized,
} from '../helpers';

export namespace FacebookLoginProtocols {
  export type Request = {
    token: string;
  };
}

type Request = FacebookLoginProtocols.Request;

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: Request): Promise<HttpResponse> {
    try {
      if (!httpRequest.token) {
        return badRequest(new RequiredFieldError('token'));
      }

      const accessToken = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });

      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: accessToken.value,
          },
        };
      }

      return unauthorized();
    } catch (error) {
      return serverError(error);
    }
  }
}
