import { z } from 'zod';

const platform = z.enum(['ios', 'android']);

export const sendOtpDto = z.object({ email: z.string().email() });
export const registerDto = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_.]+$/i),
  password: z.string().min(8).max(200),
  deviceName: z.string().min(1).max(100),
  platform,
});
export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  deviceName: z.string().min(1).max(100),
  platform,
});
export const oauthDto = z.object({
  idToken: z.string().min(1),
  deviceName: z.string().min(1).max(100),
  platform,
});
export const login2faDto = z.object({ challengeToken: z.string(), totp: z.string().length(6) });
export const refreshDto = z.object({ refreshToken: z.string().min(1) });
export const sendResetDto = z.object({ email: z.string().email() });
export const resetDto = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8).max(200),
});
export const totpVerifyDto = z.object({ totp: z.string().length(6) });
export const totpDisableDto = z.object({ totp: z.string().length(6) });

export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof loginDto>;
export type OAuthDto = z.infer<typeof oauthDto>;
