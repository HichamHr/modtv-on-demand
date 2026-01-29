import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ChannelHeroProps = {
  name: string;
  description?: string | null;
  videoCount: number;
};

export function ChannelHero({ name, description, videoCount }: ChannelHeroProps) {
  const statsLabel = `${videoCount} video${videoCount === 1 ? "" : "s"}`;

  return (
    <section className="rounded-2xl border bg-card p-8 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">{name}</h1>
          <p className="text-sm text-muted-foreground">
            {description || "Fresh releases, behind-the-scenes, and full episodes."}
          </p>
          <Separator />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {statsLabel}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="h-11 px-6">Subscribe</Button>
          <Button asChild variant="outline" className="h-11 px-6">
            <Link href="#videos">Browse videos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
