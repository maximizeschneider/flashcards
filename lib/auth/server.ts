import { createAuth } from "better-auth";
import { convexAdapter } from "@better-auth/convex";

export const auth = createAuth({
  database: convexAdapter(),
  session: {
    cookie: {
      name: "flashcards_session",
    },
  },
  emailAndPassword: {
    enabled: true,
    maxPasswordAttempts: 5,
  },
});
