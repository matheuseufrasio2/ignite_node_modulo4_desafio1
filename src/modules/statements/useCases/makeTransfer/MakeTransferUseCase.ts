import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { MakeTransferError } from "./MakeTransferError";
import { OperationType } from '../../entities/Statement'

interface IRequest {
  send_user_id: string;
  receiver_user_id: string;
  amount: number;
  description: string;
}

@injectable()
class MakeTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) { }
  async execute({ send_user_id, receiver_user_id, amount, description }: IRequest) {
    const senderUser = await this.usersRepository.findById(send_user_id);

    if (!senderUser) {
      throw new MakeTransferError.SenderUserNotFound();
    }

    const receiverUser = await this.usersRepository.findById(receiver_user_id);

    if (!receiverUser) {
      throw new MakeTransferError.ReceiverUserNotFound();
    }

    const sender_balance = await this.statementsRepository.getUserBalance({ user_id: receiver_user_id });

    if (amount > sender_balance.balance) {
      throw new MakeTransferError.BalanceError();
    }

    await this.statementsRepository.create({
      user_id: send_user_id,
      type: OperationType.WITHDRAW,
      amount,
      description: `Transfer to ${receiverUser.name}: ${description}`
    })

    const transfer_statement = await this.statementsRepository.create({
      user_id: receiver_user_id,
      sender_id: send_user_id,
      type: OperationType.TRANSFER,
      amount,
      description
    })

    return transfer_statement;
  }
}

export { MakeTransferUseCase }
