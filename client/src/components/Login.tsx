"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/utils/token";

const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})

export default function Login() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  useEffect(() => {
    const token = getToken();
    if (token)
      router.replace("/home");
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const formData = new URLSearchParams();
      formData.append("grant_type", "password");
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("scope", "");
      formData.append("client_id", "");
      formData.append("client_secret", "");

      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      document.cookie = `access_token=${result.access_token}; path=/; secure`;
      router.push("/home");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 min-h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7 w-full p-5 md:w-1/4 border border-purple-200/25 rounded-lg">
          <h1 className="text-2xl text-zinc-200 font-bold">Login to Kenv</h1>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="text-zinc-200">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} className="border border-purple-200/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="text-zinc-200">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} className="border border-purple-200/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AnimatedButton value="Login" />
        </form>
      </Form>
    </div>
  )
}