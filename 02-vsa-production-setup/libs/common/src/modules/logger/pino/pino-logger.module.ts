import { Global, Module } from '@nestjs/common'
import { PinoLoggerService } from './pino-logger.service'
import { AsyncLocalStorage } from 'async_hooks'
import { ASYNC_STORAGE } from '../logger.constants'

const asyncLocalStorage = new AsyncLocalStorage()

@Global()
@Module({
  providers: [
    PinoLoggerService,
    {
      provide: ASYNC_STORAGE,
      useValue: asyncLocalStorage,
    },
  ],
  exports: [PinoLoggerService, ASYNC_STORAGE],
})
export class PinoLoggerModule {}
