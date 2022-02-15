import request from 'supertest';
import { app } from '@/main/config/app';
import { ForbiddenError } from '@/application/errors';
import { auth } from '@/main/middlewares';

describe('Authentication Middleware', () => {
  it('should return 403 if Authorization header was not provided', async () => {
    app.get('/fake_route', auth);

    const { status, body } = await request(app).get('/fake_route');

    expect(status).toBe(403);
    expect(body.error).toBe(new ForbiddenError().message);
  });
});
