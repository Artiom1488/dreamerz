"use client";

const firstCarouselData = [
  "Community 1$ Power",
  "Self-Promotion Through Charity",
  "Straight Dream Backing",
  "Global 10x Impact",
  "Mutual Supportive Community",
  "Fulfilled Dreams Collection",
  "Charity with Recognition",
  "Joy of Helping",
  "Unified Growth",
  "Affordable Dream Achievement",
  "Impact Multiplier ",
  "Continuous Giving Cycle ",
  "Global Contribution Boost",
  "Mutual Support Network",
];

const secondCarouselData = [
  "Half-Price Dream Realization",
  "Mutual Supportive Community",
  "Self-Promotion Through Charity",
  "Sustainable Giving Cycle",
  "Fulfilled Dreams Collection",
  "Charity with Recognition",
  "Joy of Helping",
  "Unified Growth",
  "Affordable Dream Achievement",
  "Impact Multiplier ",
  "Continuous Giving Cycle ",
  "Global Contribution Boost",
  "Mutual Support Network",
  "Community 1$ Power",
];

interface MarqueeRowProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number; 
}

function MarqueeRow({ items, direction = "left", speed = 60 }: MarqueeRowProps) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div
        className="flex w-max gap-3 animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {doubled.map((text, i) => (
          <span
            key={i}
            className="flex-shrink-0 whitespace-nowrap rounded-md bg-white px-7 py-4 text-[15px] font-bold text-neutral-900"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DreamMarquee() {
  return (
    <div
      className="flex flex-col gap-3 overflow-hidden py-8"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
      }}
    >
      <MarqueeRow items={firstCarouselData} direction="left" speed={70} />
      <MarqueeRow items={secondCarouselData} direction="right" speed={70} />
    </div>
  );
}