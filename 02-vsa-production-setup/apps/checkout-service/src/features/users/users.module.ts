import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { UsersController } from './users.controller'
import { UsersRepository } from './infrastructure/users.repository'
import { CreateUserHandler } from './commands/create-user.handler'
import { GetUserHandler } from './queries/get-user.handler'
import { GetAllUsersHandler } from './queries/get-all-users.handler'

const CommandHandlers = [CreateUserHandler]
const QueryHandlers = [GetUserHandler, GetAllUsersHandler]

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [UsersRepository, ...CommandHandlers, ...QueryHandlers],
})
export class UsersModule {}
