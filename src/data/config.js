// =======================================================
// YOUR CAFÉ
// THE ART OF EVERYDAY COFFEE
//
// FILE: src/data/config.js
//
// CENTRALIZED BRAND, MENU, TABLES, INVENTORY,
// CUSTOMIZATION, MEMBERSHIP & BUSINESS DATA
//
// Website Concept Made by:
// Web Developer Devin Planas
//
// All business data and prices are illustrative.
// Frontend-only demonstration.
// =======================================================


// =======================================================
// 01. BRAND IDENTITY
// =======================================================

export const BRAND = {
  name: "YOUR CAFÉ",
  shortName: "YC",
  subtitle: "THE ART OF EVERYDAY COFFEE",

  tagline: "Where every cup becomes a moment.",

  heroTitle: "CRAFTED WITH CARE.",
  heroAccent: "SERVED WITH SOUL.",

  description:
    "Exceptional coffee, thoughtfully prepared moments, and a beautiful place to slow down.",

  country: "Philippines",
  timezone: "Asia/Manila",
  currency: "PHP",

  address: "Your café address here",
  phone: "09XX XXX XXXX",
  email: "Add your business email",

  facebook: "",
  instagram: "",
  tiktok: "",

  openingHours: "To be confirmed",

  developer: "Web Developer Devin Planas",

  watermark:
    "Website Concept Made by: Web Developer Devin Planas",

  isPrototype: true,
};


// =======================================================
// 02. LUXURY CAFÉ COLOR PALETTE
// =======================================================

export const THEME = {
  espresso: "#241813",
  mocha: "#6B4532",
  roasted: "#3A2922",
  caramel: "#B58B5A",
  cream: "#F1E6D5",
  ivory: "#FAF5EC",
  sage: "#56634B",
  terracotta: "#C7795C",
  charcoal: "#302824",

  success: "#66816A",
  warning: "#C69A56",
  danger: "#B96254",
  muted: "#91877B",

  displayFont: "Cormorant Garamond",
  bodyFont: "DM Sans",
};


// =======================================================
// 03. CAFÉ PHOTOGRAPHY
//
// Illustrative photo sources.
// Replace with actual client-owned café photos before
// production. Verify that each photo matches its label.
// =======================================================

const photo = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const PHOTOS = {
  hero: photo("photo-1442512595331-e89e73853f31", 1920),

  interior: photo("photo-1554118811-1e0d58224f24", 1600),

  cafeInterior: photo("photo-1493857671505-72967e2e2760", 1600),

  coffee: photo("photo-1509042239860-f550ce710b93"),

  latte: photo("photo-1461023058943-07fcbe16d735"),

  espresso: photo("photo-1511920170033-f8396924c348"),

  coffeeCraft: photo("photo-1495474472287-4d71bcdd2085"),

  beans: photo("photo-1559056199-641a0ac8b55e"),

  croissant: photo("photo-1555507036-ab1f4038808a"),

  cake: photo("photo-1578985545062-69928b1d9587"),

  sandwich: photo("photo-1528735602780-2552fd46c7af"),

  pasta: photo("photo-1473093295043-cdd812d0e601"),
};


// =======================================================
// 04. BUSINESS POLICIES
// =======================================================

export const POLICIES = {
  reservationDurationMinutes: 90,

  earliestCheckInMinutes: 15,

  minimumReservationNoticeMinutes: 30,

  maximumAdvanceBookingDays: 30,

  maximumPartySize: 12,

  tableTimeBasedCharges: false,

  loyaltySpendPerPoint: 20,

  allowPickupOrders: true,

  allowDineInOrders: true,

  requireRealPayment: false,

  allowUnpaidDemoOrders: true,
};


// =======================================================
// 05. CAFÉ SEATING ZONES
//
// T-001 to T-022 = Café tables
// B-001 to B-006 = Coffee bar seats
//
// Total: 28 seating units
// =======================================================

