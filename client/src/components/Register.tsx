"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import  AnimatedButton  from "@/components/AnimatedButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/utils/token";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})

export default function Register() {
  const [errorText, setErrorText] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
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

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const result = await res.json();
      if (!res.ok) {
        if (result.detail === "Username already exists") {
          setErrorText("This username is already taken. Please choose another one.");
        } else {
          setErrorText(result.detail);
        }
        return;
      }
      document.cookie = `access_token=${result.access_token}; path=/; secure`;
      router.push("/home");
    } catch (error) {
      console.log("Error:", error);
      setErrorText("An unexpected error occurred. Please try again later.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 min-h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-full p-5 md:w-1/4 border border-purple-200/25 rounded-lg">
          <h1 className="text-2xl text-zinc-200 font-bold">Register to Kenv</h1>
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
          {errorText && (
            <div className="text-red-500 text-sm">
              {errorText}
            </div>
          )}
          <AnimatedButton value="Register" />
        </form>
      </Form>
    </div>
  )
}