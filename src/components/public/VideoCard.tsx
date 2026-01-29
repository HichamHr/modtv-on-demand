import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";

type VideoCardProps = {
  href: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  isPremium: boolean;
  priceCents: number;
  currency: string;
  showPublishedBadge?: boolean;
};

export function VideoCard({
  href,
  title,
  description,
  thumbnailUrl,
  isPremium,
  priceCents,
  currency,
  showPublishedBadge = true,
}: VideoCardProps) {
  return (
    <Link href={href} className="group focus:outline-none">
      <Card className="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
        <div className="relative">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-44 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-muted via-background to-muted">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                ModTV
              </span>
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            {showPublishedBadge ? <Badge variant="secondary">Published</Badge> : null}
            <Badge variant={isPremium ? "default" : "outline"}>
              {isPremium ? "Premium" : "Free"}
            </Badge>
          </div>
        </div>
        <CardHeader className="space-y-2">
          <div className="text-lg font-semibold leading-tight text-foreground">
            {title}
          </div>
          <div className="text-sm text-muted-foreground">
            {description || "Catch the latest release from this channel."}
          </div>
        </CardHeader>
        {isPremium ? (
          <CardContent className="pt-0 text-sm font-medium text-foreground">
            {formatMoney(priceCents, currency)}
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}
