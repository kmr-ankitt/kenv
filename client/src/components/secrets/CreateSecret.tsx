import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AnimatedButton } from "../AnimatedButton";
import { DatePicker } from "../DatePicker";

export default function CreateSecret() {
  const formSchema = z.object({
    secretName: z.string().min(1, "Secret name is required"),
    secretValue: z.string().min(1, "Secret value is required"),
    expiryDate: z.date().optional(),
  });

  type FormSchema = z.infer<typeof formSchema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      secretName: "",
      secretValue: "",
      expiryDate: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const transformedData = {
      name: data.secretName,
      value: data.secretValue,
      expires_at: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
    };

    console.log(transformedData);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch("http://localhost:8000/secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },

        body: JSON.stringify(transformedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to create secret");
      }

      const responseData = await res.json();
      console.log(responseData);
    } catch (error) {
      console.error("Error creating secret:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-4 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full p-2">
          <FormField
            control={form.control}
            name="secretName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Secret Name<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="MY SECRET" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secretValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret Value<span className="text-red-500" >*</span></FormLabel>
                <FormControl>
                  <Input type="password" placeholder="MY PASSWORD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AnimatedButton value="Submit" />
        </form>
      </Form>
    </div >
  );
}