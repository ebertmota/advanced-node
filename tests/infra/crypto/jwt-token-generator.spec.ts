import jwt from 'jsonwebtoken';
import { TokenGenerator } from '@/data/contracts/crypto';
import { JwtTokenGenerator } from '@/infra/crypto';

jest.mock('jsonwebtoken');

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator;
  let sutParams: TokenGenerator.Params;
  let fakeJwt: jest.Mocked<typeof jwt>;
  let secretKey: string;

  beforeAll(() => {
    secretKey = 'any_secret';
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => 'any_token');
    sutParams = {
      key: 'any_key',
      expirationInMs: 1000,
    };
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator(secretKey);
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
    const token = await sut.generateToken(sutParams);

    expect(token).toBe('any_token');
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
