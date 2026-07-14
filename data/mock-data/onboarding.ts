export type Plan = {
  id: string;
  name: string;
  price: number;
  stars: number;
  features: string[];
  popular?: boolean;
};

export const plans: Plan[] = [
  {
    id: "dreamer",
    name: "Dreamer",
    price: 11,
    stars: 1,
    features: [
      "Fulfill 10 dreams every month",
      "Donate and collect one fulfilled dream every 3 days",
      "Gain 10x visibility with each fulfilled dream",
      "Get recognized by a community that values your contributions",
    ],
  },
  {
    id: "visionary",
    name: "Visionary",
    price: 44,
    stars: 2,
    popular: true,
    features: [
      "Fulfill 40 dreams every month",
      "Donate and collect 1 fulfilled dream daily",
      "Gain 15x visibility with each fulfilled dream",
      "Show your support level in community updates",
    ],
  },
  {
    id: "innovator",
    name: "Innovator",
    price: 88,
    stars: 3,
    features: [
      "Fulfill 80 dreams every month",
      "Donate and collect 3 fulfilled dreams daily",
      "Gain 20x visibility with each fulfilled dream",
      "Show your support level with a recognition badge",
      "Accelerate your dream",
    ],
  },
  {
    id: "luminary",
    name: "Luminary",
    price: 440,
    stars: 4,
    features: [
      "Fulfill 400 dreams every month",
      "Donate and collect 14 fulfilled dreams daily",
      "Gain 25x visibility with each fulfilled dream",
      "Show your support level with a recognition badge",
      "Earn prominent recognition in the community",
    ],
  },
];

export const customPlan = {
  id: "custom",
  name: "Dreamweaver",
  stars: 5,
  features: [
    "Increase your visibility beyond the standard tiers",
    "Get early access to new features",
    "Partner with the Dreamerz team on initiatives",
    "Promote your own campaigns to the community",
  ],
};

export const COUNTRIES = [
  { code: "MD", name: "Moldova" },
  { code: "RO", name: "Romania" },
  { code: "UA", name: "Ukraine" },
  { code: "US", name: "United States" },
];

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  MD: ["Chișinău", "Bălți", "Anenii Noi", "Orhei"],
  RO: ["Bucharest", "Cluj-Napoca", "Iași"],
  UA: ["Kyiv", "Lviv", "Odesa"],
  US: ["New York", "Los Angeles", "Chicago"],
};
