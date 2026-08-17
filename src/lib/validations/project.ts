import { z } from "zod";

export const PROJECT_COLORS = ["teal", "amber", "violet", "sky", "coral"] as const;

export const projectSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  description: z.string().trim().max(280).optional().or(z.literal("")),
  color: z.enum(PROJECT_COLORS),
});

export type ProjectInput = z.infer<typeof projectSchema>;
