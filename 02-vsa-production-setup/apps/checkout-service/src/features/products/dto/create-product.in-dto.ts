import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator'

export class CreateProductInDto {
  @IsString()
  @MinLength(1)
  name: string

  @IsString()
  @IsOptional()
  description: string = ''

  @IsNumber()
  @Min(0)
  price: number

  @IsNumber()
  @Min(0)
  stock: number
}
