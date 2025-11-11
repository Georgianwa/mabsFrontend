// Product data structure for the e-commerce store

const { name } = require("ejs");

const categories = [
  {
    id: "tvs",
    name: "TVs",
    description: "Latest Smart TVs and Home Entertainment Systems",
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop'
  },
  {
    id: "audio-video",
    name: "Audio & Video",
    description: "Premium Sound Systems and Home Theater Equipment",
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop'
  },
  {
    id: "refrigerators",
    name: "Refrigerators",
    description: "Energy Efficient Refrigerators and Freezers",
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop'
  },
  {
    id: "washing-machines",
    name: "Washing Machines & Dryers",
    description: "Advanced Washing and Drying Solutions",
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop'
  },
  {
    id: "air-conditioners",
    name: "Air Conditioners",
    description: "Efficient Cooling Solutions for Your Home",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Galanz_Air_Conditioner_2.jpg/1920px-Galanz_Air_Conditioner_2.jpg"
  },
  {
    id: 'kitchen-appliances',
    name: 'Kitchen Appliances',
    description: 'Modern Kitchen Appliances for Every Need',
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop"
  },
  {
    id: "freezers",
    name: "Freezers",
    description: "Wide Range of Freezers for Home and Commercial Use",
    image: "https://images.unsplash.com/photo-1601599967100-f16100982063?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928"
  },
  {
    id: "solar-generators",
    name: "Solar & Generators",
    description: "Reliable Solar Panels and Generators for Off-Grid Power",
    image: "https://plus.unsplash.com/premium_photo-1679953696773-b8d32bf8a12a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632"
  },
  {
    id: "cookers",
    name: "Cookers",
    description: "High-Performance Cookers for Every Kitchen",
    image: "https://images.unsplash.com/photo-1723902499494-47b2b8cc32cf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1587"
  },
  {
    id: "microwaves-smallappliances",
    name: "Microwaves & Small Appliances",
    description: "Convenient Microwaves and Small Kitchen Appliances",
    image: "https://plus.unsplash.com/premium_photo-1673439305380-79947d273735?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774"
  }
];