export const SEATING_ZONES = [
  {
    id: "window",
    name: "Window Seating",
    shortName: "WINDOW",

    description:
      "Sunlit corners made for quiet coffee moments.",

    prefix: "T",
    startNumber: 1,
    count: 4,

    capacity: 2,
    columns: 2,
    shape: "round",

    color: "#B58B5A",
    indoor: true,
  },

  {
    id: "main",
    name: "Main Dining",
    shortName: "DINING",

    description:
      "Warm, comfortable café tables for everyday gatherings.",

    prefix: "T",
    startNumber: 5,
    count: 8,

    capacity: 4,
    columns: 4,
    shape: "square",

    color: "#6B4532",
    indoor: true,
  },

  {
    id: "bar",
    name: "Coffee Bar",
    shortName: "COFFEE BAR",

    description:
      "Front-row seats to the art of espresso preparation.",

    prefix: "B",
    startNumber: 1,
    count: 6,

    capacity: 1,
    columns: 6,
    shape: "bar",

    color: "#C7795C",
    indoor: true,
  },

  {
    id: "lounge",
    name: "Private Lounge",
    shortName: "LOUNGE",

    description:
      "Refined seating designed for longer conversations.",

    prefix: "T",
    startNumber: 13,
    count: 4,

    capacity: 4,
    columns: 2,
    shape: "lounge",

    color: "#56634B",
    indoor: true,
  },

  {
    id: "garden",
    name: "Outdoor Garden",
    shortName: "GARDEN",

    description:
      "Fresh-air seating surrounded by a relaxing atmosphere.",

    prefix: "T",
    startNumber: 17,
    count: 6,

    capacity: 4,
    columns: 3,
    shape: "round",

    color: "#8D9A78",
    indoor: false,
  },
];


// =======================================================
// 06. GENERATE CAFÉ TABLES
// =======================================================

export function createInitialTables() {
  return SEATING_ZONES.flatMap((zone) =>
    Array.from({ length: zone.count }, (_, index) => {
      const number = zone.startNumber + index;

      return {
        id: `${zone.prefix}-${String(number).padStart(3, "0")}`,

        zoneId: zone.id,
        capacity: zone.capacity,

        shape: zone.shape,

        row: Math.floor(index / zone.columns) + 1,
        column: (index % zone.columns) + 1,

        cleaning: false,
        unavailable: false,
      };
    })
  );
}


// =======================================================
// 07. TABLE STATUS CONFIGURATION
// =======================================================

export const TABLE_STATUSES = {
  available: {
    label: "AVAILABLE",
    color: "#66816A",
  },

  occupied: {
    label: "OCCUPIED",
    color: "#B96254",
  },

  reserved: {
    label: "RESERVED",
    color: "#C69A56",
  },

  cleaning: {
    label: "CLEANING",
    color: "#91877B",
  },

  unavailable: {
    label: "UNAVAILABLE",
    color: "#55504A",
  },
};


// =======================================================
// 08. MENU CATEGORIES
// =======================================================

export const MENU_CATEGORIES = [
  { id: "all", name: "All Menu" },
  { id: "espresso", name: "Espresso & Coffee" },
  { id: "signature", name: "Signature Drinks" },
  { id: "cold-brew", name: "Cold Brew" },
  { id: "matcha", name: "Matcha & Tea" },
  { id: "non-coffee", name: "Non-Coffee" },
  { id: "pastries", name: "Pastries & Cakes" },
  { id: "savory", name: "Savory Food" },
  { id: "retail", name: "Coffee Beans & Retail" },
];


// =======================================================
// 09. SIZE OPTIONS
//
// All menu base prices refer to MEDIUM size
// where size customization is supported.
// =======================================================

