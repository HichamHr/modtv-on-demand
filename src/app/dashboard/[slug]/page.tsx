import { BaseLayout } from "@/components/base-layout";
import { requireChannelMember } from "@/lib/data/channels";

export const dynamic = "force-dynamic";

type ChannelPageProps = {
  params: Promise<{ slug?: string }>;
};

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { slug } = await params;
  const normalizedSlug = slug?.trim().toLowerCase();
  if (!normalizedSlug) {
    return (
      <BaseLayout>
        <main className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">Channel not found</h1>
          <p className="text-sm text-muted-foreground">
            Check the URL or return to your dashboard.
          </p>
        </main>
      </BaseLayout>
    );
  }
  const { channel, role } = await requireChannelMember(normalizedSlug);

  return (
    <BaseLayout>
      <main className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{channel.title}</h1>
        <p className="text-sm text-muted-foreground">/{channel.slug}</p>
        <p className="text-sm text-muted-foreground">Role: {role}</p>
        <p className="text-sm text-muted-foreground">
          Overview placeholder for channel dashboard.
        </p>
      </main>
    </BaseLayout>
  );
}
