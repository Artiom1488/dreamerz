"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogoIconBlack } from "@/constants/social-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["MALE", "FEMALE"]),
});

type FormValues = z.infer<typeof formSchema>;

interface OnboardingStep1Props {
  initialValues?: {
    firstName?: string;
    lastName?: string;
    gender?: "MALE" | "FEMALE";
  };
  onNext: (data: FormValues) => void;
}

export function OnboardingStep1({
  initialValues,
  onNext,
}: OnboardingStep1Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      gender: initialValues?.gender || undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    onNext(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#efeef2] p-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-[0_4px_24px_rgba(15,15,20,0.06)] sm:p-10">
        {/* Step indicator */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            step <span className="text-indigo-400">1</span> of 5
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center">
          <LogoIconBlack className="h-8 w-auto dark:invert" />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-center text-2xl font-heading font-bold">
                Welcome, how should we call you?
              </h2>

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        className="h-12 rounded-lg border-0 bg-slate-100 px-4 text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        className="h-12 rounded-lg border-0 bg-slate-100 px-4 text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 w-full rounded-lg border-0 bg-slate-100 px-4 text-slate-600 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[100]">
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              variant="gradient_fill"
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
