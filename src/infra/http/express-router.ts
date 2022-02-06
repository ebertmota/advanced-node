import { Request, Response } from 'express';
import { Controller } from '@/application/controllers';

export class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  async adapt(req: Request, res: Response): Promise<void> {
    const { statusCode, data } = await this.controller.handle({
      ...req.body,
    });
    if (statusCode === 200) {
      res.status(200).json(data);
    } else {
      res.status(statusCode).json({ error: data.message });
    }
  }
}