export const DRINK_SIZES = [
  {
    id: "small",
    name: "Small",
    priceDelta: -15,
    recipeMultiplier: 0.8,
  },

  {
    id: "medium",
    name: "Medium",
    priceDelta: 0,
    recipeMultiplier: 1,
  },

  {
    id: "large",
    name: "Large",
    priceDelta: 25,
    recipeMultiplier: 1.3,
  },
];


// =======================================================
// 10. MILK OPTIONS
// =======================================================

export const MILK_OPTIONS = [
  {
    id: "dairy",
    name: "Regular Milk",
    priceDelta: 0,
    inventoryId: "dairy-milk",
  },

  {
    id: "oat",
    name: "Oat Milk",
    priceDelta: 35,
    inventoryId: "oat-milk",
  },

  {
    id: "almond",
    name: "Almond Milk",
    priceDelta: 35,
    inventoryId: "almond-milk",
  },

  {
    id: "soy",
    name: "Soy Milk",
    priceDelta: 30,
    inventoryId: "soy-milk",
  },
];


// =======================================================
// 11. SWEETNESS OPTIONS
// =======================================================

export const SWEETNESS_OPTIONS = [
  { id: "none", name: "No Added Sugar" },
  { id: "less", name: "Less Sweet" },
  { id: "regular", name: "Regular" },
  { id: "extra", name: "Extra Sweet" },
];


// =======================================================
// 12. DRINK EXTRAS
// =======================================================

export const DRINK_EXTRAS = [
  {
    id: "extra-shot",
    name: "Extra Espresso Shot",
    price: 35,

    recipe: [
      {
        ingredientId: "coffee-beans",
        quantity: 18,
      },
    ],
  },

  {
    id: "vanilla",
    name: "Vanilla Syrup",
    price: 25,

    recipe: [
      {
        ingredientId: "vanilla-syrup",
        quantity: 20,
      },
    ],
  },

  {
    id: "caramel",
    name: "Caramel Syrup",
    price: 25,

    recipe: [
      {
        ingredientId: "caramel-syrup",
        quantity: 20,
      },
    ],
  },

  {
    id: "hazelnut",
    name: "Hazelnut Syrup",
    price: 25,

    recipe: [
      {
        ingredientId: "hazelnut-syrup",
        quantity: 20,
      },
    ],
  },

  {
    id: "cold-foam",
    name: "Cold Foam",
    price: 35,

    recipe: [
      {
        ingredientId: "cold-foam",
        quantity: 40,
      },
    ],
  },
];


// =======================================================
// 13. CUSTOMIZATION PROFILES
//
// Each product references one profile.
// The future ordering engine will validate selections
// against the product's assigned profile.
// =======================================================

export const CUSTOMIZATION_PROFILES = {
  espressoOnly: {
    sizes: [],
    temperatures: ["hot"],
    milks: [],
    sweetness: false,
    extras: [],
  },

  blackCoffee: {
    sizes: ["small", "medium", "large"],
    temperatures: ["hot", "iced"],
    milks: [],
    sweetness: true,
    extras: ["extra-shot"],
  },

  milkCoffee: {
    sizes: ["small", "medium", "large"],
    temperatures: ["hot", "iced"],
    milks: ["dairy", "oat", "almond", "soy"],
    sweetness: true,

    extras: [
      "extra-shot",
      "vanilla",
      "caramel",
      "hazelnut",
    ],
  },

  icedCoffee: {
    sizes: ["small", "medium", "large"],
    temperatures: ["iced"],
    milks: ["dairy", "oat", "almond", "soy"],
    sweetness: true,

    extras: [
      "extra-shot",
      "vanilla",
      "caramel",
      "cold-foam",
    ],
  },

  matcha: {
    sizes: ["small", "medium", "large"],
    temperatures: ["hot", "iced"],
    milks: ["dairy", "oat", "almond", "soy"],
    sweetness: true,
    extras: ["vanilla", "cold-foam"],
  },

  chocolate: {
    sizes: ["small", "medium", "large"],
    temperatures: ["hot", "iced"],
    milks: ["dairy", "oat", "almond", "soy"],
    sweetness: true,
    extras: ["cold-foam"],
  },

  refresher: {
    sizes: ["small", "medium", "large"],
    temperatures: ["iced"],
    milks: [],
    sweetness: true,
    extras: [],
  },

  none: {
    sizes: [],
    temperatures: [],
    milks: [],
    sweetness: false,
    extras: [],
  },
};


