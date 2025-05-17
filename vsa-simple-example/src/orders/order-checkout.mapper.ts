// src/orders/order‑checkout.mapper.ts

import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { Order, OrderItem } from './models/order.model';
import {
  _OrderItemRequestDto,
  CheckoutOrderRequestDto,
} from './dto/checkout-order.in-dto';
import {
  _OrderItemResponseDto,
  CheckoutOrderResponseDto,
} from './dto/checkout-order.out-dto';

@Injectable()
export class OrderCheckoutProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, _OrderItemRequestDto, OrderItem);
      createMap(mapper, OrderItem, _OrderItemResponseDto);

      // RequestDto → Domain
      createMap(mapper, CheckoutOrderRequestDto, Order);

      // Domain → ResponseDto
      createMap(
        mapper,
        Order,
        CheckoutOrderResponseDto,
        forMember(
          (dest) => dest.success,
          mapFrom(() => true),
        ),
        forMember(
          (dest) => dest.message,
          mapFrom((src) => `Order ${src.orderId} completed`),
        ),
      );
    };
  }
}
