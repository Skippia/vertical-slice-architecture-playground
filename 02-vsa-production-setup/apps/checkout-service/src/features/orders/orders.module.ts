import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { OrdersController } from './orders.controller'
import { OrdersRepository } from './infrastructure/orders.repository'
import { CheckoutOrderHandler } from './commands/checkout-order.handler'
import { GetOrderHandler } from './queries/get-order.handler'
import { GetUserOrdersHandler } from './queries/get-user-orders.handler'

const CommandHandlers = [CheckoutOrderHandler]
const QueryHandlers = [GetOrderHandler, GetUserOrdersHandler]

@Module({
  imports: [CqrsModule, RabbitMQModule],
  controllers: [OrdersController],
  providers: [OrdersRepository, ...CommandHandlers, ...QueryHandlers],
})
export class OrdersModule {}