// =======================================================
// 14. INVENTORY CONFIGURATION
//
// Quantities are sample stock levels.
//
// Units:
// g     = grams
// ml    = milliliters
// piece = individual units
// =======================================================

export const INVENTORY_ITEMS = [
  {
    id: "coffee-beans",
    name: "Espresso Coffee Beans",
    unit: "g",
    quantity: 10000,
    lowStockAt: 1000,
  },

  {
    id: "dairy-milk",
    name: "Fresh Dairy Milk",
    unit: "ml",
    quantity: 25000,
    lowStockAt: 3000,
  },

  {
    id: "oat-milk",
    name: "Oat Milk",
    unit: "ml",
    quantity: 8000,
    lowStockAt: 1000,
  },

  {
    id: "almond-milk",
    name: "Almond Milk",
    unit: "ml",
    quantity: 6000,
    lowStockAt: 1000,
  },

  {
    id: "soy-milk",
    name: "Soy Milk",
    unit: "ml",
    quantity: 6000,
    lowStockAt: 1000,
  },

  {
    id: "matcha-powder",
    name: "Matcha Powder",
    unit: "g",
    quantity: 2000,
    lowStockAt: 300,
  },

  {
    id: "chocolate-mix",
    name: "Chocolate Mix",
    unit: "g",
    quantity: 2500,
    lowStockAt: 300,
  },

  {
    id: "condensed-milk",
    name: "Condensed Milk",
    unit: "ml",
    quantity: 6000,
    lowStockAt: 1000,
  },

  {
    id: "vanilla-syrup",
    name: "Vanilla Syrup",
    unit: "ml",
    quantity: 3000,
    lowStockAt: 400,
  },

  {
    id: "caramel-syrup",
    name: "Caramel Syrup",
    unit: "ml",
    quantity: 3000,
    lowStockAt: 400,
  },

  {
    id: "hazelnut-syrup",
    name: "Hazelnut Syrup",
    unit: "ml",
    quantity: 2000,
    lowStockAt: 300,
  },

  {
    id: "cold-foam",
    name: "Cold Foam",
    unit: "ml",
    quantity: 3000,
    lowStockAt: 400,
  },

  {
    id: "strawberry-base",
    name: "Strawberry Refresher Base",
    unit: "ml",
    quantity: 4000,
    lowStockAt: 500,
  },

  {
    id: "sparkling-water",
    name: "Sparkling Water",
    unit: "ml",
    quantity: 10000,
    lowStockAt: 1500,
  },

  {
    id: "ice",
    name: "Ice",
    unit: "g",
    quantity: 20000,
    lowStockAt: 2500,
  },

  {
    id: "paper-cup",
    name: "Hot Drink Cups",
    unit: "piece",
    quantity: 250,
    lowStockAt: 30,
  },

  {
    id: "cold-cup",
    name: "Cold Drink Cups",
    unit: "piece",
    quantity: 250,
    lowStockAt: 30,
  },

  {
    id: "cup-lid",
    name: "Drink Lids",
    unit: "piece",
    quantity: 450,
    lowStockAt: 50,
  },

  {
    id: "butter-croissant",
    name: "Butter Croissant Stock",
    unit: "piece",
    quantity: 40,
    lowStockAt: 8,
  },

  {
    id: "almond-croissant",
    name: "Almond Croissant Stock",
    unit: "piece",
    quantity: 30,
    lowStockAt: 6,
  },

  {
    id: "cheesecake",
    name: "Cheesecake Slices",
    unit: "piece",
    quantity: 25,
    lowStockAt: 5,
  },

  {
    id: "sandwich",
    name: "Prepared Sandwich Stock",
    unit: "piece",
    quantity: 25,
    lowStockAt: 5,
  },

  {
    id: "pasta",
    name: "Prepared Pasta Portions",
    unit: "piece",
    quantity: 25,
    lowStockAt: 5,
  },

  {
    id: "house-blend-bag",
    name: "House Blend 250g Bags",
    unit: "piece",
    quantity: 35,
    lowStockAt: 6,
  },
];


