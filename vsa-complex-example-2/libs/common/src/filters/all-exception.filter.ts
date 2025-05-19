import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import {
  BaseCustomExceptionFilter,
  typeErrorExceptionHandler,
} from './base-exception-filter'
import { WinstonLoggerService } from '@app/common/modules/logger/winston/winston-logger.service'
import { InjectLogger } from '@app/common/modules/logger/winston/winston-logger.decorator'

@Catch()
export class AllExceptionFilter
  extends BaseCustomExceptionFilter
  implements ExceptionFilter
{
  mapHandlers = {
    exceptions: {
      TypeError: typeErrorExceptionHandler,
    },
  } as const

  constructor(
    @InjectLogger(AllExceptionFilter.name)
    public logger: WinstonLoggerService,
  ) {
    super(logger)
  }
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const exceptionName = exception?.constructor?.name as string

    if (this.isControlledException(exceptionName)) {
      const { statusCode, message, stack } =
        this.mapHandlers.exceptions[
          exceptionName as keyof typeof this.mapHandlers.exceptions
        ](exception)

      this.logMessage(request, message, statusCode, stack)

      return this.handleResponse({ request, response, statusCode, message })
    }

    this.resolveDefaultError({ exception, request, response })
  }

  private isControlledException(exceptionName: string) {
    return Object.keys(this.mapHandlers.exceptions).includes(exceptionName)
  }
}
