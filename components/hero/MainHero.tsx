import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image"
import HeroDreamersAnimation from "./HeroDreamersAnimation";
import WhyChoose from "./WhyChoose";
import HelpSection from "./HelpSection";
import HowItWorks from "./HowItWorks";
import LatestDreams from "./LatestDreams";
import WhoYouAre from "./WhoSection";


const MainHero = () => {
    return (
        <div className="w-full">
            <section className="relative min-h-screen overflow-hidden">
                <Image src="/hero-background.webp" alt="" fill className="object-cover" />
                <div className="relative z-10 flex min-h-screen items-center py-24 sm:py-28 md:pt-16 md:pb-12">
                    <div className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-10 px-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-16 xl:max-w-[90rem]">

                        {/* Left: Text content */}
                        <div className="flex max-w-xl flex-col items-center gap-6 text-center lg:max-w-2xl lg:items-start lg:gap-8 lg:text-left">
                            <div className="flex flex-col gap-5">
                                <span className="font-heading text-xl text-gradient-2 sm:text-2xl">The Social Network For Dreams</span>
                                <h1 className="font-bold text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">Welcome to Dreamerz — The Place Where Dreams Come True</h1>
                                <p className="font-sans text-base text-white/80 sm:text-lg">Realize your dreams by supporting others. Donate $1 to dreams you love and gain 10x visibility for yours, worldwide. Attract more donors and achieve your dreams faster — together!</p>
                            </div>
                            <Button asChild className="flex w-fit items-center gap-2.5 rounded-[10px] border px-6 py-5 text-sm sm:px-[30px] sm:py-6 sm:text-base" variant="gradient_fill">
                                <Link href="/login">Start My Journey</Link>
                            </Button>
                        </div>

                        {/* Right: Dreamers animation */}
                        <div className="relative h-[280px] w-full max-w-[320px] shrink-0 sm:h-[360px] sm:max-w-[400px] md:h-[440px] md:max-w-[480px] lg:h-[560px] lg:max-w-[560px] xl:h-[620px] xl:max-w-[620px]">
                            <HeroDreamersAnimation />
                        </div>

                    </div>
                </div>
            </section>

            <WhyChoose />

            <HelpSection />

            <HowItWorks />

            <LatestDreams />

            <WhoYouAre />
        </div>
    )
}

export default MainHero;