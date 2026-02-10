import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { LOG_TYPE } from './winston-logger.constants'
import { Request } from 'express'
import { InjectLogger } from './winston-logger.decorator'
import { WinstonLoggerService } from './winston-logger.service'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectLogger(LoggingInterceptor.name) private logger: WinstonLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()

    if (!response.locals?.traceId) {
      /**
       * Interceptor gets middleware request, skip it
       */
      return next.handle()
    }

    const startDate = Date.now()

    // do something that is only important in the context of regular HTTP requests (REST)
    const request: Request = ctx.getRequest()

    this.logger.http(
      JSON.stringify({
        type: LOG_TYPE.REQUEST_ARGS,
        path: request?.path,
        method: request?.method,
        ip: request?.ip,
      }),
    )

    return next.handle().pipe(
      tap(() => {
        this.logger.http(
          JSON.stringify({
            type: LOG_TYPE.RESPONSE_RESULT,
            path: request?.path,
            method: request?.method,
            ip: request?.ip,
            duration: `${Date.now() - startDate}ms`,
          }),
        )
      }),
    )
  }
}
