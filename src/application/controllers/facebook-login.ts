import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { Controller } from '.';
import { HttpResponse, unauthorized, ok } from '../helpers';
import { ValidationBuilder, Validator } from '../validation';

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

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform(httpRequest: Request): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({
      token: httpRequest.token,
    });

    return accessToken instanceof AccessToken
      ? ok({
          accessToken: accessToken.value,
        })
      : unauthorized();
  }

  override buildValidators(httpRequest: Request): Validator[] {
    return ValidationBuilder.of({
      value: httpRequest.token,
      fieldName: 'token',
    })
      .required()
      .build();
  }
}
