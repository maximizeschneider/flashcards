"use client";

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { useMemo } from "react";

import { Toaster } from "@/components/ui/toaster";
import { getToken, useSession } from "@/lib/auth/client";

function useConvexAuth() {
  const { data, status } = useSession();

  return {
    isLoading: status === "loading",
    isAuthenticated: Boolean(data?.user),
    fetchToken: async () => {
      const token = await getToken();
      return token?.value ?? null;
    },
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://localhost:3000";
  const convex = useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);

  return (
    <ConvexProviderWithAuth client={convex} useAuth={useConvexAuth}>
      {children}
      <Toaster />
    </ConvexProviderWithAuth>
  );
}
