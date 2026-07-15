"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingStep2Schema } from "@/constants/zod-schemas";
import type {
  OnboardingStep2Props,
  OnboardingStep2Data,
} from "@/types/onboarding-types";
import { ArrowLeft, Mail } from "lucide-react";
import { DatePicker, toISODateString } from "@/components/reusable/date-picker";
import { PhoneInput } from "@/components/reusable/phone-input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogoIconBlack } from "@/constants/social-icons";
import { COUNTRIES, CITIES_BY_COUNTRY } from "@/data/mock-data/onboarding";

type FormValues = OnboardingStep2Data;

const inputStyles =
  "h-10 w-full rounded-lg border-0 bg-slate-100 px-3 text-slate-600 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0 sm:h-11 sm:px-4 sm:h-12";

// No one signing up today was born in the future, and 120 years is a generous upper bound.
const MAX_BIRTH_DATE = toISODateString(new Date());
const MIN_BIRTH_DATE = toISODateString(
  new Date(
    new Date().getFullYear() - 120,
    new Date().getMonth(),
    new Date().getDate(),
  ),
);

export function OnboardingStep2({
  initialValues,
  onNext,
  onBack,
  loading,
}: OnboardingStep2Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(onboardingStep2Schema),
    mode: "onBlur",
    defaultValues: {
      email: initialValues?.email || "",
      phoneNumber: initialValues?.phoneNumber || "",
      birthDate: initialValues?.birthDate || "",
      country: initialValues?.country || "",
      city: initialValues?.city || "",
    },
  });

  const selectedCountry = form.watch("country");
  const cityOptions = selectedCountry
    ? CITIES_BY_COUNTRY[selectedCountry] || []
    : [];

  const onSubmit = (data: OnboardingStep2Data) => {
    onNext(data);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-[#efeef2] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-md space-y-5 rounded-3xl bg-white p-4 shadow-[0_4px_24px_rgba(15,15,20,0.06)] sm:max-w-lg sm:space-y-6 sm:p-8 md:max-w-xl md:p-10 lg:max-w-2xl">
        {/* Back + step indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-200 sm:px-3 sm:py-1.5 sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            back
          </button>
          <div className="h-px flex-1 bg-gray-200" />
          <span className="whitespace-nowrap text-[10px] text-muted-foreground sm:text-xs">
            step 2 of 5
          </span>
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
                Let us know more about you
              </h2>

              {/* Email - prefilled from signup, read-only */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail address:</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          readOnly
                          className={`${inputStyles} pr-10 cursor-default`}
                          {...field}
                        />
                        <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number*</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth date */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date*</FormLabel>
                    <FormControl>
                      <DatePicker
                        ref={field.ref}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="Select your birth date"
                        maxDate={MAX_BIRTH_DATE}
                        minDate={MIN_BIRTH_DATE}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country*</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // reset city whenever country changes
                        form.setValue("city", "");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={inputStyles}>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[100]">
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedCountry}
                    >
                      <FormControl>
                        <SelectTrigger className={inputStyles}>
                          <SelectValue
                            placeholder={
                              selectedCountry
                                ? "Select your city"
                                : "Select a country first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[100]">
                        {cityOptions.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
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
              disabled={loading}
            >
              {loading ? "Please wait..." : "Continue"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
