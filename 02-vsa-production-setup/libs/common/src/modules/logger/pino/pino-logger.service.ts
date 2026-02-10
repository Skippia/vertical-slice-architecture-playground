import { Inject, Injectable } from '@nestjs/common'
import { ILogger } from './pino-logger.types'
import { AsyncLocalStorage } from 'async_hooks'
import { ASYNC_STORAGE } from '../logger.constants'
import * as pinoLogger from 'pino'
import { defaultOptions } from './pino-logger.config'

const pino = pinoLogger.pino(defaultOptions)

@Injectable()
export class PinoLoggerService implements ILogger {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {}

  private getMessage(message: any, context?: string): string {
    return context ? `[ ${context} ] ${message}` : (message as string)
  }

  debug(context: string, message: string) {
    const traceId = this.asyncStorage.getStore()?.get('traceId')

    if (process.env.NODE_ENV !== 'production') {
      pino.debug({ traceId }, this.getMessage(message, context))
    }
  }

  error(message: any, trace?: string, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId')
    pino.error({ traceId }, this.getMessage(message, context))
    if (trace) {
      pino.error(trace)
    }
  }

  log(message: any, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId')
    pino.info({ traceId }, this.getMessage(message, context))
  }

  warn(message: any, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId')
    pino.warn({ traceId }, this.getMessage(message, context))
  }
}
