import { SiteContentFormData } from "@/types/site-content";
import { SiteContentSection } from "./SiteContentSection";

interface SiteContentSectionsProps {
  formData: SiteContentFormData;
  onInputChange: (section: keyof SiteContentFormData, field: string, value: string) => void;
}

export function HeroSection({ formData, onInputChange }: SiteContentSectionsProps) {
  return (
    <SiteContentSection
      title="Hero Section"
      description="Main title, subtitle, and call-to-action buttons on the home page"
      fields={[
        {
          id: "hero-title",
          label: "Main Title",
          value: formData.hero.title,
          onChange: (value) => onInputChange("hero", "title", value),
          placeholder: "Enter main title",
          type: "input",
        },
        {
          id: "hero-subtitle",
          label: "Subtitle",
          value: formData.hero.subtitle,
          onChange: (value) => onInputChange("hero", "subtitle", value),
          placeholder: "Enter subtitle",
          type: "input",
        },
        {
          id: "hero-description",
          label: "Description",
          value: formData.hero.description,
          onChange: (value) => onInputChange("hero", "description", value),
          placeholder: "Enter hero description (supports multiple lines)",
          type: "textarea",
        },
        {
          id: "hero-portfolio-button",
          label: "Portfolio Button Text",
          value: formData.hero.portfolio_button,
          onChange: (value) => onInputChange("hero", "portfolio_button", value),
          placeholder: "Enter portfolio button text",
          type: "input",
        },
        {
          id: "hero-booking-button",
          label: "Booking Button Text",
          value: formData.hero.booking_button,
          onChange: (value) => onInputChange("hero", "booking_button", value),
          placeholder: "Enter booking button text",
          type: "input",
        },
      ]}
      gridCols={2}
    />
  );
}
