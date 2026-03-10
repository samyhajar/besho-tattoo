import { SiteContentFormData } from "@/types/site-content";
import { SiteContentSection } from "./SiteContentSection";

interface SiteContentSectionsProps {
  formData: SiteContentFormData;
  onInputChange: (
    section: keyof SiteContentFormData,
    field: string,
    value: string,
  ) => void;
}

export function AboutSection({
  formData,
  onInputChange,
}: SiteContentSectionsProps) {
  return (
    <SiteContentSection
      title="About Me Section"
      description="Content for the public About page. Use intro and description for the opening text blocks, and enter offerings one card per line using: Title | description"
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
          label: "Offerings List",
          value: formData.about.services,
          onChange: (value) => onInputChange("about", "services", value),
          placeholder:
            "One line per card: Fine Line Tattoos | modern, minimal, timeless.",
          type: "textarea",
        },
        {
          id: "about-appointments-title",
          label: "Appointments Section Title",
          value: formData.about.appointments_title,
          onChange: (value) =>
            onInputChange("about", "appointments_title", value),
          placeholder: "Enter appointments section title",
          type: "input",
        },
        {
          id: "about-appointments-text",
          label: "Appointments Text",
          value: formData.about.appointments_text,
          onChange: (value) =>
            onInputChange("about", "appointments_text", value),
          placeholder: "Enter appointments explanation text",
          type: "textarea",
        },
      ]}
      gridCols={1}
    />
  );
}
