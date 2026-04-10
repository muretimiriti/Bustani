# Rotary Club of Northlands Bustani — Website

Official website for the **Rotary Club of Northlands Bustani**, District 9212, Kenya. Chartered 23 March 2026.

Live: [rcnbustani.co.ke](https://www.rcnbustani.co.ke)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| UI | React 19 + Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Fonts | Playfair Display · Jost (via `next/font/google`) |
| Language | TypeScript 5 |
| Image delivery | `next/image` — AVIF → WebP → JPEG, 30-day CDN cache |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home
│   ├── layout.tsx                # Root layout, fonts, SEO, JSON-LD
│   ├── contact/                  # Contact page + Formspree form
│   ├── gallery/                  # Photo gallery (34 images)
│   ├── leadership/               # Board & committee directory
│   ├── membership/               # Membership information
│   ├── news-events/              # Events calendar + club news
│   └── projects/                 # Service projects
├── components/
│   ├── Hero.tsx                  # Full-viewport parallax slideshow hero
│   ├── FadeSlideshow.tsx         # Crossfade image carousel
│   ├── GalleryImages.tsx         # Masonry-style photo grid
│   ├── PageHero.tsx              # Page-level hero banner
│   ├── Navbar.tsx                # Responsive navigation
│   ├── Footer.tsx                # Site footer
│   ├── AboutRotary.tsx           # Rotary introduction section
│   ├── AboutClub.tsx             # Club overview + member stats
│   ├── CharterStory.tsx          # Charter journey timeline
│   ├── ServiceAreas.tsx          # Rotary areas of focus
│   ├── RotaryFamily.tsx          # Family of Rotary section
│   ├── MeetingInfo.tsx           # Weekly meeting details
│   └── JoinSection.tsx           # Membership CTA
└── lib/
    └── variants.ts               # Shared Framer Motion variants

public/
├── images/                       # All site photos (served statically)
│   ├── DSC_*.jpg                 # Club event photos
│   ├── IMG_*.jpg                 # Fellowship & project photos
│   ├── pexels-*.jpg              # Hero background images
│   └── WhatsApp Image *.jpeg     # Leadership portraits
└── charter-party-2026.jpeg       # Charter celebration flyer
```

---

## Getting Started

**Requirements:** Node.js ≥ 20.9.0

```bash
# Install dependencies
npm install

# Start development server (Turbopack)
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## Image Guidelines

All images live in `public/images/` and are referenced as string paths:

```tsx
// Correct
<Image src="/images/DSC_5546.jpg" alt="..." fill sizes="..." />

// Do NOT use static imports for photos — they slow the file watcher
// import img from '@/app/images/DSC_5546.jpg'  ❌
```

**Before adding new images:**
- Resize to max 1920px wide
- Compress to JPEG quality 72–75 (use `sharp` or Squoosh)
- Drop into `public/images/`
- Next.js will serve AVIF/WebP automatically on first request and cache for 30 days

---

## Contact Form

Powered by [Formspree](https://formspree.io). To connect the form to `info@rcnbustani.co.ke`:

1. Sign in at formspree.io and create a new form for `info@rcnbustani.co.ke`
2. Copy the form ID (e.g. `xabcd123`)
3. Update [src/app/contact/ContactForm.tsx](src/app/contact/ContactForm.tsx) line 5:

```ts
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xabcd123';
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero slideshow, about, charter story, service areas, meeting info |
| `/leadership` | Board of directors and committee chairs |
| `/projects` | Completed and upcoming service projects |
| `/gallery` | Photo gallery — club events and fellowship |
| `/news-events` | Events calendar and club news |
| `/membership` | How to join |
| `/contact` | Contact form and club details |

---

## Key Events

**Charter Celebration — 11 April 2026**
- Venue: Abai Lodges & Spa, Kagio (Off Sagana–Kutus Road)
- Time: 2:00 PM · Theme: Zulu
- Charges: Rotarians KES 3,500 · Rotaractors KES 2,500 · Guests KES 3,500
- M-Pesa Till: **6912636**

**Weekly Meeting**
- Every Thursday · 7:00 PM
- Bedarin Hotel, Bypass, Nairobi

---

## SEO & Metadata

- Full Open Graph and Twitter Card metadata on every page
- JSON-LD `Organization` schema in root layout
- Sitemap at `/sitemap.xml` · Robots at `/robots.txt`
- Canonical URL: `https://www.rcnbustani.co.ke`

---

## Club Details

| | |
|---|---|
| Club | Rotary Club of Northlands Bustani |
| District | 9212 |
| Charter Date | 23 March 2026 |
| Sponsor Club | Rotary Club of Juja |
| Email | info@rcnbustani.co.ke |
| Members | 56 charter members |
