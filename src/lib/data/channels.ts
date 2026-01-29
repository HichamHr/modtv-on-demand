"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { channelInputSchema, type ChannelInput } from "@/lib/validation/channel";
import type { Database } from "@/types/supabase";

type ChannelRow = Database["public"]["Tables"]["channels"]["Row"];
type ChannelMemberRow = Database["public"]["Tables"]["channel_members"]["Row"];

export type CreateChannelResult =
  | { ok: true; slug: string; channelId: string }
  | { ok: false; error: string };

export async function createChannel(input: ChannelInput): Promise<CreateChannelResult> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const normalized = {
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase(),
    description: input.description?.trim() || undefined,
  };

  const parsed = channelInputSchema.safeParse(normalized);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { ok: false, error: message };
  }

  const { data: channel, error } = await supabase
    .from("channels")
    .insert({
      owner_id: user.id,
      title: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      is_public: true,
    })
    .select("id, slug")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Slug already taken." };
    }
    return { ok: false, error: "Could not create channel." };
  }

  const { error: memberError } = await supabase.from("channel_members").insert({
    channel_id: channel.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    await supabase.from("channels").delete().eq("id", channel.id);
    return { ok: false, error: "Could not add channel owner." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${channel.slug}`);

  return { ok: true, slug: channel.slug, channelId: channel.id };
}

export type UserChannel = {
  channel: ChannelRow;
  role: ChannelMemberRow["role"];
};

export async function getUserChannels(): Promise<UserChannel[]> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  type MemberWithChannel = {
    role: ChannelMemberRow["role"];
    channels: ChannelRow | null;
  };

  const { data, error } = await supabase
    .from("channel_members")
    .select("role, channels (*)")
    .eq("user_id", user.id)
    .returns<MemberWithChannel[]>();

  if (error || !data) {
    return [];
  }

  return data
    .filter((row) => row.channels)
    .map((row) => ({
      channel: row.channels!,
      role: row.role,
    }));
}

export async function getChannelBySlug(
  slug?: string | null
): Promise<ChannelRow | null> {
  if (!slug) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const normalizedSlug = slug.trim().toLowerCase();

  const user = await requireUser();

  const { data: memberRows } = await supabase
    .from("channel_members")
    .select("channel_id")
    .eq("user_id", user.id);

  const memberChannelIds = memberRows
    ?.map((row) => row.channel_id)
    .filter((id): id is string => Boolean(id));

  if (memberChannelIds && memberChannelIds.length > 0) {
    const { data: memberChannel, error: memberError } = await supabase
      .from("channels")
      .select("*")
      .eq("slug", normalizedSlug)
      .in("id", memberChannelIds)
      .single();

    if (!memberError && memberChannel) {
      return memberChannel;
    }
  }

  const { data: publicData, error: publicError } = await supabase
    .from("channels")
    .select("*")
    .eq("slug", normalizedSlug)
    .single();

  if (publicError) {
    return null;
  }

  return publicData;
}

export async function getMyRole(channelId: string): Promise<ChannelMemberRow["role"] | null> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("channel_members")
    .select("role")
    .eq("channel_id", channelId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data.role;
}
