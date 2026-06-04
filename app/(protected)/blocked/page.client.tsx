"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getSupabaseClient } from "@/lib/supabase/client";

import { useAuth } from "@/hooks/use-auth";
import { getQueryKey } from "@/lib/query/get-query-keys";

export const PageClient = () => {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    queryClient.invalidateQueries({ queryKey: getQueryKey.users.all });
    toast.success("Log out successful.");
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Ban className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Account Blocked</CardTitle>
          <CardDescription>
            Your account has been blocked by an administrator.
            <br />
            If you believe this is an error, please contact support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && <p className="text-sm text-muted-foreground">Account: {user.email}</p>}
          <Button variant="outline" onClick={handleSignOut} className="w-full">
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
