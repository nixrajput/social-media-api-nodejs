import { Inject, Injectable } from '@nestjs/common';
import { DB, type Db } from '../db/db.module';
import { crashReports, telemetryEvents } from '../db/schema';

export interface EventInput {
  name: string;
  props?: Record<string, unknown>;
  ts: string;
  sessionId?: string;
}

export interface CrashInput {
  platform: string;
  appVersion: string;
  error: string;
  stackTrace?: string;
  deviceModel?: string;
  osVersion?: string;
  ts: string;
}

@Injectable()
export class TelemetryService {
  constructor(@Inject(DB) private readonly db: Db) {}

  async ingestEvents(userId: string | null, events: EventInput[]): Promise<void> {
    if (events.length === 0) return;
    await this.db.insert(telemetryEvents).values(
      events.map((e) => ({
        userId,
        name: e.name,
        props: e.props ?? null,
        sessionId: e.sessionId ?? null,
        ts: new Date(e.ts),
      })),
    );
  }

  async ingestCrash(userId: string | null, c: CrashInput): Promise<void> {
    await this.db.insert(crashReports).values({
      userId,
      platform: c.platform,
      appVersion: c.appVersion,
      error: c.error,
      stackTrace: c.stackTrace ?? null,
      deviceModel: c.deviceModel ?? null,
      osVersion: c.osVersion ?? null,
      ts: new Date(c.ts),
    });
  }
}
