"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { setVideoPublishedAction } from "./actions";

type PublishToggleProps = {
  slug: string;
  videoId: string;
  isPublished: boolean;
};

export function PublishToggle({ slug, videoId, isPublished }: PublishToggleProps) {
  const [isPending, startTransition] = React.useTransition();

  return (
    <Button
      type="button"
      variant={isPublished ? "outline" : "default"}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await setVideoPublishedAction(slug, videoId, !isPublished);
        });
      }}
    >
      {isPending
        ? "Updating..."
        : isPublished
          ? "Unpublish"
          : "Publish"}
    </Button>
  );
}
