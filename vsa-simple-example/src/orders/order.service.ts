// src/orders/orders.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Order } from './models/order.model';
import { CheckoutOrderRequestDto } from './dto/checkout-order.in-dto';
import { CheckoutOrderResponseDto } from './dto/checkout-order.out-dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(@InjectMapper() private readonly mapper: Mapper) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async processOrder(
    dto: CheckoutOrderRequestDto,
  ): Promise<CheckoutOrderResponseDto> {
    // 1) Inbound DTO → Domain
    const order = this.mapper.map(dto, CheckoutOrderRequestDto, Order);

    this.logger.debug(
      `Processing order ${order.orderId} for ${order.customerId}`,
    );

    // ... бизнес‑логика

    // 2) Domain → Outbound DTO
    const response = this.mapper.map(order, Order, CheckoutOrderResponseDto);

    return response;
  }
}
