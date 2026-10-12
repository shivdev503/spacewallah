# SpaceWallah

Coworking and office space marketplace for Delhi, Noida and Gurugram.
Next.js 14 (App Router) + TypeScript. No UI framework: one hand-written stylesheet.

## Run it

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL and LEAD_WEBHOOK_URL
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Requires Node 18.17 or newer. Deploys to Vercel as-is.

## Routes

| URL | Page | File |
|---|---|---|
| `/` | Homepage | `app/page.tsx` |
| `/coworking` | Coworking homepage | `app/[kind]/page.tsx` |
| `/office` | Office space homepage | `app/[kind]/page.tsx` |
| `/coworking/noida` | City page with all spaces | `app/[kind]/[city]/page.tsx` |
| `/coworking/noida/sector-62` | Micro-location page | `app/[kind]/[city]/[location]/page.tsx` |
| `/coworking/noida/sector-62/kova-works-sector-62-1` | Listing page | `app/[kind]/[city]/[location]/[slug]/page.tsx` |
| `/office/...` | Same three levels for office spaces | same files |
| `/api/lead` | Receives every lead (POST) | `app/api/lead/route.ts` |
| `/sitemap.xml`, `/robots.txt` | SEO | `app/sitemap.ts`, `app/robots.ts` |

Every page is statically generated at build time (`generateStaticParams`) with its own title, description and canonical tag. Unknown URLs return the 404 page.

## Where things live

```
app/            routes, metadata, sitemap, lead API
components/
  Providers     shortlist, lead modal, WhatsApp button, mobile CTA bar, toast
  Header/Footer
  Card          listing card
  CityPage      shared layout for city and micro-location pages
  CityResults   client-side filters (budget, size, sort)
  LeadForm      quote / WhatsApp / site visit form, posts to /api/lead
  Sections      city tile, lead band, FAQ (+ FAQ schema), advisor card, breadcrumbs (+ schema)
lib/
  data.ts       cities, micro-locations, listings, helpers  ← replace sample data here
  art.ts        placeholder imagery
  site.ts       site URL helpers
```

## Before launch

1. **Real listings.** `lib/data.ts` generates sample listings. Replace `LISTINGS` with data from your database or CMS, keeping the `Listing` type. Pages, filters, sitemap and metadata follow automatically. If listings change often, switch the listing route to `export const revalidate = 3600` and fetch inside the page.
2. **Photos.** `art()` draws gradient placeholders. Add an `images: string[]` field to listings and render them with `next/image` in `Card.tsx` and the listing gallery.
3. **Leads.** Set `LEAD_WEBHOOK_URL` to your CRM, a Google Apps Script web app bound to a Sheet, or Zapier/Make. Without it, leads are only logged to the server console.
4. **WhatsApp.** The WhatsApp buttons collect the visitor’s number so your team messages them first. To open a chat directly instead, link to `https://wa.me/91XXXXXXXXXX?text=...` in `Providers.tsx`.
5. **Advisors.** Names in `ADVISORS` (`lib/data.ts`) are placeholders.
6. **Map.** `MapSvg.tsx` is a schematic. Swap for Google Maps or Mapbox once listings have coordinates.
