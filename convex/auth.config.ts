import { convexAuth } from "@better-auth/convex";

import { auth } from "@/lib/auth/server";

export default convexAuth(auth);
