import { AutoMap } from '@automapper/classes';

export class _OrderItemResponseDto {
  @AutoMap()
  productId: string;

  @AutoMap()
  quantity: number;
}

export class CheckoutOrderResponseDto {
  @AutoMap()
  orderId: string;

  @AutoMap()
  customerId: string;

  @AutoMap(() => _OrderItemResponseDto)
  items: _OrderItemResponseDto[];

  @AutoMap()
  processedAt: Date;

  @AutoMap()
  success: boolean;

  @AutoMap()
  message: string;
}
