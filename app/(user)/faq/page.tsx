import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqItems } from "@/data/mock-data/general-mock-data";

const FAQPage = () => {
    return (
        <section className="bg-background">
            <div className="mx-auto w-full max-w-6xl px-1 py-8 sm:px-1 sm:py-10 lg:px-1 lg:py-14 mt-4">
                <header className="space-y-4 border-b border-border/60 text-center pb-8">
                    <h1 className="text-4xl leading-none font-bold tracking-tight text-foreground sm:text-5xl">
                        FAQ
                    </h1>
                </header>

                <div className="space-y-8 pt-8 sm:space-y-10 sm:pt-10">
                    <Accordion type="single" collapsible className="w-full">
                        {faqItems.map((item) => (
                            <AccordionItem key={item.id} value={item.id}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
};

export default FAQPage;
