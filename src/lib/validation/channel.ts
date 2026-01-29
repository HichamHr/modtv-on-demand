import { z } from "zod";

const slugRegex = /^[a-z0-9-]{3,30}$/;

export const channelInputSchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().toLowerCase().regex(slugRegex),
  description: z.string().trim().max(160).optional().or(z.literal("")),
});

export type ChannelInput = z.infer<typeof channelInputSchema>;
