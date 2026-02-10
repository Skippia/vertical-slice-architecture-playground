import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { GetAllProductsQuery } from './get-all-products.query'
import { ProductsRepository } from '../infrastructure/products.repository'
import { ProductOutDto } from '../dto/product.out-dto'

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler
  implements IQueryHandler<GetAllProductsQuery, ProductOutDto[]>
{
  constructor(private readonly repository: ProductsRepository) {}

  async execute(_query: GetAllProductsQuery): Promise<ProductOutDto[]> {
    const products = await this.repository.findAll()
    return products.map(ProductOutDto.from)
  }
}
