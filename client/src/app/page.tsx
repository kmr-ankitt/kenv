"use client"
import { AnimatedButton } from "@/components/AnimatedButton";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex gap-5 items-center justify-center">
      <Link href="/login">
        <AnimatedButton value="Login" />
      </Link>
      <Link href="/register">
        <AnimatedButton value="Register" />
      </Link>
    </div>
  );
}
