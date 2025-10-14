"use client";

import {
  AuthTokenFetcher,
  ConvexProviderWithAuth,
  ConvexReactClient,
} from "convex/react";
import { useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";

type AuthInfo = {
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchToken: AuthTokenFetcher;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "http://localhost:3000";
  const convex = useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);
  const auth = useMemo<AuthInfo>(
    () => ({
      isLoading: false,
      isAuthenticated: true,
      fetchToken: async () => null,
    }),
    [],
  );

  return (
    <ConvexProviderWithAuth client={convex} useAuth={() => auth}>
      {children}
      <Toaster />
    </ConvexProviderWithAuth>
  );
}
