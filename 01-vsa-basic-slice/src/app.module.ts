import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/database';
import { ProductsModule } from './features/products/products.module';
import { UsersModule } from './features/users/users.module';
import { OrdersModule } from './features/orders/orders.module';

@Module({
  imports: [DatabaseModule, ProductsModule, UsersModule, OrdersModule],
})
export class AppModule {}
