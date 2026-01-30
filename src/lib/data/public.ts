"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type ChannelRow = Database["public"]["Tables"]["channels"]["Row"];
type VideoRow = Database["public"]["Tables"]["videos"]["Row"];

export type PublicChannel = {
  id: ChannelRow["id"];
  name: ChannelRow["title"];
  slug: ChannelRow["slug"];
  description: ChannelRow["description"];
};

export async function getChannelPublicBySlug(
  slug: string
): Promise<PublicChannel | null> {
  const supabase = await createSupabaseServerClient();
  const normalizedSlug = slug.trim().toLowerCase();

  const { data, error } = await supabase
    .from("channels")
    .select("id, title, slug, description")
    .eq("slug", normalizedSlug)
    .eq("is_public", true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.title,
    slug: data.slug,
    description: data.description,
  };
}

export async function getPublishedVideosByChannelId(
  channelId: string
): Promise<VideoRow[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("channel_id", channelId)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getPublishedVideoById(
  videoId: string
): Promise<VideoRow | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", videoId)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
