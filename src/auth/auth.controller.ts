import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ZodValidationPipe } from '../common/zod.pipe';
import { AuthService } from './auth.service';
import { registerDto, sendOtpDto, type RegisterDto } from './dto';

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
}
