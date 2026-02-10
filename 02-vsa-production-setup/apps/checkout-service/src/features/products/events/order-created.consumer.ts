import { Injectable, Logger } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { EXCHANGE_NAME } from '../../../common/contracts/rabbitmq/exchanges-config'
import { ROUTING_KEY } from '../../../common/contracts/rabbitmq/queue-bindings'
import { QUEUE_NAME } from '../../../common/contracts/rabbitmq/queues'
import { ProductsRepository } from '../infrastructure/products.repository'

interface OrderCreatedMessage {
  orderId: string
  userId: string
  items: { productId: string; quantity: number }[]
}

@Injectable()
export class OrderCreatedConsumer {
  private readonly logger = new Logger(OrderCreatedConsumer.name)

  constructor(private readonly repository: ProductsRepository) {}

  @RabbitSubscribe({
    exchange: EXCHANGE_NAME.AMQP_EXCHANGE_CHECKOUT,
    routingKey: ROUTING_KEY.ORDER_CREATED,
    queue: QUEUE_NAME.ORDER_CREATED_STOCK_UPDATE_QUEUE,
  })
  async handleOrderCreated(message: OrderCreatedMessage) {
    this.logger.log(`Received order.created event for order ${message.orderId}`)

    for (const item of message.items) {
      const product = await this.repository.findById(item.productId)
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity)
        await this.repository.updateStock(product.id, newStock)
        this.logger.log(
          `Product ${product.id}: stock ${product.stock} -> ${newStock}`,
        )
      }
    }
  }
}
