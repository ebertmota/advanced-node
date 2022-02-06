import { Request, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy } from 'jest-mock-extended';
import { Controller } from '@/application/controllers';

class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  async adapt(req: Request, res: Response): Promise<void> {
    await this.controller.handle({
      ...req.body,
    });
  }
}

describe('ExpressRouter', () => {
  let controller: MockProxy<Controller>;
  let sut: ExpressRouter;

  beforeAll(() => {
    controller = mock<Controller>();
  });

  beforeEach(() => {
    sut = new ExpressRouter(controller);
  });

  it('should call handle with correct request', async () => {
    const data = { any: 'any' };
    const req = getMockReq({ body: data });
    const { res } = getMockRes();

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith(data);
  });
});
