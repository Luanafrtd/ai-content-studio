import { z } from "zod";

export const contentUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  isFavorite: z.boolean().optional(),
});

export type ContentUpdateInput = z.infer<typeof contentUpdateSchema>;
