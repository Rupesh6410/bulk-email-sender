"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      router.push("/");
    }
  }, [session, router]);

  // 🔒 Don't render anything while loading or if already authenticated
  if (status === "loading" || session?.user?.email) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-6 bg-card p-10 rounded-2xl shadow-lg border border-border"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-bold"
        >
          Welcome Back
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-muted-foreground"
        >
          Sign in to your Bulk Mail Sender dashboard
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onClick={() => signIn("google")}
          className="bg-primary text-white py-2 px-6 rounded-full hover:scale-105 transition transform duration-200"
        >
          Sign in with Google
        </motion.button>
      </motion.div>
    </main>
  );
}
