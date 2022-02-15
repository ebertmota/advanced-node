import { getMockReq, getMockRes } from '@jest-mock/express';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpResponse } from '@/application/helpers';

type Adapter = (middleware: Middleware) => RequestHandler;

const adaptExpressMiddleware: Adapter =
  middleware => async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers });
    if (statusCode === 200) {
      const validEntries = Object.entries(data).filter(entry => entry[1]);
      const validData = Object.fromEntries(validEntries);
      req.locals = { ...req.locals, ...validData };
      next();
    } else {
      res.status(statusCode).json(data);
    }
  };

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>;
}

describe('ExpressMiddleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let middleware: MockProxy<Middleware>;
  let sut: RequestHandler;

  beforeAll(() => {
    req = getMockReq({ headers: { any: 'any' } });
    res = getMockRes().res;
    next = getMockRes().next;
    middleware = mock();
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        emptyProps: '',
        nullProp: null,
        undefinedProp: undefined,
        validProp: 'any_value',
      },
    });
  });

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware);
  });

  it('should call handle with correct request', async () => {
    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with empty request', async () => {
    req = getMockReq();
    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({});
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should respond with correct error and statusCode', async () => {
    const error = { error: 'any_error' };
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: error,
    });
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(error);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should add valid data to req.locals', async () => {
    await sut(req, res, next);

    expect(req.locals).toEqual({ validProp: 'any_value' });
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});