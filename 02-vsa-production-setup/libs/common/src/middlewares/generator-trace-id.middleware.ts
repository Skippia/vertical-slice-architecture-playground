import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { Request, Response, NextFunction } from 'express'
import { AsyncLocalStorage } from 'async_hooks'
import { ASYNC_STORAGE } from '@app/common/modules/logger/logger.constants'

/**
 * Using for generating unique traceId
 * for end-to-end logging
 */
@Injectable()
export class GenerateTraceIdMiddleware implements NestMiddleware {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const traceId = req.headers['x-request-id'] || uuidv4()

    res.locals.traceId = traceId

    const store = new Map().set('traceId', traceId)
    this.asyncStorage.run(store, () => {
      next()
    })
  }
}
