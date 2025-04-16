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
    console.log(data)
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
                  <Input
                    type="date"
                    value={field.value ? field.value.toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
                      field.onChange(selectedDate);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    min={new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // Minimum date is 10 days from now
                  />
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