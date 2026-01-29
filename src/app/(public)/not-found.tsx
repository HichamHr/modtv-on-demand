import { BaseLayout } from "@/components/base-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PublicNotFound() {
  return (
    <BaseLayout>
      <main className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t find that channel or video. Check the URL or try
              a different link.
            </p>
          </CardContent>
        </Card>
      </main>
    </BaseLayout>
  );
}
