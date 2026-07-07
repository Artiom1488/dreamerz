import DreamMarquee from "../ui/marquee";
import { HelpArrow } from "@/constants/social-icons";

const HelpSection = () => {
    return (
        <section className="relative bg-gradient-to-b from-[#f6f6f8] to-[#f0f0f3] py-10 sm:py-14 lg:py-16">
            {/* Soft seam so the section doesn't cut in abruptly under the hero */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/[0.04] to-transparent" />

            {/* Ambient glow behind the sparkle, echoing its own gradient stops */}
            <div
                className="pointer-events-none absolute -right-16 -top-32 h-[280px] w-[280px] rounded-full opacity-50 blur-[70px] sm:-top-40 sm:h-[360px] sm:w-[360px] lg:-top-48 lg:h-[420px] lg:w-[420px]"
                style={{
                    background: "radial-gradient(circle, #f8ed84 0%, #f5e0ff 45%, #84fad5 100%)",
                }}
            />
            <HelpArrow className="pointer-events-none absolute right-4 -top-14 h-[420px] w-auto drop-shadow-sm sm:right-8 sm:-top-20 sm:h-[560px] lg:right-12 lg:-top-28 lg:h-[760px]" />

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 text-center sm:gap-4 sm:px-8">
                    <h2 className="font-sans text-4xl font-bold tracking-tight text-[#161616] sm:text-5xl">
                        Help Others — Help Yourself
                    </h2>
                    <p className="font-sans text-lg leading-relaxed text-[#6a6f79] sm:text-xl lg:text-2xl">
                        Inspire others by making the first step towards your dreams.
                    </p>
                    <p className="font-sans text-lg leading-relaxed text-[#6a6f79] sm:text-xl lg:text-2xl">
                        Help others and see the whole world move forward, one dream at a time.
                    </p>
                </div>

                {/* Fade the marquee edges into the background instead of a hard cutoff */}
                <div
                    className="relative"
                    style={{
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                        maskImage:
                            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                    }}
                >
                    <DreamMarquee />
                </div>
            </div>
        </section>
    )
}

export default HelpSection;