import {
  IsUUID,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  IsInt,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'

export class OrderItemInDto {
  @IsUUID()
  productId: string

  @IsInt()
  @Min(1)
  quantity: number
}

export class CheckoutOrderInDto {
  @IsUUID()
  userId: string

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInDto)
  items: OrderItemInDto[]
}
