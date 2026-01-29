import Link from "next/link";
import { notFound } from "next/navigation";

import { BaseLayout } from "@/components/base-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <main className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">{channel.name}</h1>
          {channel.description ? (
            <p className="text-sm text-muted-foreground">{channel.description}</p>
          ) : null}
        </header>

        {videos.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No videos yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This channel hasn&apos;t published any videos yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Link key={video.id} href={`/${channel.slug}/videos/${video.id}`}>
                <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {video.description ?? "Watch the latest release."}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </BaseLayout>
  );
}
