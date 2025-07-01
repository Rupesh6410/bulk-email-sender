"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();

  if (session) return null;

  return (
    (session?null:(<nav className="flex justify-between items-center px-6 py-4 bg-background border-b border-border text-foreground">
      <Link href="/" className="text-xl font-bold text-primary">
        Bulk Mail Sender
      </Link>

      <div className="flex gap-4">
        <Button onClick={() => signIn()} variant="ghost">
          Sign In
        </Button>
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
      </div>
    </nav>))
  );
}
