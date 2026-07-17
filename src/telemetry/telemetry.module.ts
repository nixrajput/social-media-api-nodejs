import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OptionalAuthGuard } from './optional-auth.guard';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TelemetryController],
  providers: [TelemetryService, OptionalAuthGuard],
})
export class TelemetryModule {}
