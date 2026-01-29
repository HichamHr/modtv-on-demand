"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoCard } from "@/components/public/VideoCard";
import type { Database } from "@/types/supabase";

type VideoRow = Database["public"]["Tables"]["videos"]["Row"];

type VideoGridProps = {
  slug: string;
  videos: VideoRow[];
};

function VideoGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-64 w-full rounded-xl" />
      ))}
    </div>
  );
}

function filterVideos(videos: VideoRow[], filter: "all" | "free" | "premium") {
  if (filter === "free") {
    return videos.filter((video) => !video.is_premium);
  }
  if (filter === "premium") {
    return videos.filter((video) => video.is_premium);
  }
  return videos;
}

export function VideoGrid({ slug, videos }: VideoGridProps) {
  const [activeTab, setActiveTab] = React.useState<"all" | "free" | "premium">("all");
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);
  const filteredVideos = React.useMemo(
    () => filterVideos(videos, activeTab),
    [videos, activeTab]
  );

  if (videos.length === 0) {
    return null;
  }

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="free">Free</TabsTrigger>
        <TabsTrigger value="premium">Premium</TabsTrigger>
      </TabsList>
      <TabsContent value={activeTab} className="mt-6">
        {!hydrated ? (
          <VideoGridSkeleton />
        ) : filteredVideos.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No videos match this filter yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                href={`/${slug}/videos/${video.id}`}
                title={video.title}
                description={video.description}
                thumbnailUrl={video.thumbnail_url}
                isPremium={video.is_premium}
                priceCents={video.price_cents}
                currency={video.currency}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
