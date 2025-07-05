"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/history", label: "History" },
    { href: "/campaigns", label: "Create Campaign" },
    { href: "/settings/smtp", label: "Settings" },
  ];

  return (
    <aside className="w-[200px] h-screen fixed top-0 left-0 bg-sidebar border-r border-sidebar-border p-6 text-sidebar-foreground">
      <h1 className="text-lg font-semibold mb-8 text-sidebar-primary">
        Bulk Mail Sender
      </h1>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-md hover:bg-muted ${
              pathname === item.href ? "bg-muted font-medium" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Button
        variant="destructive"
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="mt-10 w-full"
      >
        Logout
      </Button>
    </aside>
  );
}

