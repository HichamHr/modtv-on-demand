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

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <BaseLayout>
      <main className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Welcome back, {user.email ?? "creator"}.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Manage your channels, releases, and revenue insights.
            </div>
            <form action={signOutAction}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </BaseLayout>
  );
}
