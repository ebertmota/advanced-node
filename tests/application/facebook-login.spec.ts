type HttpResponse = { statusCode: number; data: any };

class FacebookLoginController {
  async handle(httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('The field token is required'),
    };
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;

  beforeEach(() => {
    sut = new FacebookLoginController();
  });

  it('should return 400 if token is empty', async () => {
    const result = await sut.handle({ token: '' });

    expect(result).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });
});
