import DreamerCard from "../reusable/DreamerCard"
import latestdreamers from "@/constants/latest-dreams-mock"


const LatestDreams = () => {
    const dreams = Object.values(latestdreamers)

    return(
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
            <h2 className="mb-6 text-2xl font-semibold">Latest dreams on dreamerz</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dreams.map((dreamer) => (
                    <DreamerCard key={dreamer.name} dreamer={dreamer} />
                ))}
            </div>
        </div>
    )
}

export default LatestDreams