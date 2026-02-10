import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetProductQuery } from './get-product.query';
import { ProductsRepository } from '../infrastructure/products.repository';
import { ProductOutDto } from '../dto/product.out-dto';

@QueryHandler(GetProductQuery)
export class GetProductHandler
  implements IQueryHandler<GetProductQuery, ProductOutDto>
{
  constructor(private readonly repository: ProductsRepository) {}

  async execute(query: GetProductQuery): Promise<ProductOutDto> {
    const product = await this.repository.findById(query.id);

    if (!product) {
      throw new NotFoundException(`Product with id ${query.id} not found`);
    }

    return ProductOutDto.from(product);
  }
}
