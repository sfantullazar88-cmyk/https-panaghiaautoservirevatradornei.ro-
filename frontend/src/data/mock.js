// Mock data for Panaghia Autoservire Vatra Dornei

export const restaurantInfo = {
  name: "Panaghia",
  tagline: "Autoservire Vatra Dornei",
  phone: "0746 254 162",
  address: "Str. Dornelor nr. 10, Vatra Dornei",
  email: "contact@panaghia.ro",
  rating: 5,
  reviewCount: 9,
  schedule: {
    weekdays: "11:00 - 17:00",
    weekend: "Închis"
  },
  heroTitle: "Mancare gatita zilnic,",
  heroTitle2: "gustoasa si satioasa",
  heroSubtitle: "Autoservire & delivery rapid in Vatra Dornei",
  heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80"
};

export const menuCategories = [
  { id: "ciorbe", name: "Ciorbe", icon: "soup" },
  { id: "feluri-principale", name: "Feluri Principale", icon: "main" },
  { id: "garnituri", name: "Garnituri", icon: "side" },
  { id: "salate", name: "Salate", icon: "salad" },
  { id: "deserturi", name: "Deserturi", icon: "dessert" },
  { id: "bauturi", name: "Băuturi", icon: "drink" }
];

export const menuItems = [
  // Ciorbe
  {
    id: 1,
    category: "ciorbe",
    name: "Ciorbă de burtă",
    description: "Ciorbă tradițională românească cu smântână și ardei iute",
    price: 18,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
    isPopular: true
  },
  {
    id: 2,
    category: "ciorbe",
    name: "Ciorbă de perișoare",
    description: "Ciorbă cu perișoare de carne de porc și legume proaspete",
    price: 15,
    image: "https://images.unsplash.com/photo-1552590635-27c2c2128abf?w=400&q=80",
    isPopular: false
  },
  {
    id: 3,
    category: "ciorbe",
    name: "Ciorbă de fasole",
    description: "Ciorbă de fasole cu afumătură și smântână",
    price: 14,
    image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&q=80",
    isPopular: false
  },
  {
    id: 4,
    category: "ciorbe",
    name: "Supă cremă de legume",
    description: "Supă cremă de legume de sezon cu crutoane",
    price: 12,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
    isPopular: false
  },
  // Feluri Principale
  {
    id: 5,
    category: "feluri-principale",
    name: "Sarmale în foi de viță",
    description: "Sarmale tradiționale cu carne tocată, orez și smântână",
    price: 28,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
    isPopular: true
  },
  {
    id: 6,
    category: "feluri-principale",
    name: "Mici cu muștar",
    description: "Porție de 5 mici la grătar cu muștar și pâine",
    price: 22,
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80",
    isPopular: true
  },
  {
    id: 7,
    category: "feluri-principale",
    name: "Șnițel de pui",
    description: "Șnițel de pui pane cu garnitură la alegere",
    price: 25,
    image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80",
    isPopular: false
  },
  {
    id: 8,
    category: "feluri-principale",
    name: "Tochitura moldovenească",
    description: "Tocăniță de porc cu mămăliguță și ou",
    price: 32,
    image: "https://images.unsplash.com/photo-1613653739328-e86ebd77c9c8?w=400&q=80",
    isPopular: true
  },
  {
    id: 9,
    category: "feluri-principale",
    name: "Pulpă de pui la cuptor",
    description: "Pulpă de pui marinată la cuptor cu legume",
    price: 24,
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&q=80",
    isPopular: false
  },
  // Garnituri
  {
    id: 10,
    category: "garnituri",
    name: "Cartofi prăjiți",
    description: "Porție de cartofi prăjiți aurii",
    price: 8,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
    isPopular: false
  },
  {
    id: 11,
    category: "garnituri",
    name: "Mămăliguță",
    description: "Mămăliguță tradițională cu unt",
    price: 6,
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80",
    isPopular: false
  },
  {
    id: 12,
    category: "garnituri",
    name: "Piure de cartofi",
    description: "Piure cremos cu unt și lapte",
    price: 7,
    image: "https://images.unsplash.com/photo-1623689046286-01d812215a5c?w=400&q=80",
    isPopular: false
  },
  // Salate
  {
    id: 13,
    category: "salate",
    name: "Salată de varză",
    description: "Salată de varză proaspătă cu morcov și mărar",
    price: 8,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    isPopular: false
  },
  {
    id: 14,
    category: "salate",
    name: "Salată de roșii",
    description: "Roșii proaspete cu ceapă și ulei de măsline",
    price: 10,
    image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&q=80",
    isPopular: false
  },
  {
    id: 15,
    category: "salate",
    name: "Salată mixtă",
    description: "Mix de salată verde, roșii, castraveți și ardei",
    price: 12,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    isPopular: false
  },
  // Deserturi
  {
    id: 16,
    category: "deserturi",
    name: "Papanași cu smântână",
    description: "Papanași tradiționali cu smântână și dulceață",
    price: 18,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
    isPopular: true
  },
  {
    id: 17,
    category: "deserturi",
    name: "Clătite cu Nutella",
    description: "Clătite pufoase cu Nutella și banane",
    price: 15,
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80",
    isPopular: false
  },
  {
    id: 18,
    category: "deserturi",
    name: "Cozonac de casă",
    description: "Felie de cozonac tradițional cu nucă",
    price: 10,
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&q=80",
    isPopular: false
  },
  // Băuturi
  {
    id: 19,
    category: "bauturi",
    name: "Limonadă de casă",
    description: "Limonadă proaspătă cu mentă și ghiață",
    price: 8,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80",
    isPopular: false
  },
  {
    id: 20,
    category: "bauturi",
    name: "Compot de casă",
    description: "Compot de fructe de sezon",
    price: 6,
    image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80",
    isPopular: false
  },
  {
    id: 21,
    category: "bauturi",
    name: "Apă plată/minerală",
    description: "Sticlă 500ml",
    price: 5,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80",
    isPopular: false
  }
];

