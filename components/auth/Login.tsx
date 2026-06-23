"use client";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/constants/zod-schemas";

type RegisterFormData = z.infer<typeof registerSchema>;

interface LoginProps {
  logo?: React.ReactNode;
  title?: string;
  description?: string;
  socialLinks?: { icon: React.ReactNode; href: string; title: string }[];
  onSubmit?: (data: RegisterFormData) => void;
  termsText?: React.ReactNode;
  loginLink?: { text: string; href: string };
  className?: string;
}

const Login = ({
  logo = <LogoIconBlack className="h-8 w-auto dark:invert" />,
  title = "Welcome Back",
  description = "Welcome back! Please enter your details",
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
  loginLink = { text: "Not a dreamer yet?", href: "/register" },
  className,
}: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

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
              onSubmit={form.handleSubmit((data) => onSubmit?.(data))}
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
                    <div className="flex justify-end">
                      <a
                        href="/forgot-password"
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={form.formState.isSubmitting}
                variant="gradient_fill"
              >
                {form.formState.isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-4 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {socialLinks.map((link) => (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                key={link.title}
                asChild
              >
                <a href={link.href} aria-label={`Log in with ${link.title}`}>
                  {link.icon}
                </a>
              </Button>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            {loginLink.text}{" "}
            <a
              href={loginLink.href}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Register
            </a>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Login;
export { type RegisterFormData };