// =======================================================
// 15. DRINK PACKAGING RULES
//
// The future engine will add these ingredients to
// drink recipes according to selected temperature.
// Ice quantity is based on medium-sized drinks.
// =======================================================

export const DRINK_PACKAGING = {
  hot: [
    { ingredientId: "paper-cup", quantity: 1 },
    { ingredientId: "cup-lid", quantity: 1 },
  ],

  iced: [
    { ingredientId: "cold-cup", quantity: 1 },
    { ingredientId: "cup-lid", quantity: 1 },
    { ingredientId: "ice", quantity: 100 },
  ],
};


// =======================================================
// 16. COFFEE & FOOD MENU
//
// price = medium-sized drink price where applicable
// recipe = base ingredients for a medium-sized item
//
// Packaging, milk substitution, size multiplier,
// temperature changes and extras will be handled by
// the future café management engine.
// =======================================================

export const MENU_ITEMS = [
  {
    id: "espresso",
    name: "Double Espresso",
    categoryId: "espresso",
    kind: "drink",

    description:
      "A rich, concentrated espresso with a deep aroma and velvety crema.",

    price: 110,
    image: PHOTOS.espresso,

    signature: false,
    featured: true,
    available: true,

    customizationProfile: "espressoOnly",

    recipe: [
      { ingredientId: "coffee-beans", quantity: 18 },
    ],
  },

  {
    id: "americano",
    name: "Café Americano",
    categoryId: "espresso",
    kind: "drink",

    description:
      "Smooth espresso lengthened with water for a beautifully balanced cup.",

    price: 125,
    image: PHOTOS.coffee,

    signature: false,
    featured: true,
    available: true,

    customizationProfile: "blackCoffee",

    recipe: [
      { ingredientId: "coffee-beans", quantity: 18 },
    ],
  },

  {
    id: "cappuccino",
    name: "Classic Cappuccino",
    categoryId: "espresso",
    kind: "drink",

    description:
      "Bold espresso, steamed milk, and a delicate layer of airy foam.",

    price: 155,
    image: PHOTOS.latte,

    signature: false,
    featured: true,
    available: true,

    customizationProfile: "milkCoffee",

    recipe: [
      { ingredientId: "coffee-beans", quantity: 18 },
      { ingredientId: "dairy-milk", quantity: 160 },
    ],
  },

  {
    id: "cafe-latte",
    name: "Velvet Café Latte",
    categoryId: "espresso",
    kind: "drink",

    description:
      "Silky steamed milk blended with our signature espresso.",

    price: 165,
    image: PHOTOS.latte,

    signature: false,
    featured: true,
    available: true,

    customizationProfile: "milkCoffee",

    recipe: [
      { ingredientId: "coffee-beans", quantity: 18 },
      { ingredientId: "dairy-milk", quantity: 200 },
    ],
  },

  {
    id: "spanish-latte",
    name: "Signature Spanish Latte",
    categoryId: "signature",
    kind: "drink",

    description:
      "Espresso combined with creamy milk and a rich touch of sweetness.",

    price: 185,
    image: PHOTOS.latte,

    signature: true,
    featured: true,
    available: true,

    customizationProfile: "icedCoffee",

    recipe: [
      { ingredientId: "coffee-beans", quantity: 18 },
      { ingredientId: "dairy-milk", quantity: 160 },
      { ingredientId: "condensed-milk", quantity: 30 },
    ],
  },

  {
    id: "caramel-macchiato",
    name: "Golden Caramel Macchiato",
    categoryId: "signature",
    kind: "drink",

    description:
      "Layered espresso and smooth milk finished with caramel.",

    price: 195,
    image: PHOTOS.coffee,

    signature: true,
    featured: true,
    available: true,

    customizationProfile: "milkCoffee",

    recipe: [
      { ingredientId: "coffee-beans", quantity: 18 },
      { ingredientId: "dairy-milk", quantity: 180 },
      { ingredientId: "caramel-syrup", quantity: 25 },
    ],
  },

  {
    id: "cold-brew",
    name: "Slow-Steeped Cold Brew",
    categoryId: "cold-brew",
    kind: "drink",

    description:
      "Slow-steeped specialty coffee with a smooth, refreshing finish.",

    price: 175,
    image: PHOTOS.coffee,

    signature: true,
    featured: false,
    available: true,

    customizationProfile: "blackCoffee",

    allowedTemperatures: ["iced"],

    recipe: [
      { ingredientId: "coffee-beans", quantity: 25 },
    ],
  },

  {
    id: "matcha-latte",
    name: "Ceremonial Matcha Latte",
    categoryId: "matcha",
    kind: "drink",

    description:
      "Vibrant matcha whisked carefully and paired with creamy milk.",

    price: 190,
    image: PHOTOS.coffeeCraft,

    signature: true,
    featured: true,
    available: true,

    customizationProfile: "matcha",

    recipe: [
      { ingredientId: "matcha-powder", quantity: 8 },
      { ingredientId: "dairy-milk", quantity: 200 },
    ],
  },

  {
    id: "chocolate",
    name: "Belgian Chocolate",
    categoryId: "non-coffee",
    kind: "drink",

    description:
      "A rich and comforting chocolate drink with a smooth finish.",

    price: 170,
    image: PHOTOS.coffee,

    signature: false,
    featured: false,
    available: true,

    customizationProfile: "chocolate",

    recipe: [
      { ingredientId: "chocolate-mix", quantity: 35 },
      { ingredientId: "dairy-milk", quantity: 200 },
    ],
  },

  {
    id: "strawberry-refresher",
    name: "Strawberry Garden Refresher",
    categoryId: "non-coffee",
    kind: "drink",

    description:
      "A bright strawberry-inspired sparkling drink made for warm afternoons.",

    price: 160,
    image: PHOTOS.coffeeCraft,

    signature: false,
    featured: false,
    available: true,

    customizationProfile: "refresher",

    recipe: [
      { ingredientId: "strawberry-base", quantity: 70 },
      { ingredientId: "sparkling-water", quantity: 180 },
    ],
  },

  {
    id: "butter-croissant",
    name: "French Butter Croissant",
    categoryId: "pastries",
    kind: "food",

    description:
      "Golden, flaky, buttery pastry with a delicate crisp exterior.",

    price: 125,
    image: PHOTOS.croissant,

    signature: false,
    featured: true,
    available: true,

    customizationProfile: "none",

    recipe: [
      { ingredientId: "butter-croissant", quantity: 1 },
    ],
  },

  {
    id: "almond-croissant",
    name: "Almond Croissant",
    categoryId: "pastries",
    kind: "food",

    description:
      "A delicate pastry finished with a rich almond-inspired filling.",

    price: 155,
    image: PHOTOS.croissant,

    signature: false,
    featured: false,
    available: true,

    customizationProfile: "none",

    recipe: [
      { ingredientId: "almond-croissant", quantity: 1 },
    ],
  },

  {
    id: "blueberry-cheesecake",
    name: "Blueberry Cheesecake",
    categoryId: "pastries",
    kind: "food",

    description:
      "Creamy cheesecake with a sweet and vibrant blueberry finish.",

    price: 175,
    image: PHOTOS.cake,

    signature: false,
    featured: true,
    available: true,

    customizationProfile: "none",

    recipe: [
      { ingredientId: "cheesecake", quantity: 1 },
    ],
  },

  {
    id: "ham-cheese-sandwich",
    name: "Ham & Cheese Sandwich",
    categoryId: "savory",
    kind: "food",

    description:
      "A comforting toasted sandwich, perfect beside your morning coffee.",

    price: 220,
    image: PHOTOS.sandwich,

    signature: false,
    featured: false,
    available: true,

    customizationProfile: "none",

    recipe: [
      { ingredientId: "sandwich", quantity: 1 },
    ],
  },

  {
    id: "pesto-pasta",
    name: "Creamy Pesto Pasta",
    categoryId: "savory",
    kind: "food",

    description:
      "A comforting pasta dish with herb-inspired flavor.",

    price: 260,
    image: PHOTOS.pasta,

    signature: false,
    featured: false,
    available: true,

    customizationProfile: "none",

    recipe: [
      { ingredientId: "pasta", quantity: 1 },
    ],
  },

  {
    id: "house-blend",
    name: "House Blend Coffee Beans",
    categoryId: "retail",
    kind: "retail",

    description:
      "A 250g bag of our illustrative signature roasted coffee blend.",

    price: 420,
    image: PHOTOS.beans,

    signature: true,
    featured: false,
    available: true,

    customizationProfile: "none",

    recipe: [
      { ingredientId: "house-blend-bag", quantity: 1 },
    ],
  },
];


