import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { ServerError } from '../errors';
import { HttpResponse } from '../helpers';

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
        return {
          statusCode: 400,
          data: new Error('The field token is required'),
        };
      }

      const result = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });

      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: result.value,
          },
        };
      }
      return {
        statusCode: 401,
        data: result,
      };
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error as Error),
      };
    }
  }
}
