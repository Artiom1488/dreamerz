import { howItWorksSections } from "@/data/mock-data/general-mock-data";

const HowItWorks = () => {
    return (
        <section className="bg-background">
            <div className="mx-auto w-full max-w-6xl px-1 py-8 sm:px-1 sm:py-10 lg:px-1 lg:py-14 mt-4">
                <header className="space-y-4 border-b border-border/60 text-center pb-8">
                    <h1 className="text-4xl leading-none font-bold tracking-tight text-foreground sm:text-5xl">
                        How it works
                    </h1>
                </header>

                <div className="space-y-12 pt-8 sm:space-y-16 sm:pt-10">
                    {howItWorksSections.map((section) => (
                        <article key={section.id} className="space-y-6">
                            <h2 className="text-3xl leading-tight font-bold text-foreground sm:text-4xl">
                                {section.title}
                            </h2>

                            <ol className="space-y-4">
                                {section.steps.map((step, idx) => (
                                    <li key={idx} className="flex gap-4 text-base leading-7 text-foreground/90 sm:text-lg">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                                            {idx + 1}
                                        </span>
                                        <span className="pt-1">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
