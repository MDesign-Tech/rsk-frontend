"use client";

export function trackPageView(path: string) {
  const gtag = (window as unknown as Record<string, unknown>).gtag;
  if (typeof gtag === "function") {
    gtag("event", "page_view", {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
}

export function trackEvent(
  eventName: string,
  eventParams: Record<string, unknown> = {}
) {
  const gtag = (window as unknown as Record<string, unknown>).gtag;
  if (typeof gtag === "function") {
    gtag("event", eventName, eventParams);
  }
}
