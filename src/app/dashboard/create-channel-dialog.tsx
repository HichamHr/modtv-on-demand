"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createChannel } from "@/lib/data/channels";
import { channelInputSchema } from "@/lib/validation/channel";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 30);
}

export function CreateChannelDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [slugEdited, setSlugEdited] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = channelInputSchema.safeParse({
      name,
      slug,
      description,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    startTransition(async () => {
      const result = await createChannel(parsed.data);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setOpen(false);
      router.push(`/dashboard/${result.slug}`);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Channel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Set up a new channel to publish and manage content.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to create channel</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="channel-name">
              Name
            </label>
            <Input
              id="channel-name"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="ModTV Showcase"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="channel-slug">
              Slug
            </label>
            <Input
              id="channel-slug"
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugEdited(true);
              }}
              placeholder="modtv-showcase"
              required
            />
            <p className="text-xs text-muted-foreground">
              Lowercase letters, numbers, and hyphens only (3-30 chars).
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="channel-description">
              Description (optional)
            </label>
            <Input
              id="channel-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short channel description..."
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Channel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
