import { notFound } from "next/navigation";

import { BaseLayout } from "@/components/base-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChannelHero } from "@/components/public/ChannelHero";
import { VideoGrid } from "@/components/public/VideoGrid";
import {
  getChannelPublicBySlug,
  getPublishedVideosByChannelId,
} from "@/lib/data/public";

type ChannelPageProps = {
  params: Promise<{ slug?: string }>;
};

export default async function ChannelStorefrontPage({ params }: ChannelPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug?.trim().toLowerCase();
  if (!normalizedSlug) {
    notFound();
  }

  const channel = await getChannelPublicBySlug(normalizedSlug);
  if (!channel) {
    notFound();
  }

  const videos = await getPublishedVideosByChannelId(channel.id);

  return (
    <BaseLayout>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <ChannelHero
          name={channel.name}
          description={channel.description}
          videoCount={videos.length}
        />

        <Separator />

        <section id="videos" className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Videos</h2>
          </div>

          {videos.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No videos yet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This channel hasn&apos;t published any videos yet. Publish new
                  releases from your dashboard to show them here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <VideoGrid slug={channel.slug} videos={videos} />
          )}
        </section>
      </main>
    </BaseLayout>
  );
}
