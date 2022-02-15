import { RequestHandler } from 'express';
import { Middleware } from '@/application/middlewares';

type Adapter = (middleware: Middleware) => RequestHandler;

export const adaptExpressMiddleware: Adapter =
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
