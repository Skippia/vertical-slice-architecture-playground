import { HandlerExceptionResponse } from '../types'

export function typeErrorExceptionHandler(
  exception: TypeError,
): HandlerExceptionResponse {
  return {
    statusCode: 400,
    message: exception.message
      .substring(exception.message.indexOf('\n\n\n') + 1)
      .trim(),
  }
}
