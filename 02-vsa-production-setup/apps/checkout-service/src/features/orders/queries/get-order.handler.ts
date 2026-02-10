import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { NotFoundException } from '@nestjs/common'
import { GetOrderQuery } from './get-order.query'
import { OrdersRepository } from '../infrastructure/orders.repository'
import { OrderOutDto } from '../dto/order.out-dto'

@QueryHandler(GetOrderQuery)
export class GetOrderHandler
  implements IQueryHandler<GetOrderQuery, OrderOutDto>
{
  constructor(private readonly repository: OrdersRepository) {}

  async execute(query: GetOrderQuery): Promise<OrderOutDto> {
    const order = await this.repository.findById(query.id)

    if (!order) {
      throw new NotFoundException(`Order with id ${query.id} not found`)
    }

    return order
  }
}
