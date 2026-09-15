# RSK Associates — Complete SEO Implementation Guide

## Summary of Changes

This document describes the complete SEO system implemented for the RSK Associates Next.js application (Next.js 16, App Router, React 19).

---

## Files Created

| File | Purpose |
|------|---------|
| `src/lib/seo.ts` | Centralized SEO constants, helpers, and schema generators |
| `src/lib/analytics.ts` | Google Analytics 4 tracking utilities |
| `src/components/structured-data.tsx` | Reusable JSON-LD structured data component |
| `src/components/analytics-wrapper.tsx` | GA4 script loader + page view tracking |
| `app/robots.ts` | Dynamic robots.txt generation |
| `app/sitemap.ts` | Dynamic sitemap.xml generation |
| `SEO_IMPLEMENTATION.md` | This documentation |

## Files Modified

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Global metadata, OG, Twitter, JSON-LD schemas, GA4 integration |
| `src/app/not-found.tsx` | Noindex metadata for 404 page |
| `src/app/(public)/page.tsx` | Home page metadata |
| `src/app/(public)/contact/page.tsx` | Contact page metadata |
| `src/app/(public)/blog/news/page.tsx` | News listing metadata + image SEO improvements |
| `src/app/(public)/blog/news/[slug]/page.tsx` | Article metadata via generateMetadata + Article schema |
| `src/app/(public)/blog/opportunities/page.tsx` | Opportunities metadata + image SEO improvements |
| `src/app/(public)/mentorship/page.tsx` | Mentorship page metadata |
| `src/app/about/who/page.tsx` | About/Who page metadata |
| `src/app/about/team/page.tsx` | Team page metadata |
| `src/app/about/partners/page.tsx` | Partners page metadata |
| `src/app/admin/(dashboard)/layout.tsx` | Noindex for all dashboard pages |
| `src/app/admin/login/page.tsx` | Noindex for login |
| `src/app/admin/forgot-password/page.tsx` | Noindex for forgot password |
| `src/app/admin/verify-otp/page.tsx` | Noindex for verify OTP |
| `src/app/admin/reset-password/page.tsx` | Noindex for reset password |
| `src/app/admin/unauthorized/page.tsx` | Noindex for unauthorized |
| `.env.example` | Added SEO-related environment variables |

---

## Required Environment Variables

Add these to your `.env.local` or deployment environment:

```env
# ─── SEO Configuration ─────────────────────────────────────
# Production site URL (used for canonical URLs, sitemap, robots.txt)
NEXT_PUBLIC_SITE_URL=https://rskassociates.rw

# Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console verification token (optional)
GOOGLE_SITE_VERIFICATION=

# Yandex Search Console verification token (optional)
YANDEX_SITE_VERIFICATION=
```

### Variable Details

