import { RabbitMQQueueConfig } from '@golevelup/nestjs-rabbitmq'
import { EXCHANGE_NAME } from './exchanges-config'
import { QUEUE_NAME } from './queues'

export const QUEUE_BINDINGS: RabbitMQQueueConfig[] = [
  {
    name: QUEUE_NAME.CHECKOUT_SYNC_PROJECTION_QUEUE,
    exchange: EXCHANGE_NAME.AMQP_EXCHANGE_CHECKOUT,
    routingKey: 'checkout.sync.projection',
    createQueueIfNotExists: true,
    options: {
      durable: true,
    },
  },
] as const
