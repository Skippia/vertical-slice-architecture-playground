import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CheckoutOrderRequestDto } from './dto/checkout-order.in-dto';
import { CheckoutOrderResponseDto } from './dto/checkout-order.out-dto';
import { OrdersService } from './order.service';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';

@Controller('orders')
@UseInterceptors(LoggingInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  async checkout(
    @Body() dto: CheckoutOrderRequestDto,
  ): Promise<CheckoutOrderResponseDto> {
    return this.ordersService.processOrder(dto);
  }
}
