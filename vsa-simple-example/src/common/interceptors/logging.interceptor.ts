import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const { method, url } = req;
    const now = Date.now();

    this.logger.log(
      `➡️ ${method} ${url} - Payload: ${JSON.stringify(req.body)}`,
    );

    return next
      .handle()
      .pipe(
        tap((response) =>
          this.logger.log(
            `⬅️ ${method} ${url} - ${Date.now() - now}ms - Response: ${JSON.stringify(response)}`,
          ),
        ),
      );
  }
}
