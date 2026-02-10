import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { OrderCreatedEvent } from '../../orders/events/order-created.event';
import { ProductsRepository } from '../infrastructure/products.repository';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
  private readonly logger = new Logger(OrderCreatedHandler.name);

  constructor(private readonly repository: ProductsRepository) {}

  async handle(event: OrderCreatedEvent) {
    this.logger.log(`Reducing stock for order ${event.orderId}`);

    for (const item of event.items) {
      const product = await this.repository.findById(item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await this.repository.updateStock(product.id, newStock);
        this.logger.log(
          `Product ${product.id}: stock ${product.stock} -> ${newStock}`,
        );
      }
    }
  }
}
