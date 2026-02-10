import {
  Controller,
  Post,
  Get,
  Param,
  Body,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CreateUserCommand } from './commands/create-user.command'
import { GetUserQuery } from './queries/get-user.query'
import { GetAllUsersQuery } from './queries/get-all-users.query'
import { CreateUserInDto } from './dto/create-user.in-dto'
import { UserOutDto } from './dto/user.out-dto'

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserInDto): Promise<UserOutDto> {
    return this.commandBus.execute(
      new CreateUserCommand(dto.email, dto.name),
    )
  }

  @Get()
  async findAll(): Promise<UserOutDto[]> {
    return this.queryBus.execute(new GetAllUsersQuery())
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserOutDto> {
    return this.queryBus.execute(new GetUserQuery(id))
  }
}
