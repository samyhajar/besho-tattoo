import { useState, useEffect } from "react";
import { getSiteContent } from "@/services/site-content";
import { SiteContent } from "@/types/site-content";

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSiteContent();
      setContent(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load site content",
      );
      console.error("Error loading site content:", err);
    } finally {
      setLoading(false);
    }
  };

  const getContentByField = (
    page: string,
    section: string,
    fieldName: string,
  ): string => {
    const item = content.find(
      (item) =>
        item.page === page &&
        item.section === section &&
        item.field_name === fieldName,
    );
    return item?.content || "";
  };

  const getHeroContent = () => ({
    title: getContentByField("home", "hero", "title"),
    subtitle: getContentByField("home", "hero", "subtitle"),
    portfolioButton: getContentByField("home", "hero", "portfolio_button"),
    bookingButton: getContentByField("home", "hero", "booking_button"),
  });

  const getNavigationContent = () => ({
    homeLink: getContentByField("navigation", "header", "home_link"),
    portfolioLink: getContentByField("navigation", "header", "portfolio_link"),
    contactLink: getContentByField("navigation", "header", "contact_link"),
    bookingsButton: getContentByField(
      "navigation",
      "header",
      "bookings_button",
    ),
  });

  const getFooterContent = () => ({
    description: getContentByField("footer", "main", "description"),
    copyright: getContentByField("footer", "main", "copyright"),
    privacyLink: getContentByField("footer", "main", "privacy_link"),
  });

  return {
    content,
    loading,
    error,
    reload: loadContent,
    getContentByField,
    getHeroContent,
    getNavigationContent,
    getFooterContent,
  };
}
