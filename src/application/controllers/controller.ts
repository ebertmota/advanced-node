/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { badRequest, HttpResponse, serverError } from '../helpers';
import { ValidationComposite, Validator } from '../validation';

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>;

  buildValidators(httpRequest: any): Validator[] {
    return [];
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest);
    if (error) {
      return badRequest(error);
    }

    try {
      return await this.perform(httpRequest);
    } catch (err) {
      return serverError(err);
    }
  }

  private validate(httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest);
    return new ValidationComposite(validators).validate();
  }
}
