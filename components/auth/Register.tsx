"use client";
import { RegisterUser } from "@/api/requests";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  GoogleIcon,
  LogoIconBlack,
} from "@/constants/social-icons";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/constants/zod-schemas";

type RegisterFormData = z.infer<typeof registerSchema>;

interface Register01Props {
  logo?: React.ReactNode;
  title?: string;
  description?: string;
  socialLinks?: { icon: React.ReactNode; href: string; title: string }[];
  onSubmit?: (data: RegisterFormData) => void;
  termsText?: React.ReactNode;
  loginLink?: { text: string; href: string };
  className?: string;
}

const Register = ({
  logo = <LogoIconBlack className="h-8 w-auto dark:invert" />,
  title = "Create an account",
  description = "Become a dreamer now and start fulfilling your dream!",
  socialLinks = [
    { icon: <GoogleIcon className="size-5" />, href: "#", title: "Google" },
  ],
  onSubmit,
  termsText = (
    <>
      By signing up, you agree to our{" "}
      <a
        href="/terms-conditions"
        className="underline underline-offset-4 hover:text-foreground"
      >
        Terms and Conditions
      </a>
    </>
  ),
  loginLink = { text: "Already have an account?", href: "/login" },
  className,
}: Register01Props) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const handleSubmit = async (data: RegisterFormData): Promise<void> => {
    setSubmitError("");

    try {
      await RegisterUser({
        email: data.email,
        password: data.password,
      });

      onSubmit?.(data);
      router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";

      setSubmitError(message);
    }
  };

  const PasswordToggle = ({
    show,
    onToggle,
  }: {
    show: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
    >
      {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );

  return (
    <section
      className={cn(
        "flex min-h-screen w-full items-center justify-center bg-muted/30 p-4",
        className,
      )}
    >
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">{logo}</div>
          <h1 className="text-4xl font-bold tracking-tight font-heading text-gradient-2">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground font-sans">{description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Email"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="pr-10 pl-10"
                          {...field}
                        />
                        <PasswordToggle
                          show={showPassword}
                          onToggle={() => setShowPassword(!showPassword)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          className="pr-10 pl-10"
                          {...field}
                        />
                        <PasswordToggle
                          show={showConfirmPassword}
                          onToggle={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {submitError ? (
                <p className="text-center text-sm text-destructive">
                  {submitError}
                </p>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={form.formState.isSubmitting}
                variant="gradient_fill"
              >
                {form.formState.isSubmitting
                  ? "Creating account..."
                  : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {termsText && (
            <p className="text-center text-xs text-muted-foreground">
              {termsText}
            </p>
          )}
          <p className="text-center text-sm text-muted-foreground">
            {loginLink.text}{" "}
            <a
              href={loginLink.href}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Register;
export { type RegisterFormData };
