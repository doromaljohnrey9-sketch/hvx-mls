"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-bold">Approval status error</h2>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        An error occurred while checking your approval status. Please try again or contact support.
      </p>
      <div className="flex gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/login")}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
