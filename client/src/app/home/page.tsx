"use client"

import EnvTabs from "@/components/EnvTabs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    if (!document.cookie.includes("access_token")) router.push("/login")
  })
  return (
    <div className="h-screen w-full text-zinc-200">
      <EnvTabs />
    </div>
  )
}
