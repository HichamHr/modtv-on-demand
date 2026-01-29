import { BaseLayout } from "@/components/base-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-actions";
import { getUserChannels } from "@/lib/data/channels";
import { CreateChannelDialog } from "@/app/dashboard/create-channel-dialog";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireUser();
  const channels = await getUserChannels();

  return (
    <BaseLayout>
      <main className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Your Channels</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user.email ?? "creator"}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CreateChannelDialog />
            <form action={signOutAction}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </div>
        </div>

        {channels.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No channels yet</CardTitle>
              <CardDescription>
                Create your first channel to start publishing videos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateChannelDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {channels.map(({ channel, role }) => (
              <Card key={channel.id}>
                <CardHeader>
                  <CardTitle>{channel.title}</CardTitle>
                  <CardDescription>/{channel.slug}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Role: {role}
                  </div>
                  <Button asChild>
                    <Link href={`/dashboard/${channel.slug}`}>Open</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </BaseLayout>
  );
}
