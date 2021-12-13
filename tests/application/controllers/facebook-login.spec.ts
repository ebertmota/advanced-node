type HttpResponse = {
  statusCode: number;
  data: any;
};

class FacebookLoginController {
  async handle(httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('token is required'),
    };
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;

  beforeEach(() => {
    sut = new FacebookLoginController();
  });

  it('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('token is required'),
    });
  });

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('token is required'),
    });
  });
});
