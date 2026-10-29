/**
 * Forest Dew Udawalawa — Central Configuration & Pricing Database
 * Single source of truth for rates, safaris, contact info, and policies.
 * No hardcoded duplicate values across files.
 */

window.FOREST_DEW_CONFIG = {
  hotel: {
    name: "Forest Dew Udawalawa",
    tagline: "A Contemporary Safari Escape",
    location: "Udawalawe, Sri Lanka",
    address: "484/1 C.P. De Silva Road, Udawalawa, 70190, Sri Lanka",
    phone: "+94 76 638 6132",
    whatsappNumber: "94766386132",
    email: "info@forestdewudawalawa.com",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Forest+Dew+Udawalawa+484%2F1+C.P.+De+Silva+Road",
    googleMapsEmbed: "https://www.google.com/maps?q=Forest+Dew+Udawalawa+484%2F1+C.P.+De+Silva+Road&output=embed"
  },

  // International Currency Exchange Database (Indicative baseline rates)
  currencies: {
    USD: { code: "USD", symbol: "$", rateToLKR: 300, name: "US Dollar", prefix: "$" },
    EUR: { code: "EUR", symbol: "€", rateToLKR: 328, name: "Euro", prefix: "€" },
    GBP: { code: "GBP", symbol: "£", rateToLKR: 388, name: "British Pound", prefix: "£" },
    AUD: { code: "AUD", symbol: "A$", rateToLKR: 198, name: "Australian Dollar", prefix: "A$" },
    LKR: { code: "LKR", symbol: "Rs", rateToLKR: 1, name: "Sri Lankan Rupee", prefix: "LKR " }
  },

  // Room pricing in Sri Lankan Rupees (LKR)
  roomRates: {
    single: {
      name: "Single Room",
      subtitle: "A Considered Solo Sanctuary",
      tagline: "Intimate and serene refuge surrounded by greenery",
      rates: { ro: 6000, bb: 7500, hb: 9000, fb: 10500 },
      description: "Designed for the unhurried solo traveler seeking tranquil rest after a day exploring Udawalawe's wilderness. Features natural light, quiet garden atmosphere, and comfortable bedding.",
      image: "assets/images/guest-room-forest.webp",
      alt: "Single guest room at Forest Dew Udawalawa overlooking lush garden"
    },
    double: {
      name: "Double Room",
      subtitle: "Sanctuary for Two",
      tagline: "Restful atmosphere curated for couples and kindred spirits",
      rates: { ro: 10000, bb: 13000, hb: 16000, fb: 19000 },
      description: "A spacious room featuring comfortable bedding, airy natural ventilation, garden-facing vistas, and curated furnishings crafted for unwinding together.",
      image: "assets/images/guest-room-wide.webp",
      alt: "Spacious double bedroom with generous natural light at Forest Dew Udawalawa"
    },
    triple: {
      name: "Triple Room",
      subtitle: "Shared Wilderness Living",
      tagline: "Expansive accommodation for friends and travel companions",
      rates: { ro: 17000, bb: 21500, hb: 26000, fb: 30500 },
      description: "Ample room for three guests traveling together. Generous layout with dedicated lounge spaces, forest breezes, and room to unpack and unwind.",
      image: "assets/images/guest-room-lounge.webp",
      alt: "Spacious triple room interior with seating amenities at Forest Dew"
    },
    family: {
      name: "Family Room",
      subtitle: "The Family Gathering Space",
      tagline: "Comfortable, spacious accommodation for the whole family",
      rates: { ro: 20000, bb: 26000, hb: 32000, fb: 38000 },
      description: "Generous footprint designed to comfortably accommodate families exploring Sri Lanka's wildlife together. Peaceful surroundings and seamless pool access.",
      image: "assets/images/guest-room-forest.webp",
      alt: "Spacious family accommodation with two large beds and outdoor views at Forest Dew"
    }
  },

  // Meal plan labels and full titles
  mealPlans: {
    ro: { code: "R/O", name: "Room Only", note: "Accommodation only, no meals included" },
    bb: { code: "B/B", name: "Bed & Breakfast", note: "Includes daily morning breakfast" },
    hb: { code: "H/B", name: "Half Board", note: "Includes daily breakfast & dinner" },
    fb: { code: "F/B", name: "Full Board", note: "Includes daily breakfast, lunch & dinner" }
  },

  // Safari packages in US Dollars (USD) - exact client pricing
  safariPackages: {
    short: {
      id: "short",
      name: "4-Hour Safari",
      duration: "4 Hours",
      subtitle: "The Essential Dawn or Dusk Encounter",
      description: "A focused, exhilarating game drive through Udawalawe National Park during the most active wildlife hours.",
      prices: { 2: 125, 4: 200 },
      inclusions: [
        "Private 4x4 safari jeep with experienced driver",
        "Udawalawe National Park entrance tickets",
        "Complimentary chilled bottled water",
        "High-grade wildlife binoculars for safari viewing"
      ],
      mealsNote: "No meals included in 4-hour safari"
    },
    half: {
      id: "half",
      name: "Half-Day Safari",
      duration: "Half-Day (~6 Hours)",
      subtitle: "The Unhurried Wildlife Immersion",
      description: "Ample time to follow wildlife trails deep into the park, tracking elephant herds and birdlife at a relaxed pace.",
      prices: { 2: 160, 4: 230 },
      inclusions: [
        "Private 4x4 safari jeep with experienced driver",
        "Udawalawe National Park entrance tickets",
        "Complimentary chilled bottled water",
        "High-grade wildlife binoculars for safari viewing",
        "Fresh picnic breakfast packed by hotel kitchen"
      ],
      mealsNote: "Includes fresh breakfast"
    },
    full: {
      id: "full",
      name: "Full-Day Safari",
      duration: "Full-Day (~10-12 Hours)",
      subtitle: "The Complete Wilderness Odyssey",
      description: "From sunrise golden hour to afternoon watering-hole gatherings, experience the park's entire diurnal cycle.",
      prices: { 2: 180, 4: 280 },
      inclusions: [
        "Private 4x4 safari jeep with experienced driver",
        "Udawalawe National Park entrance tickets",
        "Complimentary chilled bottled water",
        "High-grade wildlife binoculars for safari viewing",
        "Fresh picnic breakfast packed by hotel kitchen",
        "Full picnic lunch served in designated park resting area"
      ],
      mealsNote: "Includes fresh breakfast and lunch"
    }
  },

  // Gallery items metadata
  galleryItems: [
    {
      category: "rooms",
      title: "Forest-Facing Guest Suite",
      caption: "Spacious bedroom with garden doors and forest breeze",
      src: "assets/images/guest-room-forest.webp",
      aspect: "wide"
    },
    {
      category: "pool",
      title: "Poolside Sanctuary",
      caption: "Cool freshwater swimming pool nestled in tropical surroundings",
      src: "assets/images/swimming-pool.webp",
      aspect: "tall"
    },
    {
      category: "dining",
      title: "Al Fresco Dining Area",
      caption: "Warm timber tables for morning breakfast and evening gatherings",
      src: "assets/images/restaurant-tables.webp",
      aspect: "standard"
    },
    {
      category: "spaces",
      title: "Hotel Reception & Welcome",
      caption: "Forest Dew welcome desk featuring official elephant emblem",
      src: "assets/images/hotel-reception.webp",
      aspect: "standard"
    },
    {
      category: "nature",
      title: "Nature-Facing Terrace",
      caption: "Treetop views and tranquil canopy vantage point",
      src: "assets/images/forest-balcony.webp",
      aspect: "wide"
    },
    {
      category: "rooms",
      title: "Spacious Dual-Bed Layout",
      caption: "Generous room dimensions tailored for deep rest",
      src: "assets/images/guest-room-wide.webp",
      aspect: "standard"
    },
    {
      category: "dining",
      title: "Restaurant Interior",
      caption: "Comfortable dining hall for freshly prepared Sri Lankan cuisine",
      src: "assets/images/restaurant-interior.webp",
      aspect: "standard"
    },
    {
      category: "rooms",
      title: "Guest Lounge & Seating",
      caption: "Thoughtful furniture and room amenities for guests",
      src: "assets/images/guest-room-lounge.webp",
      aspect: "standard"
    },
    {
      category: "nature",
      title: "Udawalawe Wildlife Vision",
      caption: "Conceptual artistic tribute to the elephant sanctuary of Udawalawe",
      src: "assets/images/hero-forest-elephants.webp",
      aspect: "wide"
    }
  ]
};
