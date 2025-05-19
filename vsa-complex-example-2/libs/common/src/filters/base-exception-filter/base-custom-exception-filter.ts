import { WinstonLoggerService } from '@app/common/modules/logger/winston/winston-logger.service'
import { Response } from 'express'

export class BaseCustomExceptionFilter {
  constructor(protected logger: WinstonLoggerService) {}

  protected handleResponse({
    request,
    response,
    message,
    statusCode,
  }: {
    request: Request
    response: Response
    message?: string
    statusCode: number
  }) {
    const responseData = {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    response.status(statusCode).json(responseData)
  }

  protected logMessage(
    request: any,
    message: any,
    statusCode: number,
    stack?: string,
  ) {
    if (statusCode === 500) {
      this.logger.error(
        `End Request for ${request.path},
        method=${request.method} status=${statusCode}, 
        message=${message ? message : null},
        statusCode: ${statusCode >= 500 ? stack : ''}`,
      )
    } else {
      this.logger.warn(
        `End Request for ${request.path},
         method=${request.method} status=${statusCode}
         message=${message ? message : null}`,
      )
    }
  }

  protected getDefaultErrorResponse(exception: {
    response: { message: string; statusCode: number; stack?: string }
  }) {
    const error = {
      statusCode: exception?.response?.statusCode,
      message: exception?.response?.message,
      stack: exception?.response?.stack,
    }

    const statusCode = error?.statusCode || 500
    const message = error?.message || 'Unexpected exception error'
    const stack = error?.stack

    return { statusCode, message, stack }
  }

  protected resolveDefaultError({
    exception,
    request,
    response,
  }: {
    exception: {
      response: { message: string; statusCode: number; stack?: string }
    }
    request: any
    response: any
  }) {
    const { message, statusCode, stack } =
      this.getDefaultErrorResponse(exception)

    this.logMessage(request, message, statusCode, stack)
    return this.handleResponse({ request, response, statusCode, message })
  }
}
