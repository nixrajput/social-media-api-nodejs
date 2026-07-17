import { z } from 'zod';

const audience = z.enum(['public', 'followers', 'list']);

const mediaItem = z.object({
  uploadId: z.string().min(1),
  type: z.enum(['image', 'video']),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const createPostDto = z.object({
  caption: z.string().max(2200).optional(),
  audience,
  listId: z.string().uuid().optional(),
  media: z.array(mediaItem).min(1).max(10),
  aiLabel: z.boolean().optional(),
});

export const editPostDto = z.object({ caption: z.string().max(2200) });

export type CreatePostDto = z.infer<typeof createPostDto>;
export type EditPostDto = z.infer<typeof editPostDto>;
