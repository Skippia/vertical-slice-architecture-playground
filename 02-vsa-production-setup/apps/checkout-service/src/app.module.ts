import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import * as Joi from 'joi'
import { WinstonLoggerModule } from '@app/common/modules/logger'
import { AllExceptionFilter } from '@app/common/filters'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from '@app/common/modules/logger/winston/logger.interceptor'
import { GenerateTraceIdMiddleware } from '@app/common/middlewares'
import { MessageBrokerModule } from '@app/common/modules/rmq'
import { EXCHANGES_CONFIG, QUEUE_BINDINGS } from './common/contracts/rabbitmq'
import { DatabaseModule } from './common/database'
import { ProductsModule } from './features/products/products.module'
import { UsersModule } from './features/users/users.module'
import { OrdersModule } from './features/orders/orders.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: [
        './apps/checkout-service/.env.dev',
        './apps/checkout-service/.env.pg.dev',
      ],
    }),
    WinstonLoggerModule.forRoot(),
    DatabaseModule,
    MessageBrokerModule.register(EXCHANGES_CONFIG, QUEUE_BINDINGS),
    ProductsModule,
    UsersModule,
    OrdersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GenerateTraceIdMiddleware).forRoutes('*')
  }
}
