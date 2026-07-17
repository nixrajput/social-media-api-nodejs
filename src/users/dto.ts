import { z } from 'zod';

export const patchMeDto = z.object({
  displayName: z.string().max(50).nullish(),
  bio: z.string().max(300).nullish(),
  profession: z.string().max(100).nullish(),
  website: z.string().url().max(200).nullish(),
  dob: z.string().date().nullish(),
  gender: z.string().max(30).nullish(),
  isPrivate: z.boolean().optional(),
});

export const visibilityDto = z.object({
  field: z.enum(['dob', 'gender', 'profession', 'website', 'email']),
  level: z.enum(['public', 'followers', 'private']),
});

export type PatchMeDto = z.infer<typeof patchMeDto>;
export type VisibilityDto = z.infer<typeof visibilityDto>;
