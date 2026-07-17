import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ZodValidationPipe } from '../common/zod.pipe';
import { AuthGuard } from './auth.guard';
import { CurrentUser, type AuthContext } from './current-user.decorator';
import { AuthService } from './auth.service';
import {
  loginDto,
  refreshDto,
  registerDto,
  sendOtpDto,
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
}
