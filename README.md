# Forest Dew Udawalawa — International Creative Luxury Hotel Redesign

An international-standard, creative boutique hotel website for **Forest Dew Udawalawa** (Udawalawe, Sri Lanka). Inspired by world-renowned hospitality brands (*Aman, One&Only, Rosewood, Six Senses*), featuring editorial typography, bespoke micro-animations, a persistent Day/Night luxury theme system, authentic property photography, and zero-PHP static architecture.

---

## Key Highlights & Creative Features

### 1. International Boutique Aesthetic & Creative Motion
- **Display Typography**: Elegant *Cormorant Garamond* paired with modern, legible *Manrope* sans-serif.
- **Atmosphere Switcher**: Interactive 4-scene hero rotator on the homepage (`01 Canopy Aerial`, `02 Architecture`, `03 Suites`, `04 Freshwater Pool`) with smooth cinematic cross-fading imagery.
- **Architectural Sanctuary & Grounds Showcase**: Dedicated editorial showcase section on the homepage highlighting the aerial lake panorama and the two-storey boutique white facade with private balconies and garden terraces.
- **Creative Animations & Micro-physics**:
  - GSAP 3.12+ and ScrollTrigger integration for staggered card entrances, image clip-path reveals, and parallax scrolling.
  - Magnetic button hover physics on fine-pointer devices for buttons, scene switchers, and filter pills.
  - Smooth image hover zooms with subtle scale drift across cards.
  - Accessible native `IntersectionObserver` & CSS keyframe fallbacks for devices with reduced motion or without JavaScript libraries.
- **Interactive Room Plan Switchers**: Guests can click `R/O` (Room Only), `B/B` (Bed & Breakfast), `H/B` (Half Board), or `F/B` (Full Board) pills directly on room cards to view rates update with a tactile micro-fade transition.
- **Interactive Safari Group Switcher**: 1-click toggle between 2-Person and 4-Person group sizes with instant USD rate recalculation and WhatsApp enquiry links.
- **Luxury WhatsApp Concierge**: Persistent floating pill (`Hotel Concierge · Online · Udawalawe`) with status pulse indicator and contextual pre-composed enquiries.

### 2. Dual Luxury Theme (Dark & Light Mode)
- **Instant FOUC Prevention**: Inline `<head>` script inspects `localStorage` and OS color preferences before DOM rendering, eliminating any flash of unstyled content.
- **Persistent Storage**: Retains the user's atmospheric preference across pages under `fd_theme`.
- **Dual Aesthetic Palettes**:
  - **Day Atmosphere (Light)**: Warm sand (`#F3F0E9`), crisp white surfaces, graphite ink (`#191D1C`), and muted gold accents (`#D7AB50`).
  - **Night Safari Atmosphere (Dark)**: Deep forest obsidian (`#121514`), elevated dark surfaces (`#181C1B`), warm sand typography, and luminous gold glows.
- **Theme Toggle Button**: Prominently placed in the desktop header and mobile drawer navigation across all pages.

### 3. Strict Truthfulness & Content Integrity
- **100% Truthful Hotel Information**:
  - Official Hotel Name: **Forest Dew Udawalawa**
  - Address: **484/1 C.P. De Silva Road, Udawalawa, 70190, Sri Lanka**
  - Telephone & WhatsApp: **+94 76 638 6132**
  - Email: **forestdewudawalawa@gmail.com**
- **Exact Client Room Rates (16 Cells, LKR)**:
  - **Single Room**: R/O 6,000 | B/B 7,500 | H/B 9,000 | F/B 10,500
  - **Double Room**: R/O 10,000 | B/B 13,000 | H/B 16,000 | F/B 19,000
  - **Triple Room**: R/O 17,000 | B/B 21,500 | H/B 26,000 | F/B 30,500
  - **Family Room**: R/O 20,000 | B/B 26,000 | H/B 32,000 | F/B 38,000
- **Exact Safari Rates (6 Cells, USD)**:
  - **4-Hour Safari**: $125 (2 Guests) | $200 (4 Guests)
  - **Half-Day Safari**: $160 (2 Guests) | $230 (4 Guests)
  - **Full-Day Safari**: $180 (2 Guests) | $280 (4 Guests)
  - *Strict Currency Separation: LKR and USD are never mathematically added or converted together.*
- **Zero Fabricated Content**: No fake 5-star ratings, no fake awards, no guaranteed leopard/elephant sightings. Transparent photo credits on all property photography.

---

## 100% Static Deployment (Zero PHP — GitHub + Cloudflare Pages)

