import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { NotFoundException } from '@nestjs/common'
import { GetUserQuery } from './get-user.query'
import { UsersRepository } from '../infrastructure/users.repository'
import { UserOutDto } from '../dto/user.out-dto'

@QueryHandler(GetUserQuery)
export class GetUserHandler
  implements IQueryHandler<GetUserQuery, UserOutDto>
{
  constructor(private readonly repository: UsersRepository) {}

  async execute(query: GetUserQuery): Promise<UserOutDto> {
    const user = await this.repository.findById(query.id)

    if (!user) {
      throw new NotFoundException(`User with id ${query.id} not found`)
    }

    return UserOutDto.from(user)
  }
}
