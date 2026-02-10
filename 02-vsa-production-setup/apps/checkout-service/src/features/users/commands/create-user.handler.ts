import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserCommand } from './create-user.command'
import { UsersRepository } from '../infrastructure/users.repository'
import { UserOutDto } from '../dto/user.out-dto'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, UserOutDto>
{
  constructor(private readonly repository: UsersRepository) {}

  async execute(command: CreateUserCommand): Promise<UserOutDto> {
    const user = await this.repository.create({
      email: command.email,
      name: command.name,
    })

    return UserOutDto.from(user)
  }
}
