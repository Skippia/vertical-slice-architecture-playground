import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './infrastructure/products.repository';
import { CreateProductHandler } from './commands/create-product.handler';
import { GetProductHandler } from './queries/get-product.handler';
import { GetAllProductsHandler } from './queries/get-all-products.handler';
import { OrderCreatedHandler } from './events/order-created.handler';

const CommandHandlers = [CreateProductHandler];
const QueryHandlers = [GetProductHandler, GetAllProductsHandler];
const EventHandlers = [OrderCreatedHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
  providers: [
    ProductsRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class ProductsModule {}
