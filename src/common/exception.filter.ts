import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

export class ApiException extends HttpException {
  constructor(
    public readonly code: string,
    message: string,
    status: number,
  ) {
    super(message, status);
  }
}

const CODE_BY_STATUS: Record<number, string> = {
  400: 'VALIDATION',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  429: 'RATE_LIMITED',
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const req = ctx.getRequest<FastifyRequest>();
    const id = (req.id) ?? 'unknown';

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL';
    let message = 'Something went wrong';

    if (exception instanceof ApiException) {
      status = exception.getStatus();
      code = exception.code;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = CODE_BY_STATUS[status] ?? 'INTERNAL';
      message = status < 500 ? exception.message : 'Something went wrong';
    }

    if (status >= 500) {
      this.logger.error({ err: exception, requestId: id }, 'unhandled exception');
    }

    void reply
      .status(status)
      .header('x-request-id', id)
      .send({ error: { code, message, requestId: id } });
  }
}
