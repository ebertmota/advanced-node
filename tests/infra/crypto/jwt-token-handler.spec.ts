import jwt from 'jsonwebtoken';
import { TokenGenerator } from '@/domain/contracts/crypto';
import { JwtTokenHandler } from '@/infra/crypto';

jest.mock('jsonwebtoken');

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenHandler;
  let fakeJwt: jest.Mocked<typeof jwt>;
  let secretKey: string;

  beforeAll(() => {
    secretKey = 'any_secret';
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
  });

  beforeEach(() => {
    sut = new JwtTokenHandler(secretKey);
  });

  describe('generateToken', () => {
    let sutParams: TokenGenerator.Params;
    let token: string;

    beforeAll(() => {
      sutParams = {
        key: 'any_key',
        expirationInMs: 1000,
      };
      token = 'any_token';
      fakeJwt.sign.mockImplementation(() => token);
    });

    it('should call sign with correct params', async () => {
      await sut.generateToken(sutParams);

      expect(fakeJwt.sign).toHaveBeenCalledWith(
        { key: sutParams.key },
        secretKey,
        {
          expiresIn: 1,
        },
      );
    });

    it('should return a token on success', async () => {
      const generatedToken = await sut.generateToken(sutParams);

      expect(generatedToken).toBe(token);
    });

    it('should rethrow if sign throws ', async () => {
      const jwtError = new Error('Jsonwebtoken fails');
      fakeJwt.sign.mockImplementationOnce(() => {
        throw jwtError;
      });

      const promise = sut.generateToken(sutParams);

      await expect(promise).rejects.toEqual(jwtError);
    });
  });
});
