import { RequestHandler } from 'express';
import { Controller } from '@/application/controllers';

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const { statusCode, data } = await controller.handle({
      ...req.body,
    });
    if (statusCode === 200) {
      res.status(200).json(data);
    } else {
      res.status(statusCode).json({ error: data.message });
    }
  };
};
