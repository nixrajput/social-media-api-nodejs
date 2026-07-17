import { bigserial, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const telemetryEvents = pgTable('telemetry_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id'),
  name: text('name').notNull(),
  props: jsonb('props'),
  sessionId: text('session_id'),
  ts: timestamp('ts', { withTimezone: true }).notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
});

export const crashReports = pgTable('crash_reports', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id'),
  platform: text('platform').notNull(),
  appVersion: text('app_version').notNull(),
  error: text('error').notNull(),
  stackTrace: text('stack_trace'),
  deviceModel: text('device_model'),
  osVersion: text('os_version'),
  ts: timestamp('ts', { withTimezone: true }).notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
});

export const telemetryDailyRollups = pgTable('telemetry_daily_rollups', {
  day: text('day').notNull(),
  name: text('name').notNull(),
  count: integer('count').notNull(),
});
