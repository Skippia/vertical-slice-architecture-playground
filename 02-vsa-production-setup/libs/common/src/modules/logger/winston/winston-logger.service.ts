import { Inject, Injectable, ConsoleLogger, Scope } from '@nestjs/common'
import { LoggerOptions, Logger as WinstonLogger, createLogger } from 'winston'
import { AsyncLocalStorage } from 'async_hooks'
import { NESTJS_WINSTON_CONFIG_OPTIONS } from './winston-logger.constants'
import { ASYNC_STORAGE } from '../logger.constants'

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService extends ConsoleLogger {
  private logger: WinstonLogger

  constructor(
    @Inject(NESTJS_WINSTON_CONFIG_OPTIONS) config: LoggerOptions,
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {
    super()
    this.logger = createLogger(config)
  }

  setContext(serviceName: string) {
    this.logger.defaultMeta = {
      ...this.logger.defaultMeta,
      service: serviceName,
    }
  }

  private getTraceId() {
    return this.asyncStorage.getStore()?.get('traceId')
  }

  error(message: string) {
    this.logger.error(message, { traceId: this.getTraceId() })
  }
  warn(message: string) {
    this.logger.warn(message, { traceId: this.getTraceId() })
  }
  info(message: string) {
    this.logger.info(message, { traceId: this.getTraceId() })
  }
  http(message: string) {
    this.logger.http(message, { traceId: this.getTraceId() })
  }
  verbose(message: string) {
    this.logger.verbose(message, { traceId: this.getTraceId() })
  }
  debug(message: string) {
    this.logger.debug(message, { traceId: this.getTraceId() })
  }
}
