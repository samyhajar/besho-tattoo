import { SiteContentFormData } from "@/types/site-content";
import { SiteContentSection } from "./SiteContentSection";

interface SiteContentSectionsProps {
  formData: SiteContentFormData;
  onInputChange: (section: keyof SiteContentFormData, field: string, value: string) => void;
}

export function AboutSection({ formData, onInputChange }: SiteContentSectionsProps) {
  return (
    <SiteContentSection
      title="About Me Section"
      description="Content for the About Me section that appears after the hero"
      fields={[
        {
          id: "about-title",
          label: "Section Title",
          value: formData.about.title,
          onChange: (value) => onInputChange("about", "title", value),
          placeholder: "Enter section title",
          type: "input",
        },
        {
          id: "about-intro",
          label: "Introduction",
          value: formData.about.intro,
          onChange: (value) => onInputChange("about", "intro", value),
          placeholder: "Enter introduction text",
          type: "textarea",
        },
        {
          id: "about-description",
          label: "Description",
          value: formData.about.description,
          onChange: (value) => onInputChange("about", "description", value),
          placeholder: "Enter detailed description",
          type: "textarea",
        },
        {
          id: "about-services-title",
          label: "Services Section Title",
          value: formData.about.services_title,
          onChange: (value) => onInputChange("about", "services_title", value),
          placeholder: "Enter services section title",
          type: "input",
        },
        {
          id: "about-services",
          label: "Services List",
          value: formData.about.services,
          onChange: (value) => onInputChange("about", "services", value),
          placeholder: "Enter services list (use • for bullet points)",
          type: "textarea",
        },
        {
          id: "about-appointments-title",
          label: "Appointments Section Title",
          value: formData.about.appointments_title,
          onChange: (value) => onInputChange("about", "appointments_title", value),
          placeholder: "Enter appointments section title",
          type: "input",
        },
        {
          id: "about-appointments-text",
          label: "Appointments Text",
          value: formData.about.appointments_text,
          onChange: (value) => onInputChange("about", "appointments_text", value),
          placeholder: "Enter appointments explanation text",
          type: "textarea",
        },
      ]}
      gridCols={1}
    />
  );
}
