import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductsRepository } from '../infrastructure/products.repository';
import { ProductOutDto } from '../dto/product.out-dto';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, ProductOutDto>
{
  constructor(private readonly repository: ProductsRepository) {}

  async execute(command: CreateProductCommand): Promise<ProductOutDto> {
    const product = await this.repository.create({
      name: command.name,
      description: command.description,
      price: command.price,
      stock: command.stock,
    });

    return ProductOutDto.from(product);
  }
}
