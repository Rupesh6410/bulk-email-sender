"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 mr-[200px]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center space-y-6"
      >
        <motion.h1
          className="text-5xl font-bold leading-tight tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          🚀 Bulk Mail Sender
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Send thousands of personalized emails with ease. Schedule campaigns, manage recipients, and track delivery metrics — all from one dashboard.
        </motion.p>

        <motion.div
          className="flex justify-center gap-4 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link href="/signin">
            <button className="bg-primary text-white px-6 py-2 rounded-md">Get Started</button>
          </Link>
          <Link href="#features">
            <button className="border border-primary text-primary px-6 py-2 rounded-md">
              Learn More
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}