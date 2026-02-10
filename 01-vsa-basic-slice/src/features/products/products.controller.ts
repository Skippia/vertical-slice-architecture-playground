import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './commands/create-product.command';
import { GetProductQuery } from './queries/get-product.query';
import { GetAllProductsQuery } from './queries/get-all-products.query';
import { CreateProductInDto } from './dto/create-product.in-dto';
import { ProductOutDto } from './dto/product.out-dto';

@Controller('products')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductInDto): Promise<ProductOutDto> {
    return this.commandBus.execute(
      new CreateProductCommand(dto.name, dto.description, dto.price, dto.stock),
    );
  }

  @Get()
  async findAll(): Promise<ProductOutDto[]> {
    return this.queryBus.execute(new GetAllProductsQuery());
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductOutDto> {
    return this.queryBus.execute(new GetProductQuery(id));
  }
}
