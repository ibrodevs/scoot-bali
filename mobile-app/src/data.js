export const SCOOTERS = [
  {
    id: 1,
    name: "Honda PCX 160",
    type: "scooter",
    engine: "160cc",
    priceUSD: 5.5,
    rating: 4.9,
    reviews: 124,
    available: true,
    accent: "#0D1117",
    features: ["ABS", "LED Lights", "USB Charging", "Smart Key"],
    specs: {
      "Top Speed": "115 km/h",
      "Fuel Cons.": "2.1L/100km",
      Weight: "131 kg",
      "Seat Height": "764 mm",
    },
    description:
      "The Honda PCX 160 is the definitive premium scooter for Bali. Sophisticated style, outstanding efficiency, and confidence-inspiring ABS braking make it the top choice for discerning riders exploring the island.",
  },
  {
    id: 2,
    name: "Yamaha NMAX 155",
    type: "maxi",
    engine: "155cc",
    priceUSD: 6.2,
    rating: 4.8,
    reviews: 98,
    available: true,
    accent: "#0A1628",
    features: ["ABS", "Smart Key", "LED", "Large Storage"],
    specs: {
      "Top Speed": "120 km/h",
      "Fuel Cons.": "2.0L/100km",
      Weight: "134 kg",
      "Seat Height": "765 mm",
    },
    description:
      "Premium maxi-scooter with superior touring comfort. Ample underseat storage, refined suspension, and an upright riding posture make the NMAX ideal for longer Bali journeys.",
  },
  {
    id: 3,
    name: "Honda ADV 150",
    type: "maxi",
    engine: "150cc",
    priceUSD: 7.1,
    rating: 4.9,
    reviews: 67,
    available: true,
    accent: "#141414",
    features: ["ABS", "Off-road Ready", "USB Charging", "Adventure Mode"],
    specs: {
      "Top Speed": "110 km/h",
      "Fuel Cons.": "2.3L/100km",
      Weight: "131 kg",
      "Seat Height": "800 mm",
    },
    description:
      "Built for Bali's diverse terrain. The ADV 150 tackles temple mountain roads and beach tracks with equal authority. True adventure capability in a premium package.",
  },
  {
    id: 4,
    name: "Yamaha Aerox 155",
    type: "scooter",
    engine: "155cc",
    priceUSD: 5.2,
    rating: 4.7,
    reviews: 112,
    available: true,
    accent: "#0A0E1A",
    features: ["Y-Connect", "LED", "USB", "Sporty"],
    specs: {
      "Top Speed": "120 km/h",
      "Fuel Cons.": "1.9L/100km",
      Weight: "118 kg",
      "Seat Height": "795 mm",
    },
    description:
      "Sporty and agile, the Aerox 155 is engineered for those who refuse to compromise on excitement. Sharp handling and a punchy engine make every Bali street an adventure.",
  },
];

export const LANGUAGES = [
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "ZH", label: "中文", flag: "🇨🇳" },
  { code: "ID", label: "Indonesia", flag: "🇮🇩" },
  { code: "DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "FR", label: "Français", flag: "🇫🇷" },
];

export const USER = {
  name: "Alex K.",
  email: "alex@example.com",
  initials: "AK",
  membership: "VIP",
};

export const EXISTING_BOOKINGS = [
  { id: "SB-28491", scooterId: 1, dates: "Nov 12–15", status: "active", total: 16.5 },
  { id: "SB-21034", scooterId: 2, dates: "Oct 5–8", status: "completed", total: 18.6 },
  { id: "SB-19208", scooterId: 4, dates: "Sep 20–22", status: "completed", total: 10.4 },
];

export function getScooterById(id) {
  return SCOOTERS.find((item) => item.id === id) ?? SCOOTERS[0];
}

export function getBookingDuration(range) {
  return Math.max(1, range.end - range.start);
}

export function getSelectedRentalDays(range) {
  return Array.from({ length: getBookingDuration(range) }, (_, index) => range.start + index);
}

export function formatUsd(value) {
  return `$${value.toFixed(1)}`;
}

export function buildBookingSummary(scooter, range) {
  const duration = getBookingDuration(range);
  const rentalCost = scooter.priceUSD * duration;
  const insurance = 4.8;
  const total = rentalCost + insurance;

  return {
    duration,
    rentalCost,
    insurance,
    total,
  };
}

export function formatBookingDate(day) {
  return `Nov ${day}`;
}
