"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/money";

type PaywallCardProps = {
  priceCents: number;
  currency: string;
};

export function PaywallCard({ priceCents, currency }: PaywallCardProps) {
  const price = formatMoney(priceCents, currency);

  return (
    <Card className="border-primary/40">
      <CardHeader>
        <CardTitle>Unlock full access</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-3xl font-semibold">{price}</div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>HD streaming access</li>
          <li>Full episode unlocked</li>
          <li>Watch anytime</li>
        </ul>
        <Separator />
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => toast.message("Payments coming next (Stripe).")}
          >
            Buy this video
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.message("Payments coming next (Stripe).")}
          >
            Subscribe to channel
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Secure checkout will be available soon.
        </p>
      </CardContent>
    </Card>
  );
}
