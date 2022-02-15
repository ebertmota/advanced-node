import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { app } from '@/main/config/app';
import { ForbiddenError } from '@/application/errors';
import { auth } from '@/main/middlewares';
import { env } from '@/main/config';

describe('Authentication Middleware', () => {
  it('should return 403 if Authorization header was not provided', async () => {
    app.get('/fake_route', auth);

    const { status, body } = await request(app).get('/fake_route');

    expect(status).toBe(403);
    expect(body.error).toBe(new ForbiddenError().message);
  });

  it('should return 200 if Authorization header is valid', async () => {
    const authorization = sign({ key: 'any_user_id' }, env.jwtSecret);
    app.get('/fake_route', auth, (req, res) => {
      res.json(req.locals);
    });

    const { status, body } = await request(app)
      .get('/fake_route')
      .set({ authorization });

    expect(status).toBe(200);
    expect(body).toEqual({ user_id: 'any_user_id' });
  });
});
