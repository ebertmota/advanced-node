export class ServerError extends Error {
  constructor(error?: Error) {
    super('Internal server error, try again soon');
    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}