export const teamMembers = [
  {
    id: 1,
    name: "Maria Popescu",
    role: "Bucătar Șef",
    description: "Cu peste 15 ani de experiență în bucătăria tradițională românească",
    image: "https://images.unsplash.com/photo-1583394293214-28ez082cad35?w=400&q=80"
  },
  {
    id: 2,
    name: "Ion Gheorghiu",
    role: "Bucătar",
    description: "Specialist în ciorbe și preparate la grătar",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80"
  },
  {
    id: 3,
    name: "Ana Ionescu",
    role: "Ospătar",
    description: "Mereu cu zâmbetul pe buze, vă așteaptă să vă servească",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80"
  }
];

export const reviews = [
  {
    id: 1,
    name: "Alexandru M.",
    rating: 5,
    text: "Mâncare delicioasă, ca la mama acasă! Recomand cu căldură!",
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Elena D.",
    rating: 5,
    text: "Cel mai bun loc pentru mâncare tradițională în Vatra Dornei.",
    date: "2024-01-10"
  },
  {
    id: 3,
    name: "Mihai P.",
    rating: 5,
    text: "Ciorba de burtă este fenomenală! Voi reveni cu siguranță.",
    date: "2024-01-05"
  }
];

export const dailyMenu = [
  { day: "Luni", soup: "Ciorbă de perișoare", main: "Șnițel cu piure" },
  { day: "Marți", soup: "Ciorbă de burtă", main: "Sarmale cu mămăliguță" },
  { day: "Miercuri", soup: "Supă de pui", main: "Pulpă de pui la cuptor" },
  { day: "Joi", soup: "Ciorbă de fasole", main: "Mici cu cartofi prăjiți" },
  { day: "Vineri", soup: "Ciorbă de legume", main: "Tochitura moldovenească" }
];