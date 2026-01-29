import Link from "next/link";

import { BaseLayout } from "@/components/base-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireChannelRole } from "@/lib/data/channels";
import { listChannelVideos } from "@/lib/data/videos";
import { PublishToggle } from "./publish-toggle";
import { VideoDialog } from "./video-dialog";

type VideosPageProps = {
  params: Promise<{ slug?: string }>;
};

function formatPrice(priceCents: number, currency: string) {
  if (priceCents <= 0) {
    return "Free";
  }
  const amount = (priceCents / 100).toFixed(2);
  return `${currency.toUpperCase()} ${amount}`;
}

export default async function ChannelVideosPage({ params }: VideosPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug?.trim().toLowerCase();
  if (!normalizedSlug) {
    return null;
  }

  const { channel, role } = await requireChannelRole(normalizedSlug, [
    "owner",
    "admin",
  ]);
  const videos = await listChannelVideos(normalizedSlug);

  return (
    <BaseLayout>
      <main className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Videos</h1>
            <p className="text-sm text-muted-foreground">
              {channel.title} - {role}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <VideoDialog slug={normalizedSlug} triggerLabel="Add Video" />
            <Button asChild variant="outline">
              <Link href={`/dashboard/${channel.slug}`}>Back to overview</Link>
            </Button>
          </div>
        </div>

        {videos.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No videos yet</CardTitle>
              <CardDescription>
                Add your first video to start publishing to the storefront.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoDialog slug={normalizedSlug} triggerLabel="Add your first video" />
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>{video.title}</CardTitle>
                    <CardDescription>
                      {video.is_published ? "Published" : "Draft"} -{" "}
                      {video.is_premium
                        ? `Premium - ${formatPrice(
                            video.price_cents,
                            video.currency
                          )}`
                        : "Free"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <VideoDialog
                      slug={normalizedSlug}
                      triggerLabel="Edit"
                      initialVideo={video}
                    />
                    <PublishToggle
                      slug={normalizedSlug}
                      videoId={video.id}
                      isPublished={video.is_published}
                    />
                  </div>
                </CardHeader>
                {video.description ? (
                  <CardContent className="text-sm text-muted-foreground">
                    {video.description}
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </main>
    </BaseLayout>
  );
}
