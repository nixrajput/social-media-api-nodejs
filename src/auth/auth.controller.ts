import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ZodValidationPipe } from '../common/zod.pipe';
import { AuthGuard } from './auth.guard';
import { CurrentUser, type AuthContext } from './current-user.decorator';
import { AuthService } from './auth.service';
import {
  login2faDto,
  loginDto,
  refreshDto,
  registerDto,
  sendOtpDto,
  totpDisableDto,
  totpVerifyDto,
  type LoginDto,
  type RegisterDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register/send-otp')
  @HttpCode(202)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async sendOtp(@Body(new ZodValidationPipe(sendOtpDto)) body: { email: string }): Promise<object> {
    await this.auth.sendRegisterOtp(body.email);
    return {};
  }

  @Post('register')
  @HttpCode(201)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  register(@Body(new ZodValidationPipe(registerDto)) body: RegisterDto) {
    return this.auth.register(body);
  }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  login(@Body(new ZodValidationPipe(loginDto)) body: LoginDto) {
    return this.auth.login(body);
  }

  @Post('token/refresh')
  @HttpCode(200)
  refresh(@Body(new ZodValidationPipe(refreshDto)) body: { refreshToken: string }) {
    return this.auth.refresh(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async logout(@CurrentUser() ctx: AuthContext): Promise<void> {
    await this.auth.logout(ctx.sessionId);
  }

  @Get('sessions')
  @UseGuards(AuthGuard)
  sessions(@CurrentUser() ctx: AuthContext) {
    return this.auth.listSessions(ctx.userId, ctx.sessionId);
  }

  @Delete('sessions/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async revoke(@CurrentUser() ctx: AuthContext, @Param('id') id: string): Promise<void> {
    await this.auth.revokeSession(ctx.userId, id);
  }

  @Post('2fa/setup')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  setup2fa(@CurrentUser() ctx: AuthContext) {
    return this.auth.begin2faSetup(ctx.userId);
  }

  @Post('2fa/verify')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  verify2fa(
    @CurrentUser() ctx: AuthContext,
    @Body(new ZodValidationPipe(totpVerifyDto)) b: { totp: string },
  ) {
    return this.auth.confirm2fa(ctx.userId, b.totp);
  }

  @Delete('2fa')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async remove2fa(
    @CurrentUser() ctx: AuthContext,
    @Body(new ZodValidationPipe(totpDisableDto)) b: { totp: string },
  ): Promise<void> {
    await this.auth.disable2fa(ctx.userId, b.totp);
  }

  @Post('login/2fa')
  @HttpCode(200)
  login2fa(@Body(new ZodValidationPipe(login2faDto)) b: { challengeToken: string; totp: string }) {
    return this.auth.complete2faLogin(b.challengeToken, b.totp);
  }
}
