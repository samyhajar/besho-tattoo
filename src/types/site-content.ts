export interface SiteContent {
  id: string;
  page: string;
  section: string;
  field_name: string;
  content: string;
  updated_at: string;
  updated_by: string | null;
}

export interface SiteContentUpdate {
  page: string;
  section: string;
  field_name: string;
  content: string;
}

export interface SiteContentFormData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    portfolio_button: string;
    booking_button: string;
  };
  about: {
    title: string;
    intro: string;
    description: string;
    services_title: string;
    services: string;
    appointments_title: string;
    appointments_text: string;
    seo_title: string;
    seo_description: string;
    seo_portfolio: string;
    seo_conclusion: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string;
    social_media: string;
    image_url: string;
  };
}

export type SiteContentSection = "hero" | "about" | "contact";
export type SiteContentPage = "home" | "contact";
