import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import type { LatestDreamer } from "@/constants/latest-dreams-mock"

type DreamerCardProps = {
  dreamer: LatestDreamer
}

const fallbackImage = "https://avatar.vercel.sh/dreamerz"
const fallbackCover = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"

const isUsableImageSrc = (src?: string) => {
  if (!src) return false
  const value = src.trim()
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")
}

const DreamerCard = ({ dreamer }: DreamerCardProps) => {
  const profileImage = isUsableImageSrc(dreamer.image) ? dreamer.image : fallbackImage
  const coverImage = isUsableImageSrc(dreamer.bgimage) ? dreamer.bgimage : fallbackCover

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="relative">
        <img
          src={coverImage}
          alt={`${dreamer.name} cover`}
          className="aspect-video w-full rounded-t-xl object-cover"
        />
        <div className="absolute inset-0 rounded-t-xl bg-black/20" />
        <div className="absolute left-1/2 top-full z-30 -translate-x-1/2 -translate-y-1/2">
          <img
            src={profileImage}
            alt={dreamer.name}
            className="h-24 w-24 rounded-full border-3 border-white object-cover shadow-md"
          />
        </div>
      </div>
      <CardHeader className="flex flex-col items-center gap-2 pt-14 text-center">
        <CardTitle className="w-full text-center font-sans text-4xl leading-none font-semibold tracking-tight text-[#3d3d3d]">
          {dreamer.name}
        </CardTitle>
        <CardDescription className="mx-auto w-full max-w-[14.5rem] text-center text-[1.05rem] leading-6 text-[#a3a6ad]">
          {dreamer.description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Progress value={dreamer.scopevalue} className="w-full max-w-sm">
            <ProgressLabel>Scope</ProgressLabel>
            <ProgressValue />
        </Progress>
      </CardFooter>
    </Card>
  )
}

export default DreamerCard




