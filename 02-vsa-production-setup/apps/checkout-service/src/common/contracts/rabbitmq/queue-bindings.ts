import { RabbitMQQueueConfig } from '@golevelup/nestjs-rabbitmq'
import { EXCHANGE_NAME } from './exchanges-config'
import { QUEUE_NAME } from './queues'

export const ROUTING_KEY = {
  CHECKOUT_SYNC_PROJECTION: 'checkout.sync.projection',
  ORDER_CREATED: 'checkout.order.created',
} as const

export const QUEUE_BINDINGS: RabbitMQQueueConfig[] = [
  {
    name: QUEUE_NAME.CHECKOUT_SYNC_PROJECTION_QUEUE,
    exchange: EXCHANGE_NAME.AMQP_EXCHANGE_CHECKOUT,
    routingKey: ROUTING_KEY.CHECKOUT_SYNC_PROJECTION,
    createQueueIfNotExists: true,
    options: {
      durable: true,
    },
  },
  {
    name: QUEUE_NAME.ORDER_CREATED_STOCK_UPDATE_QUEUE,
    exchange: EXCHANGE_NAME.AMQP_EXCHANGE_CHECKOUT,
    routingKey: ROUTING_KEY.ORDER_CREATED,
    createQueueIfNotExists: true,
    options: {
      durable: true,
    },
  },
] as const
