import {
  Controller,
  Post,
  Get,
  Param,
  Body,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CheckoutOrderCommand } from './commands/checkout-order.command'
import { GetOrderQuery } from './queries/get-order.query'
import { GetUserOrdersQuery } from './queries/get-user-orders.query'
import { CheckoutOrderInDto } from './dto/checkout-order.in-dto'
import { OrderOutDto } from './dto/order.out-dto'

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('checkout')
  async checkout(@Body() dto: CheckoutOrderInDto): Promise<OrderOutDto> {
    return this.commandBus.execute(
      new CheckoutOrderCommand(dto.userId, dto.items),
    )
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderOutDto> {
    return this.queryBus.execute(new GetOrderQuery(id))
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<OrderOutDto[]> {
    return this.queryBus.execute(new GetUserOrdersQuery(userId))
  }
}
