export class ServerError extends Error {
  constructor(error?: Error) {
    super('Internal server error, try again soon');
    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}
export class RequiredFieldError extends Error {
  constructor(filedName?: string) {
    super(`The field ${filedName} is required`);
    this.name = 'RequiredFieldError';
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}