const brands = [
  { id: 'lg', name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/1024px-LG_logo_%282014%29.svg.png' },
  { id: 'Maxi', name: 'Maxi', logo: '/images/maxiLogo.png' },
  { id: 'hisense', name: 'Hisense', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Hisense_logo_new.png' },
];

const products = [
  // TVs
  {
    id: 'tv-001',
    name: 'LG 65" 4K OLED Smart TV',
    brand: 'LG',
    category: 'tvs',
    price: 1299.99,
    description: 'Experience stunning picture quality with our premium OLED technology. Perfect for movie enthusiasts and gamers.',
    specifications: {
      'Screen Size': '65 inches',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Display Technology': 'OLED',
      'Smart Features': 'WebOS, Netflix, Prime Video, Disney+',
      'HDMI Ports': '4',
      'Refresh Rate': '120Hz',
      'HDR': 'Dolby Vision, HDR10, HLG'
    },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop'
    ],
    featured: true
  },
  {
    id: 'tv-002',
    name: 'Samsung 55" QLED 4K Smart TV',
    brand: 'Samsung',
    category: 'tvs',
    price: 899.99,
    description: 'Quantum Dot technology delivers vibrant colors and deep contrast. Built-in voice assistant for easy control.',
    specifications: {
      'Screen Size': '55 inches',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Display Technology': 'QLED',
      'Smart Features': 'Tizen OS, Bixby, Alexa Compatible',
      'HDMI Ports': '4',
      'Refresh Rate': '120Hz',
      'HDR': 'HDR10+'
    },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop'
    ],
    featured: true
  },
  {
    id: 'tv-003',
    name: 'Hisense 50" 4K Android TV',
    brand: 'Hisense',
    category: 'tvs',
    price: 549.99,
    description: 'Affordable 4K Smart TV with Android TV platform. Access thousands of apps from Google Play Store.',
    specifications: {
      'Screen Size': '50 inches',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Display Technology': 'LED',
      'Smart Features': 'Android TV, Google Assistant',
      'HDMI Ports': '3',
      'Refresh Rate': '60Hz',
      'HDR': 'HDR10'
    },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'tv-004',
    name: 'Sony 75" 4K LED Smart TV',
    brand: 'Sony',
    category: 'tvs',
    price: 1699.99,
    description: 'Large screen entertainment with Sony\'s renowned picture processing. Perfect for home theaters.',
    specifications: {
      'Screen Size': '75 inches',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Display Technology': 'LED',
      'Smart Features': 'Google TV, Voice Remote',
      'HDMI Ports': '4',
      'Refresh Rate': '120Hz',
      'HDR': 'Dolby Vision, HDR10'
    },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'tv-005',
    name: 'Samsung 43" Full HD Smart TV',
    brand: 'Samsung',
    category: 'tvs',
    price: 399.99,
    description: 'Compact smart TV perfect for bedrooms and small spaces. Crisp Full HD picture quality.',
    specifications: {
      'Screen Size': '43 inches',
      'Resolution': 'Full HD (1920 x 1080)',
      'Display Technology': 'LED',
      'Smart Features': 'Tizen OS, Screen Mirroring',
      'HDMI Ports': '2',
      'Refresh Rate': '60Hz',
      'HDR': 'HDR'
    },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'tv-006',
    name: 'LG 55" NanoCell 4K TV',
    brand: 'LG',
    category: 'tvs',
    price: 749.99,
    description: 'NanoCell technology for accurate colors from wide viewing angles. Great for sports and movies.',
    specifications: {
      'Screen Size': '55 inches',
      'Resolution': '4K Ultra HD (3840 x 2160)',
      'Display Technology': 'NanoCell',
      'Smart Features': 'WebOS, ThinQ AI',
      'HDMI Ports': '4',
      'Refresh Rate': '120Hz',
      'HDR': 'HDR10, HLG'
    },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop'
    ],
    featured: false
  },

  // Audio & Video
  {
    id: 'av-001',
    name: 'Samsung HW-Q800B Soundbar',
    brand: 'Samsung',
    category: 'audio-video',
    price: 599.99,
    description: '5.1.2 channel soundbar with Dolby Atmos. Immersive audio experience for your home theater.',
    specifications: {
      'Channels': '5.1.2',
      'Total Power': '360W',
      'Connectivity': 'HDMI eARC, Bluetooth, Wi-Fi',
      'Subwoofer': 'Wireless',
      'Dolby Atmos': 'Yes',
      'DTS:X': 'Yes'
    },
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop'
    ],
    featured: true
  },
  {
    id: 'av-002',
    name: 'Sony HT-A7000 Soundbar System',
    brand: 'Sony',
    category: 'audio-video',
    price: 1199.99,
    description: 'Premium 7.1.2ch soundbar with 360 Spatial Sound Mapping. Cinema-quality audio at home.',
    specifications: {
      'Channels': '7.1.2',
      'Total Power': '500W',
      'Connectivity': 'HDMI eARC, Bluetooth, Wi-Fi',
      'Subwoofer': 'Optional (sold separately)',
      'Dolby Atmos': 'Yes',
      'DTS:X': 'Yes'
    },
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'av-003',
    name: 'LG SN5Y 2.1 Channel Soundbar',
    brand: 'LG',
    category: 'audio-video',
    price: 229.99,
    description: 'Affordable soundbar with powerful bass. Perfect upgrade from TV speakers.',
    specifications: {
      'Channels': '2.1',
      'Total Power': '400W',
      'Connectivity': 'HDMI ARC, Bluetooth, Optical',
      'Subwoofer': 'Wireless',
      'Dolby Atmos': 'No',
      'DTS:X': 'No'
    },
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'av-004',
    name: 'Panasonic 4K Blu-ray Player',
    brand: 'Panasonic',
    category: 'audio-video',
    price: 399.99,
    description: 'Premium 4K Ultra HD Blu-ray player with HDR support. Experience movies in stunning detail.',
    specifications: {
      'Resolution': '4K Ultra HD',
      'HDR Support': 'HDR10, HDR10+, Dolby Vision',
      'Audio Output': 'Dolby Atmos, DTS:X',
      'Connectivity': 'HDMI 2.0, USB, Ethernet',
      'Streaming': 'Netflix, YouTube'
    },
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'av-005',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    category: 'audio-video',
    price: 399.99,
    description: 'Industry-leading noise cancellation. Premium comfort for all-day listening.',
    specifications: {
      'Type': 'Over-ear Wireless',
      'Noise Cancellation': 'Active (Industry Leading)',
      'Battery Life': 'Up to 30 hours',
      'Connectivity': 'Bluetooth 5.2, NFC',
      'Audio': 'Hi-Res Audio, LDAC',
      'Microphone': 'Built-in for calls'
    },
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop'
    ],
    featured: true
  },
  {
    id: 'av-006',
    name: 'LG Portable Bluetooth Speaker',
    brand: 'LG',
    category: 'audio-video',
    price: 149.99,
    description: 'Waterproof portable speaker with 20-hour battery life. Perfect for outdoor adventures.',
    specifications: {
      'Power Output': '30W',
      'Battery Life': '20 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Water Resistance': 'IPX7',
      'Features': 'LED lights, Party mode'
    },
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop'
    ],
    featured: false
  },

  // Refrigerators
  {
    id: 'ref-001',
    name: 'LG 26 Cu. Ft. French Door Refrigerator',
    brand: 'LG',
    category: 'refrigerators',
    price: 2299.99,
    description: 'Spacious French door refrigerator with InstaView door-in-door. Knock twice to see inside without opening.',
    specifications: {
      'Capacity': '26 cubic feet',
      'Type': 'French Door',
      'Features': 'InstaView, Door-in-Door, Smart ThinQ',
      'Ice Maker': 'Dual Ice Maker',
      'Water Dispenser': 'Yes',
      'Energy Star': 'Yes',
      'Finish': 'Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop'
    ],
    featured: true
  },
  {
    id: 'ref-002',
    name: 'Samsung 28 Cu. Ft. Side-by-Side Refrigerator',
    brand: 'Samsung',
    category: 'refrigerators',
    price: 1799.99,
    description: 'Large capacity side-by-side refrigerator with external water and ice dispenser.',
    specifications: {
      'Capacity': '28 cubic feet',
      'Type': 'Side-by-Side',
      'Features': 'Twin Cooling Plus, LED Lighting',
      'Ice Maker': 'Built-in',
      'Water Dispenser': 'External',
      'Energy Star': 'Yes',
      'Finish': 'Black Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop'
    ],
    featured: true
  },
  {
    id: 'ref-003',
    name: 'Whirlpool 20 Cu. Ft. Top Freezer Refrigerator',
    brand: 'Whirlpool',
    category: 'refrigerators',
    price: 899.99,
    description: 'Classic top freezer design with flexible storage options. Reliable and energy efficient.',
    specifications: {
      'Capacity': '20 cubic feet',
      'Type': 'Top Freezer',
      'Features': 'Adaptive Defrost, LED Lighting',
      'Ice Maker': 'Optional',
      'Water Dispenser': 'No',
      'Energy Star': 'Yes',
      'Finish': 'White'
    },
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'ref-004',
    name: 'Hisense 17 Cu. Ft. Bottom Freezer Refrigerator',
    brand: 'Hisense',
    category: 'refrigerators',
    price: 749.99,
    description: 'Compact and efficient bottom freezer refrigerator. Perfect for apartments and small kitchens.',
    specifications: {
      'Capacity': '17 cubic feet',
      'Type': 'Bottom Freezer',
      'Features': 'Multi-Air Flow, LED Lighting',
      'Ice Maker': 'No',
      'Water Dispenser': 'No',
      'Energy Star': 'Yes',
      'Finish': 'Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'ref-005',
    name: 'Samsung 22 Cu. Ft. Counter Depth Refrigerator',
    brand: 'Samsung',
    category: 'refrigerators',
    price: 1999.99,
    description: 'Sleek counter-depth design for a built-in look. Modern and space-efficient.',
    specifications: {
      'Capacity': '22 cubic feet',
      'Type': 'French Door, Counter Depth',
      'Features': 'FlexZone Drawer, LED Lighting',
      'Ice Maker': 'Built-in',
      'Water Dispenser': 'Internal',
      'Energy Star': 'Yes',
      'Finish': 'Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'ref-006',
    name: 'LG 24 Cu. Ft. Smart Refrigerator',
    brand: 'LG',
    category: 'refrigerators',
    price: 2599.99,
    description: 'Smart refrigerator with ThinQ app control. Monitor and control from anywhere.',
    specifications: {
      'Capacity': '24 cubic feet',
      'Type': 'French Door',
      'Features': 'Smart ThinQ, Craft Ice, InstaView',
      'Ice Maker': 'Craft Ice Maker',
      'Water Dispenser': 'Yes',
      'Energy Star': 'Yes',
      'Finish': 'Black Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=600&fit=crop'
    ],
    featured: false
  },

  // Washing Machines
  {
    id: 'wm-001',
    name: 'LG 5.0 Cu. Ft. Front Load Washer',
    brand: 'LG',
    category: 'washing-machines',
    price: 1099.99,
    description: 'High-efficiency front load washer with AI DD technology. Gentle on clothes, tough on stains.',
    specifications: {
      'Capacity': '5.0 cubic feet',
      'Type': 'Front Load',
      'Features': 'AI DD, TurboWash 360, Smart ThinQ',
      'Spin Speed': '1300 RPM',
      'Energy Star': 'Yes',
      'Finish': 'White',
      'Warranty': '2 years parts and labor'
    },
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop'
    ],
    featured: true
  },
  {
    id: 'wm-002',
    name: 'Samsung 5.2 Cu. Ft. Top Load Washer',
    brand: 'Samsung',
    category: 'washing-machines',
    price: 799.99,
    description: 'Large capacity top load washer with Active WaterJet. Pre-treat stains right on the washer.',
    specifications: {
      'Capacity': '5.2 cubic feet',
      'Type': 'Top Load',
      'Features': 'Active WaterJet, Self Clean+',
      'Spin Speed': '850 RPM',
      'Energy Star': 'Yes',
      'Finish': 'White',
      'Warranty': '1 year parts and labor'
    },
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop'
    ],
    featured: true
  },
  {
    id: 'wm-003',
    name: 'Whirlpool 4.5 Cu. Ft. Front Load Washer',
    brand: 'Whirlpool',
    category: 'washing-machines',
    price: 899.99,
    description: 'Reliable front load washer with Load & Go dispenser. Add detergent once for 20 loads.',
    specifications: {
      'Capacity': '4.5 cubic feet',
      'Type': 'Front Load',
      'Features': 'Load & Go, Steam Clean, ColorLast',
      'Spin Speed': '1200 RPM',
      'Energy Star': 'Yes',
      'Finish': 'Chrome Shadow',
      'Warranty': '1 year parts and labor'
    },
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'wm-004',
    name: 'Bosch 500 Series Front Load Washer',
    brand: 'Bosch',
    category: 'washing-machines',
    price: 1299.99,
    description: 'Premium compact washer with ActiveWater Plus. Perfect for efficiency and performance.',
    specifications: {
      'Capacity': '2.2 cubic feet',
      'Type': 'Front Load, Compact',
      'Features': 'ActiveWater Plus, SpeedPerfect, EcoSilence',
      'Spin Speed': '1400 RPM',
      'Energy Star': 'Yes',
      'Finish': 'White',
      'Warranty': '2 years parts and labor'
    },
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'wm-005',
    name: 'Samsung 4.5 Cu. Ft. Front Load Washer with Steam',
    brand: 'Samsung',
    category: 'washing-machines',
    price: 999.99,
    description: 'Front load washer with steam technology. Remove stains and sanitize clothes.',
    specifications: {
      'Capacity': '4.5 cubic feet',
      'Type': 'Front Load',
      'Features': 'Steam Wash, VRT Plus, Self Clean+',
      'Spin Speed': '1200 RPM',
      'Energy Star': 'Yes',
      'Finish': 'Brushed Black',
      'Warranty': '1 year parts and labor'
    },
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'wm-006',
    name: 'LG WashTower with Center Control',
    brand: 'LG',
    category: 'washing-machines',
    price: 2199.99,
    description: 'All-in-one washer and dryer tower. Space-saving design with premium features.',
    specifications: {
      'Capacity': '4.5 cu ft washer, 7.4 cu ft dryer',
      'Type': 'Front Load, Stacked',
      'Features': 'AI DD, TurboWash 360, Built-in Intelligence',
      'Spin Speed': '1300 RPM',
      'Energy Star': 'Yes',
      'Finish': 'Graphite Steel',
      'Warranty': '2 years parts and labor'
    },
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop'
    ],
    featured: false
  },

  // Air Conditioners
  {
    id: 'ac-001',
    name: 'LG 12,000 BTU Dual Inverter Window AC',
    brand: 'LG',
    category: 'air-conditioners',
    price: 599.99,
    description: 'Energy-efficient window AC with dual inverter technology. Cools faster, lasts longer.',
    specifications: {
      'Capacity': '12,000 BTU',
      'Type': 'Window Unit',
      'Coverage Area': 'Up to 550 sq ft',
      'Features': 'Dual Inverter, Wi-Fi, Smart ThinQ',
      'Energy Star': 'Yes',
      'Noise Level': '44 dB',
      'Installation': 'Window'
    },
    images: [
      'https://i.ytimg.com/vi/cCjGTNCuFOg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCIIUMjAfrwa_B_8Tvfrmk42uYlVg'
    ],
    featured: true
  },
  {
    id: 'ac-002',
    name: 'Samsung 18,000 BTU Split System AC',
    brand: 'Samsung',
    category: 'air-conditioners',
    price: 1499.99,
    description: 'Powerful split system AC with WindFree cooling. Comfort without cold air draft.',
    specifications: {
      'Capacity': '18,000 BTU',
      'Type': 'Split System',
      'Coverage Area': 'Up to 1000 sq ft',
      'Features': 'WindFree, Smart Things, Fast Cooling',
      'Energy Star': 'Yes',
      'Noise Level': '36 dB (indoor unit)',
      'Installation': 'Professional required'
    },
    images: [
      'https://www.conejoservices.com/wp-content/uploads/2022/08/177128-1-HVAC-unit.jpg'
    ],
    featured: true
  },
  {
    id: 'ac-003',
    name: 'Hisense 8,000 BTU Portable AC',
    brand: 'Hisense',
    category: 'air-conditioners',
    price: 399.99,
    description: 'Portable air conditioner with dehumidifier function. Easy to move room to room.',
    specifications: {
      'Capacity': '8,000 BTU',
      'Type': 'Portable',
      'Coverage Area': 'Up to 350 sq ft',
      'Features': '3-in-1 (Cool, Fan, Dehumidify), Remote Control',
      'Energy Star': 'No',
      'Noise Level': '52 dB',
      'Installation': 'Window kit included'
    },
    images: [
      'https://i.ytimg.com/vi/CFBDB1QVJ-U/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD3Ue88uKSEbsDTXdmMUOglpmyo4A'
    ],
    featured: false
  },
  {
    id: 'ac-004',
    name: 'Panasonic 24,000 BTU Mini Split AC',
    brand: 'Panasonic',
    category: 'air-conditioners',
    price: 1899.99,
    description: 'High-efficiency mini split system. Powerful cooling with whisper-quiet operation.',
    specifications: {
      'Capacity': '24,000 BTU',
      'Type': 'Mini Split (Ductless)',
      'Coverage Area': 'Up to 1200 sq ft',
      'Features': 'Inverter Technology, Heat Pump, Auto Clean',
      'Energy Star': 'Yes',
      'Noise Level': '32 dB (indoor unit)',
      'Installation': 'Professional required'
    },
    images: [
      'https://images.carriercms.com/image/upload/v1715184041/carrier/residential-hvac/diagrams/illustration-explaining-how-do-air-conditioners-work.jpg'
    ],
    featured: false
  },
  {
    id: 'ac-005',
    name: 'LG 10,000 BTU Through-Wall AC',
    brand: 'LG',
    category: 'air-conditioners',
    price: 699.99,
    description: 'Through-wall air conditioner with heating capability. Year-round comfort solution.',
    specifications: {
      'Capacity': '10,000 BTU Cooling / 11,200 BTU Heating',
      'Type': 'Through-Wall',
      'Coverage Area': 'Up to 450 sq ft',
      'Features': 'Heat Pump, Remote Control, Digital Display',
      'Energy Star': 'Yes',
      'Noise Level': '48 dB',
      'Installation': 'Wall sleeve required'
    },
    images: [
      'https://i.ytimg.com/vi/co9DCqGEfnc/sddefault.jpg'
    ],
    featured: false
  },
  {
    id: 'ac-006',
    name: 'Samsung Multi-Zone 36,000 BTU AC System',
    brand: 'Samsung',
    category: 'air-conditioners',
    price: 3499.99,
    description: 'Multi-zone AC system for whole-home comfort. Control each room independently.',
    specifications: {
      'Capacity': '36,000 BTU',
      'Type': 'Multi-Split System',
      'Coverage Area': 'Up to 1800 sq ft (4 zones)',
      'Features': 'WindFree, Smart Things, Individual Zone Control',
      'Energy Star': 'Yes',
      'Noise Level': '35 dB (indoor units)',
      'Installation': 'Professional required'
    },
    images: [
      'https://lh3.googleusercontent.com/3soorcljFa5J8_wrvjPU93eBWWVKAC9-mXdgLaDnCl9k6YQ2EtUM7aS1-ar5ERNDn5UE8YEP8Eu80Nu3PFbFIb0pZUz5RT-a6RRcWW-iat2sDZD-wooJ7e7lrPjqv9mQwS-eRhv6tJyFac1VInmv1q4'
    ],
    featured: false
  },

  // Kitchen Appliances
  {
    id: 'ka-001',
    name: 'Samsung 30" Smart Electric Range',
    brand: 'Samsung',
    category: 'kitchen-appliances',
    price: 1299.99,
    description: 'Smart electric range with air fry mode. Cook healthier meals without added oil.',
    specifications: {
      'Size': '30 inches',
      'Type': 'Electric Range',
      'Features': 'Air Fry, Wi-Fi, Smart Dial, Storage Drawer',
      'Oven Capacity': '6.3 cubic feet',
      'Cooktop': '5 Elements',
      'Self-Cleaning': 'Yes',
      'Finish': 'Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
    ],
    featured: true
  },
  {
    id: 'ka-002',
    name: 'LG 1.5 Cu. Ft. Over-the-Range Microwave',
    brand: 'LG',
    category: 'kitchen-appliances',
    price: 399.99,
    description: 'Spacious over-the-range microwave with sensor cooking. Powerful ventilation system.',
    specifications: {
      'Capacity': '1.5 cubic feet',
      'Type': 'Over-the-Range Microwave',
      'Power': '1000 Watts',
      'Features': 'Sensor Cook, LED Lighting, Extenda Vent',
      'Ventilation': '400 CFM',
      'Turntable': '12.6 inches',
      'Finish': 'Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
    ],
    featured: true
  },
  {
    id: 'ka-003',
    name: 'Bosch 800 Series Dishwasher',
    brand: 'Bosch',
    category: 'kitchen-appliances',
    price: 1199.99,
    description: 'Whisper-quiet dishwasher with 3rd rack. Advanced drying technology for spotless dishes.',
    specifications: {
      'Capacity': '16 place settings',
      'Type': 'Built-in Dishwasher',
      'Features': 'CrystalDry, FlexSpace, InfoLight',
      'Noise Level': '42 dB',
      'Wash Cycles': '6 cycles',
      'Energy Star': 'Yes',
      'Finish': 'Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'ka-004',
    name: 'Whirlpool 2.2 Cu. Ft. Countertop Microwave',
    brand: 'Whirlpool',
    category: 'kitchen-appliances',
    price: 229.99,
    description: 'Large capacity countertop microwave with sensor cooking. Simple and reliable.',
    specifications: {
      'Capacity': '2.2 cubic feet',
      'Type': 'Countertop Microwave',
      'Power': '1200 Watts',
      'Features': 'Sensor Cooking, Add 30 Seconds, Kitchen Timer',
      'Turntable': '15.6 inches',
      'Control Type': 'Keypad',
      'Finish': 'Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'ka-005',
    name: 'Samsung Family Hub Refrigerator',
    brand: 'Samsung',
    category: 'kitchen-appliances',
    price: 3999.99,
    description: 'Revolutionary smart refrigerator with built-in touchscreen. See inside from anywhere.',
    specifications: {
      'Capacity': '28 cubic feet',
      'Type': 'French Door with Family Hub',
      'Features': 'View Inside Camera, Meal Planning, Streaming',
      'Screen': '21.5" touchscreen',
      'Ice Maker': 'Dual Auto Ice Maker',
      'Energy Star': 'Yes',
      'Finish': 'Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
    ],
    featured: false
  },
  {
    id: 'ka-006',
    name: 'LG InstaView Slide-In Range',
    brand: 'LG',
    category: 'kitchen-appliances',
    price: 2599.99,
    description: 'Premium slide-in range with InstaView window. See inside without opening the door.',
    specifications: {
      'Size': '30 inches',
      'Type': 'Electric Slide-In Range',
      'Features': 'InstaView, Air Fry, ProBake, ThinQ',
      'Oven Capacity': '6.3 cubic feet',
      'Cooktop': '5 Elements (Radiant)',
      'Self-Cleaning': 'Yes',
      'Finish': 'Stainless Steel'
    },
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop'
    ],
    featured: false
  }
];

module.exports = {
  categories,
  brands,
  products
};
