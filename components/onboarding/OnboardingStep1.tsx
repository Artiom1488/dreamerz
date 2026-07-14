"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingStep1Schema } from "@/constants/zod-schemas";
import type {
  OnboardingStep1Props,
  OnboardingStep1Data,
} from "@/types/onboarding-types";
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

type FormValues = OnboardingStep1Data;

export function OnboardingStep1({
  initialValues,
  onNext,
}: OnboardingStep1Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      gender: initialValues?.gender || undefined,
    },
  });

  const onSubmit = (data: OnboardingStep1Data) => {
    onNext(data);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-[#efeef2] px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-md space-y-5 rounded-3xl bg-white p-4 shadow-[0_4px_24px_rgba(15,15,20,0.06)] sm:space-y-6 sm:p-8 md:p-10">
        {/* Step indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="whitespace-nowrap text-[10px] text-muted-foreground sm:text-xs">
            step <span className="text-indigo-400">1</span> of 5
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center">
          <LogoIconBlack className="h-6 w-auto dark:invert sm:h-8" />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-center text-lg font-heading font-bold sm:text-xl md:text-2xl">
                Welcome, how should we call you?
              </h2>

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">
                      First name*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        className="h-10 rounded-lg border-0 bg-slate-100 px-3 text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0 sm:h-11 sm:px-4 sm:h-12"
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
                    <FormLabel className="text-xs sm:text-sm">
                      Last name*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        className="h-10 rounded-lg border-0 bg-slate-100 px-3 text-slate-600 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0 sm:h-11 sm:px-4 sm:h-12"
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
                    <FormLabel className="text-xs sm:text-sm">
                      Gender*
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full rounded-lg border-0 bg-slate-100 px-3 text-slate-600 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0 sm:h-11 sm:px-4 sm:h-12">
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
