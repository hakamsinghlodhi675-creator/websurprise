// ============================================================
//  WEBSURPRISE — TEMPLATE DATA
//  To add a new template: copy one object block and fill it in.
// ============================================================

const TEMPLATES = [

  // ── TEMPLATE 1 — Birthday Surprise V-1 ──────────────────
  {
    id: "birthday-v1",
    name: "Birthday Surprise V-1",
    category: "birthday",
    tagline: "The kind of birthday surprise they'll cry opening 🥺",
    description: "A breathtaking personalised birthday surprise website. Photos, music, heartfelt messages — all in one magical link they will open again and again for years.",

    // Thumbnail image (place inside /images/ folder)
    thumbnail: "images/bdv1.jpg",

    // YouTube video ID — e.g. youtube.com/watch?v=ABC123 → "ABC123"
    youtubeId: "CdFZBLDIvOY",

    // Live preview demo link
    liveUrl: "https://birthdayspeciall01.netlify.app",

    // Customize page link — users click this to personalise
    customizeUrl: "https://birthdayspeciall01.netlify.app/customize",

    // Badges
    isNew: true,
    limitedOffer: true,

    // PRICING
    price: "₹99",
    originalPrice: "₹199",
    saveText: "Save ₹100",

    // Features checklist shown on product page
    features: [
      "Beautiful personalised design",
      "Add your own photos & memories",
      "Background music",
      "Heartfelt message section",
      "Smooth cinematic animations",
      "Fully mobile responsive",
      "Shareable link — works on any device",
    ],
  },

];


// ============================================================
//  CATEGORIES
// ============================================================

const CATEGORIES = [
  { key: "all",         label: "✨ All" },
  { key: "birthday",    label: "🎂 Birthday" },
  { key: "anniversary", label: "💍 Anniversary" },
  { key: "proposal",    label: "💌 Proposal" },
  { key: "love",        label: "❤️ Love & Miss You" },
  { key: "parents",     label: "💐 Mother's / Father's Day" },
  { key: "farewell",    label: "🎓 Farewell" },
];


// ============================================================
//  INSTAGRAM USERNAME
// ============================================================

const INSTAGRAM_USERNAME = "websurprise.in";


// ============================================================
//  SITE STATS — Update as your business grows!
// ============================================================

const STATS = [
  { value: "0–30 min",  label: "Code Delivery" },
  { value: "Instant",   label: "Website Goes Live" },
  { value: "100%",      label: "Self-Customisable" },
  { value: "₹99",       label: "Starting Price" },
];