// =======================================================
// 17. ORDER STATUS CONFIGURATION
// =======================================================

export const ORDER_STATUSES = {
  received: {
    label: "ORDER RECEIVED",
    color: "#B58B5A",
  },

  accepted: {
    label: "ACCEPTED",
    color: "#56634B",
  },

  preparing: {
    label: "PREPARING",
    color: "#C7795C",
  },

  ready: {
    label: "READY TO SERVE",
    color: "#66816A",
  },

  completed: {
    label: "COMPLETED",
    color: "#56634B",
  },

  cancelled: {
    label: "CANCELLED",
    color: "#B96254",
  },
};


// =======================================================
// 18. PAYMENT METHODS
// =======================================================

export const PAYMENT_METHODS = [
  {
    id: "cash",
    name: "Cash",
  },

  {
    id: "gcash",
    name: "GCash — Manual Demo",
  },

  {
    id: "card",
    name: "Card — Manual Demo",
  },
];


// =======================================================
// 19. LOYALTY MEMBERSHIP TIERS
// =======================================================

export const LOYALTY_TIERS = [
  {
    id: "daily-brew",
    name: "DAILY BREW",
    minPoints: 0,
    color: "#91877B",

    benefits: [
      "Digital Membership",
      "Collect Café Points",
      "Access Member Updates",
    ],
  },

  {
    id: "explorer",
    name: "COFFEE EXPLORER",
    minPoints: 150,
    color: "#B58B5A",

    benefits: [
      "All Daily Brew Benefits",
      "Explorer Membership Card",
      "Exclusive Offer Concepts",
    ],
  },

  {
    id: "connoisseur",
    name: "COFFEE CONNOISSEUR",
    minPoints: 400,
    color: "#56634B",

    benefits: [
      "All Explorer Benefits",
      "Premium Member Status",
      "Specialty Coffee Rewards",
    ],
  },

  {
    id: "reserve",
    name: "SIGNATURE RESERVE",
    minPoints: 900,
    color: "#C7795C",

    benefits: [
      "All Connoisseur Benefits",
      "Signature Membership Card",
      "Exclusive Café Experience Concepts",
    ],
  },
];


