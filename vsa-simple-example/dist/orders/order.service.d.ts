import { Mapper } from '@automapper/core';
import { CheckoutOrderRequestDto } from './dto/checkout-order.in-dto';
import { CheckoutOrderResponseDto } from './dto/checkout-order.out-dto';
export declare class OrdersService {
    private readonly mapper;
    private readonly logger;
    constructor(mapper: Mapper);
    processOrder(dto: CheckoutOrderRequestDto): Promise<CheckoutOrderResponseDto>;
}
