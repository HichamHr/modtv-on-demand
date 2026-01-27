import * as React from "react";

import { cn } from "@/lib/utils";

type BaseLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function BaseLayout({ children, className }: BaseLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-16 sm:px-8 lg:px-12">
        {children}
      </div>
    </div>
  );
}
