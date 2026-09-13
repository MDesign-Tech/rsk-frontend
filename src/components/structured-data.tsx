"use client";

import { useEffect, useState } from "react";
import {
  createBreadcrumbListSchema,
  getCanonicalUrl,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

interface StructuredDataProps {
  type: "organization" | "website" | "article" | "faq" | "webpage" | "breadcrumb";
  data?: Record<string, unknown>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const [schema, setSchema] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let schemaObj: Record<string, unknown> | null = null;

    switch (type) {
      case "organization":
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/rsk-logo.svg`,
          description:
            "RSK Associates is a corporate advisory collective that helps businesses navigate growth, finance, and strategy with confidence.",
        };
        break;

      case "website":
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description:
            "RSK Associates is a corporate advisory collective that helps businesses navigate growth, finance, and strategy with confidence.",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        };
        break;

      case "article":
        if (data) {
          schemaObj = {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: (data.headline as string) || "",
            description: (data.description as string) || "",
            author: {
              "@type": "Person",
              name: (data.author as string) || SITE_NAME,
            },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/rsk-logo.svg`,
              },
            },
            datePublished: (data.datePublished as string) || "",
            dateModified: (data.dateModified as string) || "",
            image: (data.image as string) || `${SITE_URL}/rsk-logo.svg`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": getCanonicalUrl((data.url as string) || "/"),
            },
          };
        }
        break;

      case "faq":
        if (data?.questions) {
          schemaObj = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: (data.questions as Array<{ question: string; answer: string }>).map(
              (q) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: q.answer,
                },
              })
            ),
          };
        }
        break;

      case "webpage":
        if (data) {
          schemaObj = {
            "@context": "https://schema.org",
            "@type": (data.type as string) || "WebPage",
            name: (data.name as string) || "",
            description: (data.description as string) || "",
            url: getCanonicalUrl((data.url as string) || "/"),
            isAccessibleForFree: true,
          };
        }
        break;

      case "breadcrumb":
        if (data?.items) {
          schemaObj = createBreadcrumbListSchema(data.items as Array<{ name: string; url: string }>);
        }
        break;
    }

    setSchema(schemaObj);
  }, [type, data]);

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
