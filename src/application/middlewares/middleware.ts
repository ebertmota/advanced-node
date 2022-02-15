/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpResponse } from '../helpers';

export interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>;
}
