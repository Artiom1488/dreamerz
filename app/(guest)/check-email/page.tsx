import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogoIconBlack } from "@/constants/social-icons";
import { MessageCircleCheck } from "lucide-react";

interface CheckEmailPageProps {
	searchParams: Promise<{
		email?: string;
	}>;
}

const CheckEmailPage = async ({
	searchParams,
}: CheckEmailPageProps) => {
	const { email } = await searchParams;

	return (
		<section className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-2xl rounded-3xl border-border/60 shadow-2xl shadow-black/5">
				<CardHeader className="items-center pt-8 text-center">
					<div className="mb-6 flex w-full justify-center">
						<LogoIconBlack className="h-8 w-auto" />
					</div>
					<div className="mb-5 flex w-full justify-center">
						<MessageCircleCheck
							className="size-14 text-[#7ecddb]"
							strokeWidth={2.25}
						/>
					</div>
					<h1 className="font-heading text-4xl leading-none font-bold text-foreground sm:text-5xl">
						Check Your Email
					</h1>
				</CardHeader>

				<CardContent className="pb-10 text-center">
					<div className="mx-auto max-w-xl space-y-7">
						<p className="text-base leading-7 text-muted-foreground sm:text-xl sm:leading-9">
							We have sent an email to{" "}
							<span className="font-medium text-foreground underline underline-offset-4">
								{email || "your email address"}
							</span>{" "}
							with a confirmation link. You can now close this tab.
						</p>

						<div className="flex justify-center">
							<Button size="lg" className="min-w-52 px-8 text-base" variant="gradient_fill" asChild>
								<Link href="/">Go to home page</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

export default CheckEmailPage;
