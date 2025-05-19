import { DynamicModule, Global, Module } from '@nestjs/common'
import { AsyncLocalStorage } from 'async_hooks'
import { ASYNC_STORAGE } from '../logger.constants'
import { defaultOptions } from './winston-logger.config'
import { getLoggerContexts, getLoggerToken } from './winston-logger.decorator'
import { NESTJS_WINSTON_CONFIG_OPTIONS } from './winston-logger.constants'
import { LoggerOptions } from 'winston'
import { WinstonLoggerService } from './winston-logger.service'

const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>()

@Global()
@Module({})
export class WinstonLoggerModule {
  static forRoot(customOptions: LoggerOptions = {}): DynamicModule {
    const options = { ...defaultOptions, ...customOptions }
    const contexts = getLoggerContexts() // ["UserContoller", "AuthController", ...]

    return {
      module: WinstonLoggerModule,
      providers: [
        {
          provide: ASYNC_STORAGE,
          useValue: asyncLocalStorage,
        },
        {
          provide: NESTJS_WINSTON_CONFIG_OPTIONS,
          useValue: options,
        },
        ...contexts.map((context) => ({
          provide: getLoggerToken(context),
          useFactory: () => {
            const logger = new WinstonLoggerService(options, asyncLocalStorage)
            logger.setContext(context)
            return logger
          },
        })),
      ],
      exports: [
        ASYNC_STORAGE,
        NESTJS_WINSTON_CONFIG_OPTIONS,
        ...contexts.map((context) => getLoggerToken(context)),
      ],
    }
  }
}
