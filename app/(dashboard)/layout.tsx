import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";

import { auth } from "@/lib/auth/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth.api.getSession();

  if (!session?.data?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-sm font-semibold text-foreground">
            Flashcards
          </Link>
          <SignOutButton />
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
