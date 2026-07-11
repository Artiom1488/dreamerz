import latestdreamers from "@/constants/latest-dreams-mock"
import { Button } from "@/components/ui/button"
import MainCarousel from "./reusable/Carousel"
import Link from 'next/link'

const LatestDreams = () => {
    const dreams = Object.values(latestdreamers)

    return(
        <section className="mt-20 bg-[#ececec] py-12 sm:mt-24 sm:py-16 lg:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-14">
                <div className="mb-8 text-center sm:mb-10 lg:mb-12">
                    <h2 className="font-sans text-2xl font-bold tracking-tight text-[#0f1115] sm:text-3xl lg:text-5xl">
                        Latest Dreams on Dreamerz
                    </h2>
                </div>
                <MainCarousel dreams={dreams} />
                <div className="mt-8 flex justify-center sm:mt-10 lg:mt-12">
                    <Button
                        asChild
                        variant="gradient_fill"
                        size="lg"
                        className="h-11 w-full max-w-[250px] rounded-md px-6 text-base font-semibold sm:h-12 sm:max-w-[270px] sm:px-8 sm:text-lg"
                    >
                        <Link href="/login" className="inline-flex w-full items-center justify-center">
                            View All Dreamers
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default LatestDreams