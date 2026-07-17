import type { IncomingMessage } from 'node:http';
import type { Http2ServerRequest } from 'node:http2';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { loadEnv } from './config/env';
import { GlobalExceptionFilter } from './common/exception.filter';
import { requestId } from './common/request-id';

export async function createApp(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 1024 * 1024,
      genReqId: (req: IncomingMessage | Http2ServerRequest) => requestId(req.headers),
    }),
    { bufferLogs: true },
  );
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onSend', (req, reply, _payload, done) => {
      void reply.header('x-request-id', req.id);
      done();
    });

  const env = loadEnv();
  await app.register(helmet);
  const origins = env.CORS_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  await app.register(cors, { origin: origins.length > 0 ? origins : false, credentials: true });

  if (env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Social API')
      .setVersion('2.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  return app;
}
