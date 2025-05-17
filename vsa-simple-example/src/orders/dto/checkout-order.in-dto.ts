import {
  IsUUID,
  ValidateNested,
  ArrayNotEmpty,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

export class _OrderItemRequestDto {
  @AutoMap()
  @IsUUID()
  productId: string;

  @AutoMap()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CheckoutOrderRequestDto {
  @AutoMap()
  @IsUUID()
  orderId: string;

  @AutoMap()
  @IsUUID()
  customerId: string;

  @AutoMap(() => _OrderItemRequestDto)
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => _OrderItemRequestDto)
  items: _OrderItemRequestDto[];
}
