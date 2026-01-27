import { BaseLayout } from "@/components/base-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <BaseLayout>
      <main className="flex flex-col gap-12">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              SaaS streaming platform
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              ModTV On-Demand
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Launch and monetize video channels
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg">Get started</Button>
            <Alert className="w-full sm:w-auto">
              <AlertTitle>Early access</AlertTitle>
              <AlertDescription>
                Invite-only onboarding for new creators.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Build your channel</CardTitle>
              <CardDescription>
                Collect interested viewers before launch.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input placeholder="you@studio.com" type="email" />
                <Button variant="secondary">Notify me</Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Channel actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Publish trailer</DropdownMenuItem>
                  <DropdownMenuItem>Invite collaborators</DropdownMenuItem>
                  <DropdownMenuItem>View analytics</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Launch checklist</CardTitle>
              <CardDescription>
                Keep teams aligned while you prepare.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Preview onboarding</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Creator onboarding</DialogTitle>
                    <DialogDescription>
                      Invite collaborators, upload media, and set pricing in one
                      flow.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </DialogContent>
              </Dialog>
              <Alert>
                <AlertTitle>Ready for launch</AlertTitle>
                <AlertDescription>
                  Your pipeline is configured for subscriptions and pay-per-view
                  releases.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>
      </main>
    </BaseLayout>
  );
}
