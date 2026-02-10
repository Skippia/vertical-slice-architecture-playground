import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CheckoutOrderCommand } from './checkout-order.command';
import { OrdersRepository } from '../infrastructure/orders.repository';
import { OrderOutDto } from '../dto/order.out-dto';
import { GetProductQuery } from '../../products/queries/get-product.query';
import { GetUserQuery } from '../../users/queries/get-user.query';
import { OrderCreatedEvent } from '../events/order-created.event';

@CommandHandler(CheckoutOrderCommand)
export class CheckoutOrderHandler
  implements ICommandHandler<CheckoutOrderCommand, OrderOutDto>
{
  constructor(
    private readonly repository: OrdersRepository,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CheckoutOrderCommand): Promise<OrderOutDto> {
    // Verify user exists via QueryBus (cross-slice communication)
    await this.queryBus.execute(new GetUserQuery(command.userId));

    // Verify products exist and calculate total
    let totalAmount = 0;
    const resolvedItems: { productId: string; quantity: number; unitPrice: number }[] = [];

    for (const item of command.items) {
      const product = await this.queryBus.execute(
        new GetProductQuery(item.productId),
      );

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, requested: ${item.quantity}`,
        );
      }

      resolvedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = await this.repository.create({
      userId: command.userId,
      totalAmount,
      items: resolvedItems,
    });

    // Publish event for side effects (stock reduction)
    this.eventBus.publish(
      new OrderCreatedEvent(
        order.id,
        command.userId,
        resolvedItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      ),
    );

    return order;
  }
}
