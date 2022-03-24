import jwt from 'jsonwebtoken';
import { TokenGenerator, TokenValidator } from '@/domain/contracts/gateways';
import { JwtTokenHandler } from '@/infra/gateways';

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
      await sut.generate(sutParams);

      expect(fakeJwt.sign).toHaveBeenCalledWith(
        { key: sutParams.key },
        secretKey,
        {
          expiresIn: 1,
        },
      );
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
    });

    it('should return a token on success', async () => {
      const generatedToken = await sut.generate(sutParams);

      expect(generatedToken).toBe(token);
    });

    it('should rethrow if sign throws ', async () => {
      const jwtError = new Error('Jsonwebtoken fails');
      fakeJwt.sign.mockImplementationOnce(() => {
        throw jwtError;
      });

      const promise = sut.generate(sutParams);

      await expect(promise).rejects.toEqual(jwtError);
    });
  });

  describe('validateToken', () => {
    let sutParams: TokenValidator.Params;
    let key: string;

    beforeAll(() => {
      sutParams = {
        token: 'any_token',
      };
      key = 'any_key';
      fakeJwt.verify.mockImplementation(() => ({ key }));
    });

    it('should call sign with correct params', async () => {
      await sut.validate(sutParams);

      expect(fakeJwt.verify).toHaveBeenCalledWith(sutParams.token, secretKey);
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1);
    });

    it('should return the key used to sign', async () => {
      const generatedKey = await sut.validate(sutParams);

      expect(generatedKey).toBe(key);
    });

    it('should rethrow if verify throws', async () => {
      const error = new Error('any_error');
      fakeJwt.verify.mockImplementationOnce(() => {
        throw error;
      });

      const promise = sut.validate(sutParams);

      await expect(promise).rejects.toThrow(error);
    });

    it('should throw if verify returns null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null);

      const promise = sut.validate(sutParams);

      await expect(promise).rejects.toThrow();
    });
  });
});
