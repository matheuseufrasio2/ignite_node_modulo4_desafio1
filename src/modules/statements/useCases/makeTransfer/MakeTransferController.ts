import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { MakeTransferUseCase } from './MakeTransferUseCase';

class MakeTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: send_user_id } = request.user;
    const { receiver_user_id } = request.params;
    const { amount, description } = request.body;

    const makeTransferUseCase = container.resolve(MakeTransferUseCase);

    const transfer = await makeTransferUseCase.execute({
      send_user_id,
      receiver_user_id: String(receiver_user_id),
      amount,
      description,
    });

    return response.status(201).json(transfer);
  }
}

export { MakeTransferController }
