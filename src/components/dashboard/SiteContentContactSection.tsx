import { SiteContentFormData } from "@/types/site-content";
import { SiteContentSection } from "./SiteContentSection";

interface SiteContentSectionsProps {
  formData: SiteContentFormData;
  onInputChange: (section: keyof SiteContentFormData, field: string, value: string) => void;
}

export function ContactSection({ formData, onInputChange }: SiteContentSectionsProps) {
  return (
    <SiteContentSection
      title="Contact Information"
      description="Contact details displayed on the contact page"
      fields={[
        {
          id: "contact-address",
          label: "Studio Address",
          value: formData.contact.address,
          onChange: (value) => onInputChange("contact", "address", value),
          placeholder: "Enter studio address",
          type: "textarea",
        },
        {
          id: "contact-phone",
          label: "Phone Number",
          value: formData.contact.phone,
          onChange: (value) => onInputChange("contact", "phone", value),
          placeholder: "Enter phone number",
          type: "input",
        },
        {
          id: "contact-email",
          label: "Email Address",
          value: formData.contact.email,
          onChange: (value) => onInputChange("contact", "email", value),
          placeholder: "Enter email address",
          type: "input",
        },
        {
          id: "contact-hours",
          label: "Studio Hours",
          value: formData.contact.hours,
          onChange: (value) => onInputChange("contact", "hours", value),
          placeholder: "Enter studio hours",
          type: "textarea",
        },
        {
          id: "contact-social-media",
          label: "Social Media",
          value: formData.contact.social_media,
          onChange: (value) => onInputChange("contact", "social_media", value),
          placeholder: "Enter social media handle or link",
          type: "input",
        },
      ]}
      gridCols={1}
    />
  );
}
