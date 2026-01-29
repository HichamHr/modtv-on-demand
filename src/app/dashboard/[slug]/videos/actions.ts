"use server";

import type { VideoInput } from "@/lib/validation/video";
import {
  createVideo,
  setVideoPublished,
  updateVideo,
  type VideoResult,
} from "@/lib/data/videos";
import type { Database } from "@/types/supabase";

type VideoRow = Database["public"]["Tables"]["videos"]["Row"];

export async function createVideoAction(
  slug: string,
  input: VideoInput
): Promise<VideoResult<VideoRow>> {
  return createVideo(slug, input);
}

export async function updateVideoAction(
  slug: string,
  videoId: string,
  input: VideoInput
): Promise<VideoResult<VideoRow>> {
  return updateVideo(slug, videoId, input);
}

export async function setVideoPublishedAction(
  slug: string,
  videoId: string,
  isPublished: boolean
): Promise<VideoResult<VideoRow>> {
  return setVideoPublished(slug, videoId, isPublished);
}
