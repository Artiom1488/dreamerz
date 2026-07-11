import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import latestdreamers, { type LatestDreamer } from "@/constants/latest-dreams-mock"
import DreamerCard from "./DreamerCard"

type MainCarouselProps = {
  dreams?: LatestDreamer[]
}

const MainCarousel = ({ dreams = Object.values(latestdreamers) }: MainCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        containScroll: "trimSnaps",
        dragFree: false,
        loop: dreams.length > 3,
      }}
      className="w-full px-12 sm:px-14 lg:px-0"
    >
      <CarouselContent className="items-stretch">
        {dreams.map((dreamer) => (
          <CarouselItem
            key={dreamer.name}
            className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <div className="h-full p-1.5">
              <DreamerCard dreamer={dreamer} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        size="icon-sm"
        className="left-2 top-[6%] size-8 -translate-y-1/2 border-[#d4d6dc] bg-white text-[#1d1f23] shadow-sm sm:left-3 sm:size-9 lg:-left-12"
      />
      <CarouselNext
        size="icon-sm"
        className="right-2 top-[6%] size-8 -translate-y-1/2 border-[#d4d6dc] bg-white text-[#1d1f23] shadow-sm sm:right-3 sm:size-9 lg:-right-12"
      />
    </Carousel>
  )
}

export default MainCarousel