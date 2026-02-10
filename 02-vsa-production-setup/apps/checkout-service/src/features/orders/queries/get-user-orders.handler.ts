import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { GetUserOrdersQuery } from './get-user-orders.query'
import { OrdersRepository } from '../infrastructure/orders.repository'
import { OrderOutDto } from '../dto/order.out-dto'

@QueryHandler(GetUserOrdersQuery)
export class GetUserOrdersHandler
  implements IQueryHandler<GetUserOrdersQuery, OrderOutDto[]>
{
  constructor(private readonly repository: OrdersRepository) {}

  async execute(query: GetUserOrdersQuery): Promise<OrderOutDto[]> {
    return this.repository.findByUserId(query.userId)
  }
}
