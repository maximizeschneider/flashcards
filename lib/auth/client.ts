import { createAuthClient } from "@better-auth/react";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
});

export const {
  useSession,
  useUser,
  signIn,
  signOut,
  signUp,
  getToken,
} = authClient;
