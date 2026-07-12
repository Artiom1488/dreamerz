"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Mail, Phone, Calendar as CalendarIcon } from "lucide-react";
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

// TODO: replace with a real country dataset (see notes below the component)
const COUNTRIES = [
  { code: "MD", name: "Moldova" },
  { code: "RO", name: "Romania" },
  { code: "UA", name: "Ukraine" },
  { code: "US", name: "United States" },
];

// TODO: replace with a real city dataset scoped by country (see notes below)
const CITIES_BY_COUNTRY: Record<string, string[]> = {
  MD: ["Chișinău", "Bălți", "Anenii Noi", "Orhei"],
  RO: ["Bucharest", "Cluj-Napoca", "Iași"],
  UA: ["Kyiv", "Lviv", "Odesa"],
  US: ["New York", "Los Angeles", "Chicago"],
};

const formSchema = z.object({
  email: z.string().email("Enter a valid email address").optional(),
  phoneNumber: z.string().min(6, "Phone number is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
});

type FormValues = z.infer<typeof formSchema>;

const inputStyles =
  "h-12 w-full rounded-lg border-0 bg-slate-100 px-4 text-slate-600 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-0";

interface OnboardingStep2Props {
  initialValues?: {
    email?: string;
    phoneNumber?: string;
    birthDate?: string;
    country?: string;
    city?: string;
  };
  onNext: (data: FormValues) => void;
  onBack: () => void;
}

export function OnboardingStep2({
  initialValues,
  onNext,
  onBack,
}: OnboardingStep2Props) {
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = (data: FormValues) => {
    onNext(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#efeef2] p-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-[0_4px_24px_rgba(15,15,20,0.06)] sm:p-10">
        {/* Back + step indicator */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            back
          </button>
          <div className="h-px flex-1 bg-gray-200" />
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            step 2 of 5
          </span>
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
                      <div className="relative">
                        <Input
                          type="tel"
                          placeholder="+373 00 000 000"
                          className={`${inputStyles} pr-10`}
                          {...field}
                        />
                        <Phone className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth date */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field: { ref, ...field } }) => (
                  <FormItem>
                    <FormLabel>Birth Date*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="date"
                          className={`${inputStyles} pr-10 [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0`}
                          ref={(el) => {
                            ref(el);
                            dateInputRef.current = el;
                          }}
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => dateInputRef.current?.showPicker?.()}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </button>
                      </div>
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
            >
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
