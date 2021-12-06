import { AppError } from "../../../../shared/errors/AppError";

export namespace MakeTransferError {
  export class SenderUserNotFound extends AppError {
    constructor() {
      super('Sender user not found', 404);
    }
  }
  export class ReceiverUserNotFound extends AppError {
    constructor() {
      super('Receiver user not found', 404);
    }
  }

  export class BalanceError extends AppError {
    constructor() {
      super('Not enough balance to complete transfer', 400);
    }
  }
}
