import { SiteContentFormData } from "@/types/site-content";
import { SiteContentSection } from "./SiteContentSection";

interface SiteContentSectionsProps {
  formData: SiteContentFormData;
  onInputChange: (section: keyof SiteContentFormData, field: string, value: string) => void;
}

export function SeoSection({ formData, onInputChange }: SiteContentSectionsProps) {
  return (
    <SiteContentSection
      title="SEO & Marketing Content"
      description="SEO-optimized content for search engines and marketing purposes"
      fields={[
        {
          id: "about-seo-title",
          label: "SEO Title",
          value: formData.about.seo_title,
          onChange: (value) => onInputChange("about", "seo_title", value),
          placeholder: "Enter SEO-optimized title",
          type: "textarea",
        },
        {
          id: "about-seo-description",
          label: "SEO Description",
          value: formData.about.seo_description,
          onChange: (value) => onInputChange("about", "seo_description", value),
          placeholder: "Enter SEO description",
          type: "textarea",
        },
        {
          id: "about-seo-portfolio",
          label: "Portfolio Highlights",
          value: formData.about.seo_portfolio,
          onChange: (value) => onInputChange("about", "seo_portfolio", value),
          placeholder: "Enter portfolio highlights for SEO",
          type: "textarea",
        },
        {
          id: "about-seo-conclusion",
          label: "SEO Conclusion",
          value: formData.about.seo_conclusion,
          onChange: (value) => onInputChange("about", "seo_conclusion", value),
          placeholder: "Enter SEO conclusion text",
          type: "textarea",
        },
      ]}
      gridCols={1}
    />
  );
}
