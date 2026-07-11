
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TermsSection = {
    id: string;
    title: string;
    paragraphs: string[];
    bullets?: string[];
};

const termsSections: TermsSection[] = [
    {
        id: "welcome",
        title: "Welcome to Dreamerz!",
        paragraphs: [
            "By using Dreamerz, you agree to these Terms of Use and all related policies published on our platform.",
            "In these terms, \"we,\" \"our,\" and \"us\" refer to Dreamerz Group LLC. \"Dreamerz\" refers to this platform and services offered by us.",
            "For information about our data practices, please review our Privacy Policy. We collect and use information according to those policies.",
        ],
    },
    {
        id: "account",
        title: "Your Account",
        paragraphs: [
            "You must be at least 13 years old to register for an account. If you are in Europe, the minimum age is 16. If you are under the age of majority in your jurisdiction (typically 18), you may only use Dreamerz with parent or guardian approval.",
            "You are responsible for your account and all activities while signed in. You must provide accurate information in good faith and keep it updated.",
            "Contact us immediately if you believe your account has been compromised.",
        ],
    },
    {
        id: "abusive-conduct",
        title: "Abusive Conduct",
        paragraphs: [
            "You are responsible for all activity on your account. If you violate our policies, we may suspend or terminate your account.",
            "Do not perform illegal activity, abuse others, or misuse the platform technically.",
            "Dreamerz reserves the right to refuse or suspend any dream fulfillment or Wings Donation that may violate these terms or harm users, the public, or Dreamerz.",
        ],
    },
    {
        id: "dreamer",
        title: "Being a Dreamer",
        paragraphs: [
            "A Dreamer is a person who publishes a clear dream on the platform, subscribes to one of the available packages, and starts fulfilling other dreams by sharing one $tar (dollar) per dream.",
            "All fulfilled dreams are collected on your profile and contribute toward the option to double the amount for your own dream.",
            "The more you give, the more you receive.",
        ],
    },
    {
        id: "membership",
        title: "Membership",
        paragraphs: [
            "To become a Dreamer, you set your dream, describe it clearly, set a target amount, upload photos, and launch a fulfillment campaign.",
            "You must subscribe to one of three monthly packages and help others by sharing one $tar per dream. Package differences are based on monthly price and number of dreams you plan to fulfill.",
            "Before choosing your target amount, consider how much you plan to give so the model aligns with your campaign goals.",
            "Dreams on the platform vary, and although we attempt to screen for fraudulent pages, we cannot guarantee identity or validity of all claims.",
        ],
    },
    {
        id: "payments",
        title: "Payments",
        paragraphs: [
            "As a Dreamer, you choose one of the three subscription packages. We handle payment operations including fraud, chargebacks, and payment dispute resolution.",
            "We may block or hold payments for policy violations or compliance reasons, including tax reporting requirements.",
            "When payments are delayed or blocked, we aim to communicate the reason promptly.",
        ],
    },
    {
        id: "fees",
        title: "Fees",
        paragraphs: [
            "Two fees may apply to your membership:",
        ],
        bullets: [
            "Platform fee (varies by subscription package).",
            "Payment processing fee: 2.9% + $0.30 USD per successful monthly subscription payment.",
            "Some banks may charge a foreign transaction fee (typically around 3.0%). Dreamerz does not control this charge.",
        ],
    },
    {
        id: "tax",
        title: "Tax",
        paragraphs: [
            "You are responsible for assessing, collecting, reporting, and remitting any taxes related to payments received through Dreamerz.",
        ],
    },
    {
        id: "dream-angel",
        title: "Being a Dream Angel",
        paragraphs: [
            "A Dream Angel fulfills others' dreams and contributes to Wings Donations.",
            "To become a Dream Angel, create an account, subscribe to one of the packages, and start fulfilling dreams by sharing one $tar per dream.",
            "Dream Angels may become Dreamers by creating their own dream. All fulfilled dreams are tracked on profile history.",
            "As with Dreamers, we attempt to screen suspicious pages but cannot guarantee every claim; user reporting helps keep the platform safe.",
        ],
    },
    {
        id: "dreams",
        title: "Dreams",
        paragraphs: [
            "To set a dream, provide a clear description, target amount, photos, and launch your campaign.",
            "Each dream fulfillment is one $tar (dollar). Dreams can be edited and then reviewed by Dreamerz for approval or requested modifications.",
            "To cash out, you must collect at least half of your target amount by fulfilling other members' dreams.",
            "Dreamerz charges a 10% administration fee from the total amount collected for each fulfilled dream.",
        ],
    },
    {
        id: "wings-donations",
        title: "Wings Donations",
        paragraphs: [
            "Wings Donations are charitable campaigns organized by Dreamerz to support people worldwide.",
            "Each donation is limited to one $tar and is non-collectible for Dreamerz and Dream Angels, meaning donations are made without expectation of return.",
            "Dreamerz charges a 10% administration fee from total Wings Donations collected.",
        ],
    },
    {
        id: "security",
        title: "Member Account, Password and Security",
        paragraphs: [
            "You are responsible for maintaining password confidentiality and all activity under your account.",
            "You agree to notify Dreamerz immediately of any unauthorized access or security breach.",
            "Dreamerz is not liable for losses resulting from your failure to meet these obligations.",
        ],
    },
    {
        id: "account-deletion",
        title: "Account Deletion",
        paragraphs: [
            "You may delete your account at any time.",
            "Dreamerz may disable accounts, cancel subscriptions, or remove descriptions, comments, or benefits at our discretion.",
            "These terms continue to apply even after account closure.",
        ],
    },
    {
        id: "third-party-apps",
        title: "Your Third-Party Apps",
        paragraphs: [
            "You may connect third-party services to Dreamerz. These integrations are governed by each third-party provider's policies.",
        ],
        bullets: [
            "Facebook Terms of Service and Privacy Policy",
            "Instagram Terms of Service and Privacy Policy",
        ],
    },
    {
        id: "creations",
        title: "Dreamerz's Creations",
        paragraphs: [
            "You may use our copyrights and trademarks to promote your Dreamerz page, but not for any other purpose without written permission.",
            "Our text, logo, and codebase are protected by copyright, trademark, and trade secret laws.",
            "You may not reproduce, distribute, perform, display, or create derivative works from our creations without permission.",
        ],
    },
    {
        id: "indemnity",
        title: "Indemnity",
        paragraphs: [
            "If a claim arises from your use of Dreamerz or your conduct, you agree to indemnify Dreamerz for losses and liabilities, including legal fees.",
            "We may take exclusive control of defense for covered claims, and you agree to cooperate.",
            "This obligation extends to our subsidiaries, affiliates, officers, directors, employees, agents, and third-party service providers.",
        ],
    },
    {
        id: "warranty-disclaimer",
        title: "Warranty Disclaimer",
        paragraphs: [
            "Dreamerz is provided \"as is\" without warranties of any kind, including merchantability, fitness for a particular purpose, and non-infringement, to the maximum extent permitted by law.",
            "This disclaimer applies to subsidiaries, affiliates, and third-party providers.",
        ],
    },
    {
        id: "limit-liability",
        title: "Limit of Liability",
        paragraphs: [
            "If you lose money due to use of Dreamerz, our liability is limited to the amount we earned from your use of Dreamerz.",
            "To the extent permitted by law, we are not liable for incidental, consequential, or punitive damages.",
            "We are specifically not liable for losses related to unfulfilled benefits or conflicting contractual agreements.",
        ],
    },
    {
        id: "dispute-resolution",
        title: "Dispute Resolution",
        paragraphs: [
            "Please contact us first if you have an issue.",
            "Disputes related to these terms or your use of Dreamerz are governed by Delaware law and resolved in federal or state courts in Lewes, Delaware.",
            "Both parties consent to exclusive jurisdiction and venue in Lewes courts.",
        ],
    },
    {
        id: "everything-else",
        title: "Everything Else",
        paragraphs: [
            "These terms and referenced policies are the full agreement between you and Dreamerz Group LLC and supersede prior agreements.",
            "If any provision is unenforceable, it will be modified or severed as needed, while the remaining provisions remain effective.",
            "Failure to enforce a right is not a waiver of future enforcement.",
            "We may update these terms. If material changes adversely affect your rights, we will notify you before changes become effective.",
            "Continuing to use Dreamerz after updates means you accept the updated terms.",
        ],
    },
];

