"use client";

import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { videoInputSchema, type VideoInput } from "@/lib/validation/video";
import type { Database } from "@/types/supabase";
import { createVideoAction, updateVideoAction } from "./actions";

type VideoRow = Database["public"]["Tables"]["videos"]["Row"];

type VideoDialogProps = {
  slug: string;
  triggerLabel: string;
  initialVideo?: VideoRow;
};

type FormState = {
  title: string;
  description: string;
  thumbnail_url: string;
  preview_url: string;
  full_url: string;
  is_premium: boolean;
  price_cents: number;
  currency: string;
};

function toFormState(video?: VideoRow): FormState {
  return {
    title: video?.title ?? "",
    description: video?.description ?? "",
    thumbnail_url: video?.thumbnail_url ?? "",
    preview_url: video?.preview_url ?? "",
    full_url: video?.full_url ?? "",
    is_premium: video?.is_premium ?? false,
    price_cents: video?.price_cents ?? 0,
    currency: video?.currency ?? "usd",
  };
}

export function VideoDialog({ slug, triggerLabel, initialVideo }: VideoDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<FormState>(() => toFormState(initialVideo));
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (open) {
      setForm(toFormState(initialVideo));
      setError(null);
    }
  }, [open, initialVideo]);

  const handleChange = (key: keyof FormState, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const payload: VideoInput = {
      title: form.title,
      description: form.description,
      thumbnail_url: form.thumbnail_url,
      preview_url: form.preview_url,
      full_url: form.full_url,
      is_premium: form.is_premium,
      price_cents: form.price_cents,
      currency: form.currency,
    };

    const parsed = videoInputSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    startTransition(async () => {
      const result = initialVideo
        ? await updateVideoAction(slug, initialVideo.id, parsed.data)
        : await createVideoAction(slug, parsed.data);

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={initialVideo ? "outline" : "default"}>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialVideo ? "Edit Video" : "Add Video"}</DialogTitle>
          <DialogDescription>
            {initialVideo
              ? "Update the video details for this channel."
              : "Add a new video to your channel."}
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to save video</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="video-title">
                Title
              </label>
              <Input
                id="video-title"
                value={form.title}
                onChange={(event) => handleChange("title", event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="video-currency">
                Currency
              </label>
              <Input
                id="video-currency"
                value={form.currency}
                onChange={(event) => handleChange("currency", event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="video-description">
              Description
            </label>
            <Textarea
              id="video-description"
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              placeholder="Short description for the video..."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="video-thumbnail">
                Thumbnail URL
              </label>
              <Input
                id="video-thumbnail"
                value={form.thumbnail_url}
                onChange={(event) => handleChange("thumbnail_url", event.target.value)}
                placeholder="https://"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="video-preview">
                Preview URL
              </label>
              <Input
                id="video-preview"
                value={form.preview_url}
                onChange={(event) => handleChange("preview_url", event.target.value)}
                placeholder="https://"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="video-full">
                Full URL
              </label>
              <Input
                id="video-full"
                value={form.full_url}
                onChange={(event) => handleChange("full_url", event.target.value)}
                placeholder="https://"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="video-price">
                Price (cents)
              </label>
              <Input
                id="video-price"
                type="number"
                min={0}
                value={form.price_cents}
                onChange={(event) =>
                  handleChange("price_cents", Number(event.target.value || 0))
                }
                disabled={!form.is_premium}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Input
              id="video-premium"
              type="checkbox"
              className="h-4 w-4"
              checked={form.is_premium}
              onChange={(event) => handleChange("is_premium", event.target.checked)}
            />
            <label className="text-sm font-medium" htmlFor="video-premium">
              Premium (paid)
            </label>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
