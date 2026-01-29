import { z } from "zod";

export const videoInputSchema = z.object({
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  thumbnail_url: z.string().trim().url().optional().or(z.literal("")),
  preview_url: z.string().trim().url().optional().or(z.literal("")),
  full_url: z.string().trim().url().optional().or(z.literal("")),
  is_premium: z.boolean(),
  price_cents: z.number().int().min(0),
  currency: z.string().trim().min(3).max(8).default("usd"),
});

export type VideoInput = z.infer<typeof videoInputSchema>;
