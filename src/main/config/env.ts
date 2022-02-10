export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '641029450559409',
    clientSecret:
      process.env.FB_CLIENT_SECRET ?? '2e0e10c07a5a1d3618dcc85878d0924d',
    accessToken:
      'EAAJHA0yw77EBABSqaEQKQr1SCZCRiii0my3anW9LHeHZCXDmNC1MRTjDCybL4m7UYze4azmD6hKZA1su7e0GBTQkNH9382tHHG3XZCnVwub5fnzx0J1J0ZCZBNGgd9E81Eux3daJRrLKn0v0VKRQEg4BQzC2JVc1MTXsWQZAfYod5Cq7JrSOdPjOo35YMsYZAIqOFCSWFK1ISyhikXQB8FBjfhN7n6ErN0NDdl7yL971dHxEa0oJcpc9ZCKu7Xp2jabYZD',
  },
  appPort: process.env.APP_PORT ?? 3333,
  jwtSecret: process.env.JWT_SECRET || 'ajdlaksdjlaskjd',
};
