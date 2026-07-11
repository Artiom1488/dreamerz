import { Badge } from "../ui/badge"

const WhoYouAre = () => {
    return (
        <section className="py-10 pb-14 sm:py-14 sm:pb-16 lg:py-16 lg:pb-18">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-2xl font-bold tracking-tight text-[#080b13] sm:text-4xl lg:text-5xl">
                    Who Do You Want To Be?
                </h2>

                <div className="mt-6 grid items-center gap-3 sm:mt-8 sm:gap-4 lg:mt-10 lg:grid-cols-[1fr_36px_1fr] lg:items-stretch lg:gap-3">
                    <div className="mx-auto h-full w-full max-w-2xl rounded-[14px] bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] p-[2.5px] shadow-[0_10px_28px_rgba(0,0,0,0.10)]">
                        <div className="relative flex h-full min-h-[132px] flex-col items-center justify-center overflow-hidden rounded-[12px] bg-[#f6f7f8] px-4 py-4 text-center sm:min-h-[170px] sm:px-6 sm:py-7">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_10%,rgba(132,250,213,0.22),transparent_42%),radial-gradient(circle_at_50%_0%,rgba(235,191,255,0.22),transparent_38%),radial-gradient(circle_at_100%_10%,rgba(246,236,133,0.24),transparent_42%)]" />
                            <Badge variant="secondary" className="relative h-auto px-3 py-1 text-xs font-semibold text-[#0f1115] sm:text-base">
                                Dreamer
                            </Badge>
                            <p className="relative mt-4 max-w-[30ch] text-sm leading-relaxed text-[#0f1115] sm:mt-6 sm:text-base lg:text-[18px]">
                                a person who receives donations for their dream and only has to donate half as much to fulfill it.
                            </p>
                        </div>
                    </div>

                    <span className="py-0.5 text-center text-base font-medium text-[#0f1115] sm:text-lg lg:self-center lg:justify-self-center">or</span>

                    <div className="mx-auto h-full w-full max-w-2xl rounded-[14px] bg-[linear-gradient(135deg,#84FAD5_0%,#EBBFFF_50%,#F6EC85_100%)] p-[2.5px] shadow-[0_10px_28px_rgba(0,0,0,0.10)]">
                        <div className="relative flex h-full min-h-[132px] flex-col items-center justify-center overflow-hidden rounded-[12px] bg-[#f6f7f8] px-4 py-4 text-center sm:min-h-[170px] sm:px-6 sm:py-7">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_10%,rgba(132,250,213,0.22),transparent_42%),radial-gradient(circle_at_50%_0%,rgba(235,191,255,0.22),transparent_38%),radial-gradient(circle_at_100%_10%,rgba(246,236,133,0.24),transparent_42%)]" />
                            <Badge variant="dreamangel" className="relative h-auto px-3 py-1 text-xs font-semibold text-[#0f1115] sm:text-base">
                                Dream Angel
                            </Badge>
                            <p className="relative mt-4 max-w-[34ch] text-sm leading-relaxed text-[#0f1115] sm:mt-6 sm:text-base lg:text-[18px]">
                                a person who only donates, but accumulates dream points for any future dream, as well as gratitude and admiration from thousands of people.
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-10 text-center font-heading text-xl text-[#78c8d6] -rotate-5 sm:mt-12 sm:text-3xl lg:mt-14">
                    The change starts with you!
                </p>
            </div>
        </section>
    )
}

export default WhoYouAre