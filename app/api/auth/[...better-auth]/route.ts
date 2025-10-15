import { auth } from "@/lib/auth/server";

const { GET, POST } = auth.handlers;

export { GET, POST };
