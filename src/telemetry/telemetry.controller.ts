import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ZodValidationPipe } from '../common/zod.pipe';
import { OptionalAuthGuard } from './optional-auth.guard';
import { TelemetryService } from './telemetry.service';

const eventsDto = z.object({
  events: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        props: z.record(z.string(), z.unknown()).optional(),
        ts: z.string().datetime(),
        sessionId: z.string().max(100).optional(),
      }),
    )
    .min(1)
    .max(100),
});

const crashDto = z.object({
  platform: z.string().max(20),
  appVersion: z.string().max(40),
  error: z.string().max(2000),
  stackTrace: z.string().max(20000).optional(),
  deviceModel: z.string().max(100).optional(),
  osVersion: z.string().max(40).optional(),
  ts: z.string().datetime(),
});

@Controller('telemetry')
@UseGuards(OptionalAuthGuard)
export class TelemetryController {
  constructor(private readonly telemetry: TelemetryService) {}

  @Post('events')
  @HttpCode(202)
  async events(
    @Req() req: FastifyRequest & { auth?: { userId: string } },
    @Body(new ZodValidationPipe(eventsDto)) body: z.infer<typeof eventsDto>,
  ): Promise<object> {
    await this.telemetry.ingestEvents(req.auth?.userId ?? null, body.events);
    return {};
  }

  @Post('crashes')
  @HttpCode(202)
  async crashes(
    @Req() req: FastifyRequest & { auth?: { userId: string } },
    @Body(new ZodValidationPipe(crashDto)) body: z.infer<typeof crashDto>,
  ): Promise<object> {
    await this.telemetry.ingestCrash(req.auth?.userId ?? null, body);
    return {};
  }
}