The website is engineered strictly using **HTML5, CSS3, and modern Vanilla ES6+ JavaScript**. It contains **no PHP**, no Node server requirements, and no build pipeline, making it 100% compatible with free Cloudflare Pages and GitHub hosting.

### Step-by-Step Cloudflare Pages Setup:
1. Push this folder's contents to your GitHub repository (so `index.html` is located directly at repository root).
2. Go to **Cloudflare Dashboard → Workers & Pages → Create Application → Pages → Connect to Git**.
3. Select your repository.
4. Set Build Settings:
   - **Framework Preset**: `None`
   - **Build command**: Leave blank or set `exit 0`
   - **Build output directory**: `.` (or root `/`)
   - **Production branch**: `main`
5. Click **Save and Deploy**.
6. Cloudflare automatically applies the custom security and caching rules defined in `_headers`.

---

## Multi-Page Architecture

| Page | File | Purpose |
|---|---|---|
| **Home** | `index.html` | Atmospheric hero rotator, booking bar, story, room showcase, pool immersion, safari packages, dining, mosaic gallery, location & concierge |
| **Rooms & Rates** | `rooms.html` | 4 room suites, verified photo notice, 16-cell complete rate matrix, and live room estimator |
| **Room Details** | `room-details.html` | Architectural deep-dive into guest spaces, amenities, cross-ventilation, and natural light |
| **Safari Adventures** | `safari.html` | 4-Hour, Half-Day, and Full-Day safaris with instant 2/4-guest price switcher, inclusions, and FAQ |
| **Hotel Experiences** | `experiences.html` | Freshwater swimming pool, open terrace dining, forest canopy balconies, and local experiences |
| **Photo Journal** | `gallery.html` | Category-filtered photo journal (Suites, Pool, Dining, Nature) with accessible modal lightbox |
| **Plan Your Stay** | `plan-stay.html` | Multi-step interactive stay planner with stay + safari separate estimates, date validation, and WhatsApp enquiry link |
| **About Forest Dew** | `about.html` | Official logo presentation, architectural identity, property story, and hospitality ethos |
| **Contact & Location** | `contact.html` | Direct telephone, Google Map embed, directions, and direct-to-WhatsApp enquiry form |
| **Privacy & Transparency** | `privacy.html` | Privacy disclosure, client-side data handling, and genuine photo credits |
| **Custom 404** | `404.html` | Architectural "Off the Trail" custom error page |

---

## File Structure

```text
Forest_Dew_Udawalawe_International_V4/
├── index.html                  # Homepage with 10 editorial sections
├── rooms.html                  # Accommodation & 16-cell rate matrix
├── room-details.html           # Room architectural details & amenities
├── safari.html                 # Safari expeditions with interactive group pricing
├── experiences.html            # Pool, dining & nature experiences
├── gallery.html                # Filterable photo journal with lightbox
├── plan-stay.html              # Multi-step stay & safari calculator
├── about.html                  # Hotel story & official emblem
├── contact.html                # Google map & WhatsApp contact
├── privacy.html                # Data privacy & transparent photo credits
├── 404.html                    # Custom luxury error page
├── _headers                    # Cloudflare Pages security & cache headers
├── robots.txt                  # Search engine crawl rules
├── site.webmanifest            # PWA manifest
├── assets/
│   ├── css/
│   │   ├── main.css            # Luxury design system & dual-theme tokens
│   │   ├── responsive.css      # Breakpoints (375px, 768px, 1024px, 1440px)
│   │   └── animations.css      # Motion keyframes, clip-paths, & micro-physics
│   ├── js/
│   │   ├── config.js           # Single source of truth for hotel metadata & rates
│   │   ├── main.js             # Theme controller, header, drawer & WhatsApp
│   │   ├── animations.js       # GSAP ScrollTrigger & magnetic hover physics
│   │   ├── booking.js          # Room pills switcher & live planner calculator
│   │   └── gallery.js          # Category filtering & accessible lightbox
│   └── images/                 # Genuine hotel photographs (WebP) & brand logos
```

---

## Quality Assurance & Verification
- **Dark Mode**: Fully tested across all 11 pages with zero FOUC and persistent selection in `localStorage`.
- **Responsive**: Fully tested across mobile (375px / 390px), tablet (768px), desktop (1024px), and ultra-wide (1440px+).
- **Accessibility**: Includes keyboard-navigable lightboxes, skip-to-content links, `aria-pressed` states on theme/plan toggles, semantic HTML5 tags, and reduced-motion compliance.
- **Zero PHP**: 100% client-side static execution ready for instant free hosting on Cloudflare Pages.