const quickLinks = [
    { label: "How it works", href: "/how-it-works" },
    { label: "About us", href: "/about-us" },
    { label: "Terms", href: "/terms-conditions" },
    { label: "Privacy", href: "/privacy-policy" },
    { label: "FAQ", href: "/faq" },
];

const socialLinks = [
    { label: "YouTube", href: "https://www.youtube.com/@dreamerz_net/featured" },
    { label: "Facebook", href: "https://m.facebook.com/dreamerz.net" },
    {
        label: "Instagram",
        href: "https://www.instagram.com/dreamerz_net/?igshid=YmMyMTA2M2Y=",
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/102331009/admin/page-posts/published/",
    },
];

const TermsConditionsPage = () => {
    return (
        <section className="bg-background">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14 mt-16">
                <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
                    <CardHeader className="space-y-4 border-b border-border/60 text-center">
                        <h1 className="font-heading text-gradient-2 text-4xl leading-none font-bold tracking-tight sm:text-5xl">
                            Terms of Use
                        </h1>
                        <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
                            Effective immediately for users on Dreamerz from July 20, 2022.
                            These terms apply to all users of Dreamerz.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-8 pt-8 sm:space-y-10 sm:pt-10">
                        <div className="rounded-xl border border-border/70 bg-muted/30 p-4 sm:p-5">
                            <p className="text-sm leading-6 text-muted-foreground">
                                Dreamerz Group LLC, 16192 Coastal Highway, Lewes, Delaware. For
                                accessibility questions or concerns, contact{" "}
                                <a
                                    href="mailto:accessibility@dreamerz.net"
                                    className="font-medium text-foreground underline underline-offset-4"
                                >
                                    accessibility@dreamerz.net
                                </a>
                                .
                            </p>
                        </div>

                        {termsSections.map((section) => (
                            <article key={section.id} id={section.id} className="space-y-3">
                                <h2 className="font-heading text-2xl leading-tight font-semibold text-foreground sm:text-3xl">
                                    {section.title}
                                </h2>

                                <div className="space-y-3">
                                    {section.paragraphs.map((paragraph) => (
                                        <p key={paragraph} className="text-sm leading-7 text-foreground/90 sm:text-base">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {section.bullets ? (
                                    <ul className="space-y-2 pl-5 text-sm leading-7 text-foreground/90 sm:text-base">
                                        {section.bullets.map((bullet) => (
                                            <li key={bullet} className="list-disc">
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </article>
                        ))}

                        <article id="third-party-links" className="space-y-4">
                            <h2 className="font-heading text-2xl leading-tight font-semibold text-foreground sm:text-3xl">
                                Third-Party Access Links
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <a
                                    href="https://dreamerz.net/src/pages/Public/pages/About/TermsAndConditions#"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    Facebook Terms / Privacy / Revoke Access
                                </a>
                                <a
                                    href="https://dreamerz.net/src/pages/Public/pages/About/TermsAndConditions#"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    Instagram Terms / Privacy / Revoke Access
                                </a>
                            </div>
                        </article>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default TermsConditionsPage;