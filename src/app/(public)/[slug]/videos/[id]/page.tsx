import { notFound } from "next/navigation";

import { BaseLayout } from "@/components/base-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getChannelPublicBySlug,
  getPublishedVideoById,
} from "@/lib/data/public";

type VideoPageProps = {
  params: Promise<{ slug?: string; id?: string }>;
};

function isEmbedUrl(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}

function VideoPlayer({ url, title }: { url: string; title: string }) {
  if (isEmbedUrl(url)) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black/10">
        <iframe
          title={title}
          src={url}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video
      className="aspect-video w-full rounded-lg bg-black/10"
      src={url}
      controls
    />
  );
}

export default async function VideoDetailPage({ params }: VideoPageProps) {
  const { slug, id } = await params;
  const normalizedSlug = slug?.trim().toLowerCase();
  if (!normalizedSlug || !id) {
    notFound();
  }

  const channel = await getChannelPublicBySlug(normalizedSlug);
  if (!channel) {
    notFound();
  }

  const video = await getPublishedVideoById(id);
  if (!video || video.channel_id !== channel.id) {
    notFound();
  }

  const previewUrl = video.url;
  const fullUrl = video.url;
  const isPremium = false;

  return (
    <BaseLayout>
      <main className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">{video.title}</h1>
          {video.description ? (
            <p className="text-sm text-muted-foreground">{video.description}</p>
          ) : null}
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          <VideoPlayer url={previewUrl} title={`${video.title} preview`} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Full video</h2>
          {isPremium ? (
            <Card>
              <CardHeader>
                <CardTitle>Unlock the full video</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Subscribe or buy access to watch the full video.
                </p>
                <Button>Subscribe or Buy to watch</Button>
              </CardContent>
            </Card>
          ) : (
            <VideoPlayer url={fullUrl} title={video.title} />
          )}
        </section>
      </main>
    </BaseLayout>
  );
}
