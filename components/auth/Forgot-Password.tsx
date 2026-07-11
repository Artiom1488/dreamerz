

"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { LogoIconBlack } from "@/constants/social-icons";
import { forgotPasswordSchema } from "@/constants/zod-schemas";
import { cn } from "@/lib/utils";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordProps {
    logo?: React.ReactNode;
    title?: string;
    description?: string;
    onSubmit?: (data: ForgotPasswordFormData) => Promise<void> | void;
    loginLink?: { text: string; href: string };
    className?: string;
}

const ForgotPassword = ({
    logo = <LogoIconBlack className="h-8 w-auto dark:invert" />,
    title = "Forgot password?",
    description = "Enter your email and we will send you a reset link.",
    onSubmit,
    loginLink = { text: "Back to login", href: "/login" },
    className,
}: ForgotPasswordProps) => {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");
    const [submitError, setSubmitError] = useState("");

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const handleSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
        setSubmitError("");

        try {
            if (onSubmit) {
                await onSubmit(data);
            }

            setSubmittedEmail(data.email);
            setIsEmailSent(true);
            form.reset();
        } catch {
            setSubmitError("Something went wrong. Please try again.");
        }
    };

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
                    <h1 className="text-gradient-2 font-heading text-4xl font-bold tracking-tight">
                        {title}
                    </h1>
                    <p className="font-sans text-sm text-muted-foreground">{description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                    {isEmailSent ? (
                        <div className="space-y-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                If an account exists for{" "}
                                <span className="font-medium text-foreground">
                                    {submittedEmail}
                                </span>
                                , a reset link has been sent.
                            </p>

                            <Button
                                type="button"
                                className="w-full"
                                size="lg"
                                variant="gradient_fill"
                                onClick={() => setIsEmailSent(false)}
                            >
                                Send again
                            </Button>
                        </div>
                    ) : (
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
                                                    <Input placeholder="Email" className="pl-10" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {submitError ? (
                                    <p className="text-sm text-destructive">{submitError}</p>
                                ) : null}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={form.formState.isSubmitting}
                                    variant="gradient_fill"
                                >
                                    {form.formState.isSubmitting
                                        ? "Sending reset password..."
                                        : "Reset password"}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <a
                        href={loginLink.href}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                        <ArrowLeft className="size-4" />
                        {loginLink.text}
                    </a>
                </CardFooter>
            </Card>
        </section>
    );
};

export default ForgotPassword;
export type { ForgotPasswordFormData };