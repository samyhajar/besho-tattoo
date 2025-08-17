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
    portfolio_button: string;
    booking_button: string;
  };
  navigation: {
    home_link: string;
    portfolio_link: string;
    contact_link: string;
    bookings_button: string;
  };
  footer: {
    description: string;
    copyright: string;
    privacy_link: string;
  };
}

export type SiteContentSection = "hero" | "navigation" | "footer";
export type SiteContentPage = "home" | "navigation" | "footer";
