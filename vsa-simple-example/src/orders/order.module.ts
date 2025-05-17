import { Module } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';
import { OrderCheckoutProfile } from './order-checkout.mapper';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrdersService, OrderCheckoutProfile],
})
export class OrderModule {}
