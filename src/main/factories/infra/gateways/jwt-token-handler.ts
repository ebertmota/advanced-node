import { JwtTokenHandler } from '@/infra/gateways';
import { env } from '@/main/config';

export const makeJwtTokenHandler = (): JwtTokenHandler => {
  return new JwtTokenHandler(env.jwtSecret);
};
