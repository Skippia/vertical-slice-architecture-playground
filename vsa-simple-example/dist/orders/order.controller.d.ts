import { CheckoutOrderRequestDto } from './dto/checkout-order.in-dto';
import { CheckoutOrderResponseDto } from './dto/checkout-order.out-dto';
import { OrdersService } from './order.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(dto: CheckoutOrderRequestDto): Promise<CheckoutOrderResponseDto>;
}