| Variable | Required | Description | Where Used |
|----------|----------|-------------|------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Production absolute URL of the site | Canonical URLs, sitemap, robots.txt, schema URLs |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Recommended | GA4 measurement ID (G-XXXXXXXXXX) | Analytics script loading |
| `GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console verification token | `<meta name="google-site-verification">` |
| `YANDEX_SITE_VERIFICATION` | Optional | Yandex Webmaster verification token | `<meta name="yandex-verification">` |

---

## Technical SEO Implementation

### Global Metadata (src/app/layout.tsx)

The root layout includes:

- **Title template**: `%s | RSK Associates` with default `RSK Associates — Professional services and consulting for your business needs.`
- **Description**: Default description for the site
- **Keywords**: RSK Associates, corporate advisory, consulting, business strategy, financial advisory, professional services
- **Authors**: RSK Associates
- **Open Graph**: Full OG with title, description, URL, siteName, locale, images
- **Twitter Cards**: summary_large_image card type
- **Robots**: index, follow with GoogleBot-specific rules
- **Verification**: Google and Yandex verification tokens
- **JSON-LD**: Organization and WebSite schemas inline in `<head>`
- **Viewport**: Proper viewport with theme color
- **Favicon**: /favicon.svg

### Canonical URLs

All pages use `getCanonicalUrl(path)` which:
- Strips query parameters and hash fragments
- Prepends the site URL
- Ensures consistent URL structure

### Open Graph

Every page includes:
- `title`: Page-specific title
- `description`: Page-specific description
- `url`: Canonical URL
- `siteName`: RSK Associates
- `locale`: en_US
- `type`: website, article, etc.
- `images`: Primary image with width, height, alt text

### Twitter Cards

Every page includes:
- `card`: summary_large_image
- `title`: Page title
- `description`: Page description
- `images`: Primary image URL
- `creator`: @RSKAssociates
- `site`: @RSKAssociates

---

## Page-Specific Metadata

| Page | Title | Description |
|------|-------|-------------|
| `/` | Home | RSK Associates provides professional corporate advisory, consulting, and strategic services |
| `/contact` | Contact Us | Get in touch with RSK Associates for professional services, consulting, and business advisory |
| `/blog/news` | News & Updates | Latest news, insights, and updates from RSK Associates |
| `/blog/news/[slug]` | Article Title (dynamic) | Article excerpt (dynamic via generateMetadata) |
| `/blog/opportunities` | Opportunities | Find jobs, internships, tenders, and training with RSK |
| `/mentorship` | Mentorship & Membership | Join RSK Associates mentorship program |
| `/about/who` | Who We Are | Learn about RSK Associates — corporate advisory collective |
| `/about/team` | Our Team | Meet the RSK Associates team |
| `/about/partners` | Our Partners | Strategic partnerships and organisations |

---

## Noindex Pages

All admin/private pages include `robots: { index: false, follow: false }` with GoogleBot-specific noindex rules:

- `/admin/(dashboard)/*` — All dashboard pages
- `/admin/login` — Login page
- `/admin/forgot-password` — Forgot password
- `/admin/verify-otp` — Verify OTP
- `/admin/reset-password` — Reset password
- `/admin/unauthorized` — Access denied
- `/admin/*` — All other admin routes

---

## robots.txt

Generated dynamically at `/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /favicon.svg

Sitemap: https://rskassociates.rw/sitemap.xml
Host: https://rskassociates.rw
```

---

## Sitemap

Generated dynamically at `/sitemap.xml`:

- **Static pages**: Home, Contact, Blog, Opportunities, Mentorship, About (Who/Team/Partners)
- **Dynamic pages**: News articles and opportunities fetched from API
- **Revalidation**: API data revalidated every hour (3600 seconds)
- **Priority**: Home (1.0), Blog (0.9), Contact (0.8), others (0.5-0.7)
- **Change frequency**: Daily for home, weekly for blog, monthly for others

---

## Structured Data (JSON-LD)

### Implemented Schemas

| Schema | Location | Purpose |
|--------|----------|---------|
| Organization | Root layout `<head>` | Identifies RSK Associates as the organization |
| WebSite | Root layout `<head>` | Website with search action |
| Article | News article page | Article structured data for Google News |
| BreadcrumbList | Available via component | Navigation breadcrumbs |
| FAQPage | Available via component | FAQ structured data |
| WebPage | Available via component | Generic page schema |

### Schema Details

**Organization Schema**:
- Name: RSK Associates
- URL: Site URL
- Logo: /rsk-logo.svg
- Description: Default description
- SameAs: Social media profiles (when configured)

**WebSite Schema**:
- Name: RSK Associates
- URL: Site URL
- SearchAction: Configured for site search

**Article Schema** (news articles):
- Headline: Article title
- Description: Article excerpt
- Author: Article author name
- Publisher: RSK Associates with logo
- datePublished / dateModified: From article data
- Image: Article cover image
- mainEntityOfPage: Canonical URL

---

## Image SEO Strategy

### Current Image Handling

Images in this application come from:
1. **Cloudinary** (via API) — Dynamic URLs for user-uploaded content
2. **Unsplash** (external) — Used in some components
3. **Local** — `/rsk-logo.svg`, `/favicon.svg`, `/grade.png`

### SEO Optimizations Applied

| Optimization | Implementation |
|-------------|----------------|
| Descriptive alt text | All `<Image />` components use meaningful alt text |
| Proper dimensions | Width/height or fill with sizes attribute |
| Priority loading | Above-fold images use `priority` prop |
| Responsive sizing | `sizes` attribute on all fill images |
| Lazy loading | Below-fold images use default lazy loading |
| Next.js Image | All images use Next.js `<Image />` component |
| No layout shift | Proper width/height or fill sizing |

### Key Image Components

- **Navbar logo**: `alt="RSK Associates"`, `priority`, fixed dimensions
- **News articles**: `alt={article.title}`, `priority` on first article, `sizes` for responsive
- **Team members**: `alt={member.name}`, `fill` with responsive sizing
- **Opportunities**: `alt={item.title}`, `fill` with responsive sizing
- **Partners**: `alt={partner.name}`, fixed dimensions

### Image Discoverability

- Images are not blocked by robots.txt (only /admin/, /api/, /_next/ are blocked)
- All images have descriptive alt text for Google Images indexing
- Images use proper loading strategies for performance

---

## Google Analytics 4 (GA4) Setup

### Implementation

GA4 is integrated via:
1. **`src/lib/analytics.ts`**: Core GA4 functions (script loading, page tracking, event tracking)
2. **`src/components/analytics-wrapper.tsx`**: Client component that loads GA4 script and tracks page views on route changes
3. **`src/app/layout.tsx`**: Includes `<AnalyticsWrapper />` alongside existing `<Analytics />` (Vercel Analytics)

### How It Works

1. `AnalyticsWrapper` checks if GA4 script is already loaded
2. If not, dynamically creates a `<script>` tag for the GA4 library
3. Initializes `gtag` with the measurement ID
4. Tracks page views on every route change using `usePathname()`
5. Sends `page_view` events with path, title, and URL

### Avoiding Duplicate Page Views

- `send_page_view: false` in initial config prevents automatic tracking
- Manual `trackPageView()` is called on route changes
- `hasTracked` ref prevents duplicate tracking for the same path
- Vercel Analytics (`@vercel/analytics`) runs independently for performance monitoring

### Environment Variable

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Google Search Console Setup Instructions

### 1. Domain/Property Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property"
3. Select "Domain" (recommended) or "URL prefix"
4. For Domain: Enter `rsk-associates.com` (covers all subdomains)
5. For URL prefix: Enter `https://rskassociates.rw`

### 2. Verification

**Option A: DNS Record (Domain property)**
- Add the TXT record provided by GSC to your DNS settings

**Option B: HTML file (URL prefix)**
- Download the HTML verification file
- Place it in `public/` directory at the root
- Or add the meta tag to `<head>` (already supported via `GOOGLE_SITE_VERIFICATION` env var)

**Option C: Google Analytics**
- If GA4 is already set up, verify via GA4 connection in GSC

### 3. Sitemap Submission

1. In GSC, go to "Sitemaps" in the left menu
2. Enter: `sitemap.xml`
3. Click "Submit"
4. The sitemap is auto-generated at `https://rskassociates.rw/sitemap.xml`

### 4. robots.txt Verification

1. In GSC, go to "robots.txt Tester"
2. Verify that `/admin/`, `/api/`, `/_next/` are blocked
3. Verify that `/sitemap.xml` is allowed

### 5. URL Inspection

1. Use "URL Inspection" tool to check individual pages
2. Verify indexing status, coverage, and enhancements
3. Request indexing for important new pages

### 6. Core Web Vitals & Page Experience

Monitor in GSC under "Experience" tab:
- **LCP** (Largest Contentful Paint): < 2.5s
- **INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

### 7. Search Performance Monitoring

1. Go to "Performance" in GSC
2. Monitor:
   - **Clicks**: Total clicks from Google
   - **Impressions**: Times pages appeared in search results
   - **CTR**: Click-through rate
   - **Average position**: Average ranking position
   - **Landing pages**: Which pages get the most traffic
   - **Search queries**: What users search for to find your site

### 8. Troubleshooting Indexing Issues

1. Check "Coverage" report for errors/warnings
2. Use "URL Inspection" for specific pages
3. Verify robots.txt isn't blocking important pages
4. Check for noindex tags on pages that should be indexed
5. Ensure sitemap includes all important pages
6. Check for 404 errors and broken links

---

## Google Analytics 4 Setup Instructions

### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property (GA4)
3. Set property name: "RSK Associates"
4. Set reporting currency and time zone
5. Copy the Measurement ID (format: G-XXXXXXXXXX)

### 2. Configure Data Streams

1. In GA4, go to "Data Streams"
2. Add "Web" stream
3. Stream URL: `https://rskassociates.rw`
4. Stream name: "RSK Associates Website"
5. Copy the Measurement ID

### 3. Enhanced Measurement

In GA4 data stream settings, enable:
- Page views (handled manually in our implementation)
- Scroll events
- Outbound clicks
- Site search
- Video engagement (if applicable)
- File downloads (if applicable)

### 4. Custom Events

Track custom events using `trackEvent()`:

```typescript
import { trackEvent } from "@/lib/analytics";

// Contact form submission
trackEvent("contact_form_submit", {
  method: "contact_form",
  page: window.location.pathname,
});

// CTA button click
trackEvent("cta_click", {
  cta_name: "Get in Touch",
  location: "hero",
});
```

### 5. Conversion Events

In GA4, mark key events as conversions:
- contact_form_submit
- cta_click
- newsletter_signup
- membership_signup

---

## Next.js → Google Analytics 4 → Google Search Console Integration

### Data Flow

```
Next.js App Router
    │
    ├── AnalyticsWrapper (GA4)
    │   ├── Page views (manual tracking)
    │   ├── Custom events
    │   └── Session data
    │
    ├── @vercel/analytics (Vercel Analytics)
    │   ├── Performance metrics
    │   └── Core Web Vitals
    │
    └── Google Search Console
        ├── Crawl stats
        ├── Index coverage
        ├── Search queries
        └── Core Web Vitals
```

### Monitoring Capabilities

| Metric | GA4 | GSC | Vercel Analytics |
|--------|-----|-----|-----------------|
| Organic traffic | ✅ | ✅ | ❌ |
| Search queries | ❌ | ✅ | ❌ |
| Clicks | ✅ | ✅ | ❌ |
| Impressions | ❌ | ✅ | ❌ |
| CTR | ❌ | ✅ | ❌ |
| Average position | ❌ | ✅ | ❌ |
| Landing pages | ✅ | ✅ | ✅ |
| User behavior | ✅ | ❌ | ✅ |
| Conversion events | ✅ | ❌ | ❌ |
| Core Web Vitals | ❌ | ✅ | ✅ |
| Page load time | ❌ | ❌ | ✅ |

### Recommended Event Tracking

```typescript
// In page components
useEffect(() => {
  trackPageView(router.pathname);
}, [router.pathname]);
```

---

## Performance + SEO Optimizations

### Core Web Vitals

| Metric | Target | Implementation |
|--------|--------|----------------|
| **LCP** | < 2.5s | Priority loading for hero images, optimized fonts |
| **INP** | < 200ms | Efficient React rendering, minimal client JS |
| **CLS** | < 0.1 | Proper image dimensions, stable layouts |

### Image Optimization

- Next.js `<Image />` with automatic optimization
- `priority` for above-fold images
- `sizes` for responsive images
- Lazy loading for below-fold images
- `fill` for background/cover images with proper sizing

### Font Optimization

- Next.js `next/font/google` for automatic font optimization
- `Geist`, `Geist_Mono`, `PT_Mono` with subset loading
- `display: swap` for font loading
- Variable fonts where applicable

### JavaScript Efficiency

- `"use client"` only where interactivity is needed
- Server Components by default
- Dynamic imports where applicable
- Minimal client-side hydration

### Caching

- Sitemap API data revalidated every hour
- robots.txt is static
- Static pages are pre-rendered

### Mobile Performance

- Responsive images with `sizes` attribute
- Touch-friendly interactions
- Reduced motion support via `useReducedMotion`
- Viewport meta tag configured

---

## SEO-Friendly URLs

All URLs use clean, descriptive slugs:

- `/` — Home
- `/contact` — Contact
- `/blog/news` — News listing
- `/blog/news/[slug]` — News article (dynamic slug)
- `/blog/opportunities` — Opportunities listing
- `/mentorship` — Mentorship
- `/about/who` — About/Who we are
- `/about/team` — Team
- `/about/partners` — Partners

---

## Heading Hierarchy

Each page follows proper heading hierarchy:

- **H1**: Page title (one per page)
- **H2**: Section headings
- **H3**: Subsection headings
- **H4-H6**: Nested content

---

## Internal Linking Strategy

- Navbar links to all main sections
- Breadcrumbs (available via StructuredData component)
- Related content links in blog articles
- Footer links to key pages
- Contextual links within content

---

## Duplicate Content Prevention

- Canonical URLs on every page
- Noindex on duplicate/admin pages
- Unique titles and descriptions per page
- Dynamic routes use slugs (not IDs)
- Pagination handled with proper URLs

---

## Error Page Handling

- **404**: Custom not-found.tsx with noindex, friendly message, and home link
- **500**: Next.js default error page (customize as needed)
- **Unauthorized**: Custom unauthorized page with noindex

---

## Remaining Manual Steps

### Required

1. **Set environment variables** in production:
   - `NEXT_PUBLIC_SITE_URL` — Your production URL
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Your GA4 ID

2. **Verify in Google Search Console**:
   - Add property for your domain
   - Verify ownership (DNS, HTML file, or GA4)
   - Submit sitemap: `https://yourdomain.com/sitemap.xml`

3. **Set up Google Analytics 4**:
   - Create GA4 property
   - Add measurement ID to `.env`
   - Configure data streams
   - Enable enhanced measurement
   - Mark conversion events

4. **Configure social media profiles** (optional):
   - Update `SOCIAL` object in `src/lib/seo.ts` with actual URLs
   - Add Open Graph images for social sharing

5. **Test all pages**:
   - Run `npm run build` to verify no TypeScript errors
   - Test each page in browser
   - Inspect meta tags using browser dev tools
   - Validate structured data using [Google Rich Results Test](https://search.google.com/test/rich-results)

### Recommended

6. **Add OG images** for each page (social sharing previews)
7. **Configure Search Console URL inspection** for all key pages
8. **Set up GA4 custom events** for key user actions
9. **Monitor Core Web Vitals** in Search Console regularly
10. **Review sitemap** after adding new content types
11. **Add JSON-LD breadcrumbs** to inner pages using `<StructuredData>` component
12. **Test mobile usability** in Search Console

---

## SEO Checklist

### Technical SEO
- [x] Global metadata configured
- [x] Page-specific titles and descriptions
- [x] Dynamic metadata for dynamic routes
- [x] Canonical URLs on all pages
- [x] Open Graph metadata
- [x] Twitter Card metadata
- [x] Robots metadata
- [x] robots.txt created
- [x] Dynamic sitemap.xml created
- [x] Language/locale metadata
- [x] Viewport and theme metadata
- [x] Favicon configured
- [x] Noindex on admin/private pages
- [x] Custom 404 page
- [x] Heading hierarchy correct
- [x] SEO-friendly URLs
- [x] Internal linking strategy
- [x] Duplicate content prevention

### Image SEO
- [x] Descriptive alt text on all images
- [x] Proper width/height or responsive sizing
- [x] Priority loading for above-fold images
- [x] Next.js Image component used correctly
- [x] Images not blocked by robots.txt
- [x] Lazy loading for below-fold images

### Structured Data
- [x] Organization schema
- [x] WebSite schema
- [x] Article schema (news articles)
- [x] BreadcrumbList schema (available)
- [x] FAQPage schema (available)
- [x] WebPage schema (available)

### Google Search Console
- [ ] Property setup and verification
- [ ] Sitemap submission
- [ ] URL inspection
- [ ] Indexing checks
- [ ] Core Web Vitals monitoring
- [ ] Search performance monitoring

### Google Analytics
- [ ] GA4 property created
- [ ] Measurement ID configured
- [ ] Page view tracking verified
- [ ] Custom events configured
- [ ] Conversion events marked

### Performance
- [x] Core Web Vitals optimized
- [x] Image optimization
- [x] Font optimization
- [x] JavaScript efficiency
- [x] Caching strategy
- [x] Mobile performance

---

## Support

For questions about this SEO implementation, refer to:
- [Next.js Metadata API Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js Sitemap Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js Robots.txt Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Google Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data)
- [GA4 Documentation](https://support.google.com/analytics/answer/9233624)
