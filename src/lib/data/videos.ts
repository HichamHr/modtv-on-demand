"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { videoInputSchema, type VideoInput } from "@/lib/validation/video";
import type { Database } from "@/types/supabase";

type ChannelRow = Database["public"]["Tables"]["channels"]["Row"];
type ChannelMemberRow = Database["public"]["Tables"]["channel_members"]["Row"];
type VideoRow = Database["public"]["Tables"]["videos"]["Row"];
type ChannelRole = ChannelMemberRow["role"];

type VideoError = {
  code: "validation" | "forbidden" | "not_found" | "unknown";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type VideoResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: VideoError };

type ChannelAccessResult =
  | { ok: true; channel: ChannelRow; role: ChannelRole; userId: string }
  | { ok: false; error: VideoError };

function toNullable(value?: string | null) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeInput(input: VideoInput) {
  return {
    title: input.title.trim(),
    description: toNullable(input.description),
    thumbnail_url: toNullable(input.thumbnail_url),
    preview_url: toNullable(input.preview_url),
    full_url: toNullable(input.full_url),
    is_premium: input.is_premium,
    price_cents: input.is_premium ? input.price_cents : 0,
    currency: input.currency.trim().toLowerCase() || "usd",
  };
}

async function getChannelAccess(
  slug: string,
  allowedRoles?: ChannelRole[]
): Promise<ChannelAccessResult> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const normalizedSlug = slug.trim().toLowerCase();

  const { data: channel, error: channelError } = await supabase
    .from("channels")
    .select("*")
    .eq("slug", normalizedSlug)
    .single();

  if (channelError || !channel) {
    return { ok: false, error: { code: "not_found", message: "Channel not found." } };
  }

  const { data: membership, error: memberError } = await supabase
    .from("channel_members")
    .select("role")
    .eq("channel_id", channel.id)
    .eq("user_id", user.id)
    .single();

  if (memberError || !membership) {
    return {
      ok: false,
      error: { code: "forbidden", message: "You do not have access to this channel." },
    };
  }

  if (allowedRoles && !allowedRoles.includes(membership.role)) {
    return {
      ok: false,
      error: {
        code: "forbidden",
        message: "You do not have permission to perform this action.",
      },
    };
  }

  return { ok: true, channel, role: membership.role, userId: user.id };
}

export async function listChannelVideos(slug: string): Promise<VideoRow[]> {
  const access = await getChannelAccess(slug);
  if (!access.ok) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("channel_id", access.channel.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function createVideo(
  slug: string,
  input: VideoInput
): Promise<VideoResult<VideoRow>> {
  const parsed = videoInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "validation",
        message: "Invalid input.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const access = await getChannelAccess(slug, ["owner", "admin"]);
  if (!access.ok) {
    return { ok: false, error: access.error };
  }

  const normalized = normalizeInput(parsed.data);
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("videos")
    .insert({
      channel_id: access.channel.id,
      created_by: access.userId,
      title: normalized.title,
      description: normalized.description,
      thumbnail_url: normalized.thumbnail_url,
      preview_url: normalized.preview_url,
      full_url: normalized.full_url,
      is_premium: normalized.is_premium,
      price_cents: normalized.price_cents,
      currency: normalized.currency,
      is_published: false,
      published_at: null,
    })
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: { code: "unknown", message: "Could not create video." } };
  }

  revalidatePath(`/dashboard/${access.channel.slug}/videos`);
  revalidatePath(`/${access.channel.slug}`);

  return { ok: true, data };
}

export async function updateVideo(
  slug: string,
  videoId: string,
  input: VideoInput
): Promise<VideoResult<VideoRow>> {
  const parsed = videoInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "validation",
        message: "Invalid input.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const access = await getChannelAccess(slug, ["owner", "admin"]);
  if (!access.ok) {
    return { ok: false, error: access.error };
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing, error: existingError } = await supabase
    .from("videos")
    .select("*")
    .eq("id", videoId)
    .eq("channel_id", access.channel.id)
    .single();

  if (existingError || !existing) {
    return { ok: false, error: { code: "not_found", message: "Video not found." } };
  }

  const normalized = normalizeInput(parsed.data);
  const { data, error } = await supabase
    .from("videos")
    .update({
      title: normalized.title,
      description: normalized.description,
      thumbnail_url: normalized.thumbnail_url,
      preview_url: normalized.preview_url,
      full_url: normalized.full_url,
      is_premium: normalized.is_premium,
      price_cents: normalized.price_cents,
      currency: normalized.currency,
    })
    .eq("id", existing.id)
    .eq("channel_id", access.channel.id)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: { code: "unknown", message: "Could not update video." } };
  }

  revalidatePath(`/dashboard/${access.channel.slug}/videos`);
  revalidatePath(`/${access.channel.slug}`);

  return { ok: true, data };
}

export async function setVideoPublished(
  slug: string,
  videoId: string,
  isPublished: boolean
): Promise<VideoResult<VideoRow>> {
  const access = await getChannelAccess(slug, ["owner", "admin"]);
  if (!access.ok) {
    return { ok: false, error: access.error };
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing, error: existingError } = await supabase
    .from("videos")
    .select("*")
    .eq("id", videoId)
    .eq("channel_id", access.channel.id)
    .single();

  if (existingError || !existing) {
    return { ok: false, error: { code: "not_found", message: "Video not found." } };
  }

  const { data, error } = await supabase
    .from("videos")
    .update({
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .eq("id", existing.id)
    .eq("channel_id", access.channel.id)
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: { code: "unknown", message: "Could not update publish status." },
    };
  }

  revalidatePath(`/dashboard/${access.channel.slug}/videos`);
  revalidatePath(`/${access.channel.slug}`);

  return { ok: true, data };
}
