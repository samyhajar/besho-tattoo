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
    description: getContentByField("home", "hero", "description"),
    portfolioButton: getContentByField("home", "hero", "portfolio_button"),
    bookingButton: getContentByField("home", "hero", "booking_button"),
  });

  const getAboutContent = () => ({
    title: getContentByField("home", "about", "title"),
    intro: getContentByField("home", "about", "intro"),
    description: getContentByField("home", "about", "description"),
    servicesTitle: getContentByField("home", "about", "services_title"),
    services: getContentByField("home", "about", "services"),
    appointmentsTitle: getContentByField("home", "about", "appointments_title"),
    appointmentsText: getContentByField("home", "about", "appointments_text"),
    seoTitle: getContentByField("home", "about", "seo_title"),
    seoDescription: getContentByField("home", "about", "seo_description"),
    seoPortfolio: getContentByField("home", "about", "seo_portfolio"),
    seoConclusion: getContentByField("home", "about", "seo_conclusion"),
  });

  const getContactContent = () => ({
    address: getContentByField("contact", "info", "address"),
    phone: getContentByField("contact", "info", "phone"),
    email: getContentByField("contact", "info", "email"),
    hours: getContentByField("contact", "info", "hours"),
    socialMedia: getContentByField("contact", "info", "social_media"),
    imageUrl: getContentByField("contact", "info", "image_url"),
  });

  return {
    content,
    loading,
    error,
    reload: loadContent,
    getContentByField,
    getHeroContent,
    getAboutContent,
    getContactContent,
  };
}
