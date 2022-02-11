import { mock, MockProxy } from 'jest-mock-extended';

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<void>;
}

export namespace TokenValidator {
  export type Params = { token: string };
}

type Input = { token: string };
type Authorize = (params: Input) => Promise<void>;
type Setup = (crypto: TokenValidator) => Authorize;

const setupAuthorize: Setup = crypto => async params => {
  await crypto.validateToken(params);
};

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>;
  let token: string;
  let sut: Authorize;

  beforeAll(() => {
    token = 'any_token';
    crypto = mock();
  });

  beforeEach(() => {
    sut = setupAuthorize(crypto);
  });

  it('should call TokenValidator with correct params', async () => {
    await sut({
      token,
    });

    expect(crypto.validateToken).toHaveBeenCalledWith({
      token,
    });
    expect(crypto.validateToken).toHaveBeenCalledTimes(1);
  });
});
