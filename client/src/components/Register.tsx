"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/AnimatedButton";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
})

export default function Register() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    console.log(data);
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 min-h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7 w-full p-5 md:w-1/4 border border-purple-200/25 rounded-lg">
          <h1 className="text-2xl text-zinc-200 font-bold">Register to Kenv</h1>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="text-zinc-200">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} className="border border-purple-200/20"/>
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
                  <Input type="password" placeholder="Password" {...field} className="border border-purple-200/20"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AnimatedButton value="Submit" />
        </form>
      </Form>
    </div>
  )
}