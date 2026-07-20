import { privacySections, type ContentBlock, type PrivacySection } from "@/data/mock-data/general-mock-data";

const PrivacyPage = () => {
    return (
        <section className="bg-background">
            <div className="mx-auto w-full max-w-6xl px-1 py-8 sm:px-1 sm:py-10 lg:px-1 lg:py-14 mt-4">
                <header className="space-y-4 border-b border-border/60 text-center pb-8">
                    <h1 className="text-4xl leading-none font-bold tracking-tight text-foreground sm:text-5xl">
                        Privacy Policy
                    </h1>
                </header>

                <div className="space-y-8 pt-8 sm:space-y-10 sm:pt-10">
                    {privacySections.map((section) => (
                        <article key={section.id} id={section.id} className="space-y-3">
                            <h2 className="text-2xl leading-tight font-semibold text-foreground sm:text-3xl">
                                {section.title}
                            </h2>

                            <div className="space-y-3">
                                {section.content.map((block, idx) => (
                                    block.type === "paragraph" ? (
                                        <p key={idx} className="text-sm leading-7 text-foreground/90 sm:text-base">
                                            {block.content}
                                        </p>
                                    ) : (
                                        <ul key={idx} className="space-y-2 pl-5 text-sm leading-7 text-foreground/90 sm:text-base">
                                            {block.items.map((item, itemIdx) => (
                                                <li key={itemIdx} className="list-disc">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PrivacyPage;
