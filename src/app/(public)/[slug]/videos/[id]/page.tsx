import Link from "next/link";
import { notFound } from "next/navigation";

import { BaseLayout } from "@/components/base-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PaywallCard } from "@/components/public/PaywallCard";
import { VideoCard } from "@/components/public/VideoCard";
import {
  getChannelPublicBySlug,
  getPublishedVideoById,
  getPublishedVideosByChannelId,
} from "@/lib/data/public";

type VideoPageProps = {
  params: Promise<{ slug?: string; id?: string }>;
};

function isMp4(url: string) {
  return /\.mp4($|\?)/i.test(url);
}

function VideoPlayer({ url }: { url: string }) {
  return (
    <video
      className="aspect-video w-full rounded-xl bg-black/10 shadow-sm"
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

  const relatedVideos = (await getPublishedVideosByChannelId(channel.id))
    .filter((item) => item.id !== video.id)
    .slice(0, 3);

  const previewUrl = video.preview_url || video.url;
  const fullUrl = video.full_url || video.url;

  return (
    <BaseLayout>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/${channel.slug}`} className="hover:text-foreground">
            {channel.name}
          </Link>
          <span>/</span>
          <span>{video.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="flex flex-col gap-6">
            <header className="space-y-2">
              <h1 className="text-3xl font-semibold">{video.title}</h1>
              {video.description ? (
                <p className="text-sm text-muted-foreground">{video.description}</p>
              ) : null}
            </header>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Preview</h2>
              {previewUrl ? (
                isMp4(previewUrl) ? (
                  <VideoPlayer url={previewUrl} />
                ) : (
                  <Button asChild variant="outline">
                    <a href={previewUrl} target="_blank" rel="noreferrer">
                      Preview available
                    </a>
                  </Button>
                )
              ) : (
                <Card>
                  <CardContent className="py-6 text-sm text-muted-foreground">
                    Preview not available for this video.
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <h2 className="text-lg font-semibold">Access</h2>
            {video.is_premium ? (
              <PaywallCard priceCents={video.price_cents} currency={video.currency} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Full video</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {fullUrl ? (
                    isMp4(fullUrl) ? (
                      <VideoPlayer url={fullUrl} />
                    ) : (
                      <Button asChild>
                        <a href={fullUrl} target="_blank" rel="noreferrer">
                          Watch full video
                        </a>
                      </Button>
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Full video link coming soon.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </aside>
        </div>

        {relatedVideos.length > 0 ? (
          <>
            <Separator />
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">More videos</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedVideos.map((item) => (
                  <VideoCard
                    key={item.id}
                    href={`/${channel.slug}/videos/${item.id}`}
                    title={item.title}
                    description={item.description}
                    thumbnailUrl={item.thumbnail_url}
                    isPremium={item.is_premium}
                    priceCents={item.price_cents}
                    currency={item.currency}
                  />
                ))}
              </div>
            </section>
          </>
        ) : null}
      </main>
    </BaseLayout>
  );
}
