import { z } from 'zod'

export const UpdateProfileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .optional(),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
