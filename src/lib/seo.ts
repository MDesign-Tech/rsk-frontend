/**
 * SEO Utilities & Constants
 * Centralized configuration for the RSK Associates SEO system.
 */

// ─── Site Configuration ────────────────────────────────────────────────

export const SITE_NAME = "RSK Associates";
export const SITE_TAGLINE = "Professional services and consulting for your business needs.";
export const DEFAULT_DESCRIPTION =
  "RSK Associates is a corporate advisory collective that helps businesses navigate growth, finance, and strategy with confidence.";

// Must be set via NEXT_PUBLIC_SITE_URL in .env
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://rskassociates.rw";
}

export const SITE_URL = getSiteUrl();

// ─── Social ────────────────────────────────────────────────────────────

export const SOCIAL = {
  twitterHandle: "@RSKAssociates",
  facebook: "",
  linkedin: "",
  instagram: "",
  youtube: "",
  whatsapp: "",
};

export const SOCIAL_SAMEAS = [
  SOCIAL.facebook,
  SOCIAL.linkedin,
  SOCIAL.instagram,
  SOCIAL.youtube,
  SOCIAL.twitterHandle,
].filter(Boolean);

// ─── Default Image ─────────────────────────────────────────────────────

export const DEFAULT_IMAGE = {
  url: `${SITE_URL}/rsk-logo.svg`,
  width: 1200,
  height: 630,
  alt: "RSK Associates logo",
};

// ─── Navigation ────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about/who" },
  { name: "Team", href: "/about/team" },
  { name: "Partners", href: "/about/partners" },
  { name: "Services", href: "/#services" },
  { name: "Blog", href: "/blog/news" },
  { name: "Opportunities", href: "/blog/opportunities" },
  { name: "Mentorship", href: "/mentorship" },
  { name: "Contact", href: "/contact" },
];

// ─── SEO Helpers ───────────────────────────────────────────────────────

/**
 * Builds a canonical URL from a path, stripping query params.
 */
export function getCanonicalUrl(path: string): string {
  const clean = path.split("?")[0].split("#")[0];
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
}

/**
 * Creates a standardized metadata object for a page.
 */
export function createPageMetadata(
  title: string,
  description: string,
  path: string,
  options?: {
    image?: { url: string; width?: number; height?: number; alt?: string };
    type?: "website" | "article" | "profile";
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  }
): import("next").Metadata {
  const img = options?.image || DEFAULT_IMAGE;
  const metadata: import("next").Metadata = {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: getCanonicalUrl(path),
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(path),
      siteName: SITE_NAME,
      locale: "en_US",
      type: options?.type || "website",
      images: [
        {
          url: img.url,
          width: img.width || 1200,
          height: img.height || 630,
          alt: img.alt || `${title} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img.url],
    },
  };

  if (options?.publishedTime) {
    (metadata as { publishedTime?: string }).publishedTime = options.publishedTime;
  }
  if (options?.modifiedTime) {
    (metadata as { modifiedTime?: string }).modifiedTime = options.modifiedTime;
  }
  if (options?.authors?.length) {
    metadata.authors = options.authors.map((a) => ({ name: a }));
  }
  if (options?.tags?.length) {
    metadata.keywords = options.tags;
  }

  return metadata;
}

/**
 * Creates noindex metadata for private/admin pages.
 */
export function createNoIndexMetadata(
  title: string,
  description: string = "This page is not indexed."
): import("next").Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        "max-video-preview": -1,
        "max-image-preview": "none",
        "max-snippet": -1,
      },
    },
  };
}

// ─── JSON-LD Schema Helpers ────────────────────────────────────────────

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/rsk-logo.svg`,
    description: DEFAULT_DESCRIPTION,
    sameAs: SOCIAL_SAMEAS,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "",
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
  };
}

export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function createBreadcrumbListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createArticleSchema(
  title: string,
  description: string,
  author: string,
  datePublished: string,
  dateModified: string,
  image: string,
  url: string,
  publisherName: string = SITE_NAME
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/rsk-logo.svg`,
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
    image: image,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function createFAQSchema(
  questions: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function createWebPageSchema(
  name: string,
  description: string,
  url: string,
  type: string = "WebPage"
) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    isAccessibleForFree: true,
  };
}
