"use client"
import AnimatedButton from "@/components/AnimatedButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (document.cookie.includes("access_token")) router.push("/home")
  })
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold text-zinc-200">Welcome to <span className="text-purple-300">Kenv</span></h1>
      <p className="text-lg text-gray-600 ">Organise your envs.</p>
      <AnimatedButton
        value="Get Started"
        onClick={() => router.push("/login")}
      />
    </div>
  );
}
