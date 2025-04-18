"use client"
import { AnimatedButton } from "@/components/AnimatedButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    if (document.cookie.includes("access_token")) router.push("/home")
  })
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
