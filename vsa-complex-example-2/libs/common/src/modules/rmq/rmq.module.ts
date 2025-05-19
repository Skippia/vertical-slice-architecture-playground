import {
  MessageHandlerErrorBehavior,
  RabbitMQExchangeConfig,
  RabbitMQModule,
  RabbitMQQueueConfig,
} from '@golevelup/nestjs-rabbitmq'
import { Module, DynamicModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'

@Module({})
export class MessageBrokerModule {
  static register(
    EXCHANGES_CONFIG: RabbitMQExchangeConfig[],
    QUEUE_BINDINGS: RabbitMQQueueConfig[],
  ): DynamicModule {
    return {
      module: MessageBrokerModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: Joi.object({
            AMQP_URI: Joi.string().required(),
          }),
          envFilePath: './apps/checkout-service/.env.amqp.dev',
          ignoreEnvFile: process.env.NODE_ENV === 'production',
        }),
        RabbitMQModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            exchanges: EXCHANGES_CONFIG,
            queues: QUEUE_BINDINGS,
            connectionInitOptions: {
              wait: false,
            },
            defaultExchangeType: 'direct',
            defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
            channels: {
              default: {
                prefetchCount: 1,
                default: true,
              },
            },
            uri: configService.get<string>('AMQP_URI')!,
            enableControllerDiscovery: true,
          }),
        }),
      ],
      exports: [RabbitMQModule],
    }
  }
}
