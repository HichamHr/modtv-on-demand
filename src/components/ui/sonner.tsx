import * as React from "react";
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      richColors
      closeButton
      toastOptions={{
        className: "border border-border bg-background text-foreground",
      }}
      {...props}
    />
  );
}
