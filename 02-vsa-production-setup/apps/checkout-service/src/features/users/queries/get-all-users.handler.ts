import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { GetAllUsersQuery } from './get-all-users.query'
import { UsersRepository } from '../infrastructure/users.repository'
import { UserOutDto } from '../dto/user.out-dto'

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler
  implements IQueryHandler<GetAllUsersQuery, UserOutDto[]>
{
  constructor(private readonly repository: UsersRepository) {}

  async execute(_query: GetAllUsersQuery): Promise<UserOutDto[]> {
    const users = await this.repository.findAll()
    return users.map(UserOutDto.from)
  }
}
