import { CustomError } from './custom-error';

export class UnAuthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super('UnAuthorized');
    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }

}