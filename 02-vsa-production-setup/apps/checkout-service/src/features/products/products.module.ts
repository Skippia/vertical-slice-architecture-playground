import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { ProductsController } from './products.controller'
import { ProductsRepository } from './infrastructure/products.repository'
import { CreateProductHandler } from './commands/create-product.handler'
import { GetProductHandler } from './queries/get-product.handler'
import { GetAllProductsHandler } from './queries/get-all-products.handler'
import { OrderCreatedConsumer } from './events/order-created.consumer'

const CommandHandlers = [CreateProductHandler]
const QueryHandlers = [GetProductHandler, GetAllProductsHandler]

@Module({
  imports: [CqrsModule, RabbitMQModule],
  controllers: [ProductsController],
  providers: [
    ProductsRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    OrderCreatedConsumer,
  ],
})
export class ProductsModule {}
