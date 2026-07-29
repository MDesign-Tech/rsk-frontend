"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, ChevronUp } from "lucide-react";
import { useWebsiteStore } from "@/stores/website.store";
import { aboutService } from "@/services/about.service";

// Social media icon SVGs (matching footer.tsx style)
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
  ),
  linkedin: (
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.469v6.766z" />
  ),
  x: (
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  ),
};

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [aboutWhatsappHref, setAboutWhatsappHref] = useState<string | null>(null);
  const pathname = usePathname();
  const data = useWebsiteStore((state) => state.data);

  // Try to get WhatsApp from website store first, then fallback to about API
  const whatsapp = data?.about?.socialMedia?.whatsapp;
  const whatsappHref = whatsapp?.href || aboutWhatsappHref;
  const whatsappVisible = whatsapp?.visible !== false;

  // Extract phone number from WhatsApp URL (e.g., https://wa.me/250788000000)
  const getPhoneNumber = (href: string | null | undefined): string | null => {
    if (!href) return null;
    const waMatch = href.match(/wa\.me\/(\d+)/);
    if (waMatch) return waMatch[1];
    const apiMatch = href.match(/phone=(\d+)/);
    if (apiMatch) return apiMatch[1];
    if (/^\d+$/.test(href)) return href;
    return null;
  };

  const phoneNumber = getPhoneNumber(whatsappHref);

  // Fetch about data directly as fallback if website store doesn't have WhatsApp
  useEffect(() => {
    (async () => {
      if (phoneNumber) return;
      try {
        const res = await aboutService.get();
        const about = res.data?.about;
        if (about?.socialMedia?.whatsapp?.href) {
          setAboutWhatsappHref(about.socialMedia.whatsapp.href);
        }
      } catch (err) {
        // Silently fail - button will just not show
      }
    })();
  }, [phoneNumber]);

  // Don't render if WhatsApp is not configured, not visible, or on admin pages
  if (!phoneNumber || !whatsappVisible || pathname.startsWith("/admin")) return null;

  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  // Get social media links from store
  const socialMedia = data?.about?.socialMedia;
  const socialLinks = [
    {
      platform: "instagram" as const,
      href: socialMedia?.instagram?.href,
      visible: socialMedia?.instagram?.visible !== false,
      label: "Instagram",
    },
    {
      platform: "linkedin" as const,
      href: socialMedia?.linkedin?.href,
      visible: socialMedia?.linkedin?.visible !== false,
      label: "LinkedIn",
    },
    {
      platform: "x" as const,
      href: socialMedia?.x?.href,
      visible: socialMedia?.x?.visible !== false,
      label: "X (Twitter)",
    },
  ].filter((item) => item.visible && item.href);

  const hasSocials = socialLinks.length > 0;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
      {/* Social Media Dropdown */}
      {hasSocials && (
        <div
          className="relative flex flex-col items-end"
          onMouseEnter={() => setShowSocials(true)}
          onMouseLeave={() => setShowSocials(false)}
        >
          {/* Dropdown Menu */}
          <div
            className={`
              flex flex-col items-center gap-2 mb-2
              transition-all duration-300 ease-out
              ${showSocials ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
            `}
            role="menu"
            aria-label="Social media links"
          >
            {socialLinks.map(({ platform, href, label }) => (
              <a
                key={platform}
                href={href as string}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center
                  w-10 h-10
                  bg-white dark:bg-gray-800
                  rounded-full shadow-md
                  hover:shadow-lg
                  hover:scale-110
                  transition-all duration-200
                  text-gray-700 dark:text-gray-300
                  hover:text-foreground
                  border border-gray-200 dark:border-gray-700
                "
                aria-label={`Visit our ${label} page`}
                title={label}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {SOCIAL_ICONS[platform]}
                </svg>
              </a>
            ))}
          </div>

          {/* Arrow Button */}
          <button
            onClick={() => setShowSocials(!showSocials)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowSocials(!showSocials);
              }
            }}
            className={`
              flex items-center justify-center
              w-8 h-8
              bg-white dark:bg-gray-800
              rounded-full shadow-md
              hover:shadow-lg
              transition-all duration-200
              text-gray-600 dark:text-gray-400
              hover:text-foreground
              border border-gray-200 dark:border-gray-700
              cursor-pointer
            `}
            aria-label="Toggle social media links"
            aria-expanded={showSocials}
            aria-haspopup="true"
          >
            <ChevronUp
              className={`
                w-4 h-4
                transition-transform duration-300
                ${showSocials ? "rotate-180" : ""}
              `}
            />
          </button>
        </div>
      )}

      {/* Popup message */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 max-w-xs border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Chat with us!
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                We typically reply within a few minutes.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            Start Chat
          </a>
        </div>
      )}

      {/* WhatsApp button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        {/* Ping animation ring */}
        <>
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
          <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-75" />
        </>
        {/* WhatsApp icon */}
        <svg
          className="w-7 h-7 relative z-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>

        {/* Tooltip */}
        <span className="absolute right-16 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </button>
    </div>
  );
}