// =======================================================
// 20. DEMONSTRATION PROMOTIONS
// =======================================================

export const PROMOTIONS = [
  {
    id: "welcome5",
    code: "BREW5",
    name: "Welcome Coffee Offer",

    type: "percentage",
    value: 5,

    minimumSpend: 300,

    active: true,
    description: "5% off eligible orders of ₱300 or more.",
  },

  {
    id: "coffee20",
    code: "COFFEE20",
    name: "Coffee Moment",

    type: "fixed",
    value: 20,

    minimumSpend: 250,

    active: true,
    description: "₱20 off eligible orders of ₱250 or more.",
  },
];


// =======================================================
// 21. GIFT CARD DENOMINATIONS
// =======================================================

export const GIFT_CARD_AMOUNTS = [
  300,
  500,
  1000,
  1500,
  2000,
];


// =======================================================
// 22. CAFÉ EVENTS
//
// dayOffset is relative to current date.
// Future UI will convert it to a display date.
// All events are demonstration examples.
// =======================================================

export const CAFE_EVENTS = [
  {
    id: "latte-art",
    name: "The Art of Latte",

    category: "Workshop",

    description:
      "Discover the craft behind beautiful espresso-based latte art.",

    dayOffset: 14,
    startHour: 14,

    durationMinutes: 120,

    capacity: 12,
    price: 650,

    image: PHOTOS.latte,
  },

  {
    id: "coffee-tasting",
    name: "Coffee Tasting Experience",

    category: "Coffee Experience",

    description:
      "Explore flavor, aroma, and the beautiful world of specialty coffee.",

    dayOffset: 21,
    startHour: 15,

    durationMinutes: 90,

    capacity: 16,
    price: 450,

    image: PHOTOS.beans,
  },

  {
    id: "brewing-class",
    name: "Slow Morning Brewing",

    category: "Workshop",

    description:
      "Discover approachable brewing techniques and coffee preparation.",

    dayOffset: 30,
    startHour: 10,

    durationMinutes: 120,

    capacity: 10,
    price: 550,

    image: PHOTOS.coffeeCraft,
  },
];


