import { Button } from "../ui/button";
import Image from "next/image"

const MainHero = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <Image src="/hero-background.webp" alt="" fill className="object-cover" />
            <div className="absolute inset-0 z-10 flex items-center pt-16">
                <div className="w-full max-w-7xl mx-auto px-16 flex items-center justify-between gap-16">

                    {/* Left: Text content */}
                    <div className="flex flex-col gap-8 max-w-xl">
                        <div className="flex flex-col gap-5">
                            <span className="font-heading text-2xl text-gradient-2">The Social Network For Dreams</span>
                            <h1 className="font-bold text-5xl text-white leading-tight">Welcome to Dreamerz — The Place Where Dreams Come True</h1>
                            <p className="font-sans text-lg text-white/80">Realize your dreams by supporting others. Donate $1 to dreams you love and gain 10x visibility for yours, worldwide. Attract more donors and achieve your dreams faster — together!</p>
                        </div>
                        <Button className="flex w-fit items-center gap-2.5 rounded-[10px] border px-[30px] py-6 text-base" variant="gradient_fill">Start My Journey</Button>
                    </div>

                    {/* Right: Decorative dream card mockup */}
                    <div className="relative flex-shrink-0 w-[420px] h-[460px]">
                        
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MainHero;