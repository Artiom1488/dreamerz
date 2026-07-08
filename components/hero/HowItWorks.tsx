
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
    "Create and share your dream",
    "Start donating with only $1 to other dreamers to get exposure and inspire support",
    "Gain visibility in a global community with each donation you make",
    "Attract donors to your own dream through your increased exposure and achieve your dreams faster and for less personal cost",
    "Withdraw funds and turn your dream into reality!",
];

const HowItWorks = () => {
    return (
        <section className="relative mt-28 overflow-x-clip py-12 sm:py-16 lg:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20 xl:gap-24">
                    <div className="lg:-translate-x-10 xl:-translate-x-14">
                        <h2 className="font-sans text-3xl font-bold tracking-tight text-[#0d0d12] sm:text-4xl">
                            How Dreamerz works:
                        </h2>

                        <ol className="relative mt-8 space-y-7 [--node-center-offset:18px] before:pointer-events-none before:absolute before:bottom-[var(--node-center-offset)] before:left-3.5 before:top-[var(--node-center-offset)] before:w-px before:bg-[#ebcd70] sm:mt-10 sm:space-y-8">

                            {steps.map((step, index) => (
                                <li key={step} className="relative flex items-start gap-4">
                                    <div className="relative z-10 mt-0.5 shrink-0 rounded-full bg-[conic-gradient(from_180deg,_#9ff3ea_0deg,_#9ff3ea_180deg,_#f3d36c_180deg,_#f3d36c_360deg)] p-[1.5px]">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f2f2f4] text-xs font-medium text-[#676767]">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <p className="max-w-3xl text-[1.4rem] leading-7 text-[#121317] sm:text-[1.55rem] sm:leading-8">
                                        {step}
                                    </p>
                                </li>
                            ))}
                        </ol>

                        <Button
                            asChild
                            variant="gradient_fill"
                            className="mt-8 h-11 rounded-[10px] px-6 text-base font-semibold sm:mt-10 sm:h-12 sm:px-8"
                        >
                            <Link href="/login">Get my dream fulfilled</Link>
                        </Button>
                    </div>

                    <div className="h-fit rounded-[14px] bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] p-[2.5px] shadow-[0_10px_28px_rgba(0,0,0,0.10)] lg:self-center lg:translate-x-10 xl:translate-x-14">
                        <aside className="relative overflow-hidden rounded-[12px] bg-[#f6f7f8] p-6 text-[#111217]">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_10%,rgba(132,250,213,0.22),transparent_42%),radial-gradient(circle_at_50%_0%,rgba(235,191,255,0.22),transparent_38%),radial-gradient(circle_at_100%_10%,rgba(246,236,133,0.24),transparent_42%)]" />
                            <h3 className="relative font-sans text-lg font-bold leading-tight sm:text-xl">
                                How you will receive your dream fulfilled:
                            </h3>
                            <p className="relative mt-4 text-base leading-7 text-[#20232d] sm:text-[1.05rem] sm:leading-7">
                                Everyone has to donate in order to fulfill their dreams. For every $1 you
                                donate, it creates a 10x higher visibility worldwide, which helps you
                                attract more donors to your dream, allowing you to achieve your goal while
                                only contributing half the total cost yourself. The more you give, the more
                                likely you are to receive!
                            </p>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;