// =======================================================
// 23. CAFÉ FAQ
// =======================================================

export const FAQS = [
  {
    question: "Can I reserve a table online?",
    answer:
      "This concept includes an interactive reservation demonstration. Actual reservations will require a connected production booking system.",
  },

  {
    question: "Can I customize my coffee?",
    answer:
      "Yes. The demonstration menu supports eligible size, temperature, milk, sweetness, and extra options.",
  },

  {
    question: "Can I place an order for pickup?",
    answer:
      "The ordering prototype includes a pickup option. No actual order is transmitted to a café.",
  },

  {
    question: "Are the displayed prices final?",
    answer:
      "No. All menu prices are illustrative and must be replaced with verified business prices.",
  },
];


// =======================================================
// 24. HELPER FUNCTIONS
// =======================================================

export function formatPeso(amount = 0) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export function getMenuItem(itemId) {
  return (
    MENU_ITEMS.find((item) => item.id === itemId) ||
    null
  );
}

export function getSeatingZone(zoneId) {
  return (
    SEATING_ZONES.find((zone) => zone.id === zoneId) ||
    null
  );
}

export function getInventoryItem(ingredientId) {
  return (
    INVENTORY_ITEMS.find(
      (item) => item.id === ingredientId
    ) || null
  );
}

export function getCustomizationProfile(profileId) {
  return (
    CUSTOMIZATION_PROFILES[profileId] ||
    CUSTOMIZATION_PROFILES.none
  );
}

export function getLoyaltyTier(points = 0) {
  const safePoints = Math.max(
    0,
    Number(points) || 0
  );

  return [...LOYALTY_TIERS]
    .reverse()
    .find(
      (tier) => safePoints >= tier.minPoints
    );
}

export function getFeaturedMenuItems() {
  return MENU_ITEMS.filter(
    (item) => item.featured && item.available
  );
}

export function getSignatureMenuItems() {
  return MENU_ITEMS.filter(
    (item) => item.signature && item.available
  );
}


// =======================================================
// END OF CONFIGURATION
// =======================================================