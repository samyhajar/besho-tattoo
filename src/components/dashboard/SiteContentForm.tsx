"use client";

import { useState } from "react";
import { SiteContent, SiteContentFormData } from "@/types/site-content";
import {
  transformSiteContentToFormData,
  transformFormDataToUpdates,
  updateMultipleSiteContent,
} from "@/services/site-content";
import { SiteContentSection } from "@/components/dashboard/SiteContentSection";
import { SiteContentActions } from "@/components/dashboard/SiteContentActions";

interface SiteContentFormProps {
  content: SiteContent[];
  onContentUpdated: () => void;
}

export function SiteContentForm({
  content,
  onContentUpdated,
}: SiteContentFormProps) {
  const [formData, setFormData] = useState<SiteContentFormData>(() =>
    transformSiteContentToFormData(content),
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (
    section: keyof SiteContentFormData,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updates = transformFormDataToUpdates(formData);
      await updateMultipleSiteContent(updates);
      setSaved(true);
      onContentUpdated();

      // Hide success message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save site content:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(transformSiteContentToFormData(content));
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <SiteContentSection
        title="Hero Section"
        description="Main title and call-to-action buttons on the home page"
        fields={[
          {
            id: "hero-title",
            label: "Main Title",
            value: formData.hero.title,
            onChange: (value) => handleInputChange("hero", "title", value),
            placeholder: "Enter main title",
          },
          {
            id: "hero-subtitle",
            label: "Subtitle",
            value: formData.hero.subtitle,
            onChange: (value) => handleInputChange("hero", "subtitle", value),
            placeholder: "Enter subtitle",
          },
          {
            id: "hero-portfolio-button",
            label: "Portfolio Button Text",
            value: formData.hero.portfolio_button,
            onChange: (value) =>
              handleInputChange("hero", "portfolio_button", value),
            placeholder: "Enter portfolio button text",
          },
          {
            id: "hero-booking-button",
            label: "Booking Button Text",
            value: formData.hero.booking_button,
            onChange: (value) =>
              handleInputChange("hero", "booking_button", value),
            placeholder: "Enter booking button text",
          },
        ]}
      />

      {/* Navigation Section */}
      <SiteContentSection
        title="Navigation"
        description="Navigation menu items and booking button"
        fields={[
          {
            id: "nav-home",
            label: "Home Link",
            value: formData.navigation.home_link,
            onChange: (value) =>
              handleInputChange("navigation", "home_link", value),
            placeholder: "Enter home link text",
          },
          {
            id: "nav-portfolio",
            label: "Portfolio Link",
            value: formData.navigation.portfolio_link,
            onChange: (value) =>
              handleInputChange("navigation", "portfolio_link", value),
            placeholder: "Enter portfolio link text",
          },
          {
            id: "nav-contact",
            label: "Contact Link",
            value: formData.navigation.contact_link,
            onChange: (value) =>
              handleInputChange("navigation", "contact_link", value),
            placeholder: "Enter contact link text",
          },
          {
            id: "nav-bookings",
            label: "Bookings Button",
            value: formData.navigation.bookings_button,
            onChange: (value) =>
              handleInputChange("navigation", "bookings_button", value),
            placeholder: "Enter bookings button text",
          },
        ]}
      />

      {/* Footer Section */}
      <SiteContentSection
        title="Footer"
        description="Footer description and copyright information"
        fields={[
          {
            id: "footer-description",
            label: "Description",
            value: formData.footer.description,
            onChange: (value) =>
              handleInputChange("footer", "description", value),
            placeholder: "Enter footer description",
          },
          {
            id: "footer-copyright",
            label: "Copyright Text",
            value: formData.footer.copyright,
            onChange: (value) =>
              handleInputChange("footer", "copyright", value),
            placeholder: "Enter copyright text",
          },
          {
            id: "footer-privacy",
            label: "Privacy Policy Link",
            value: formData.footer.privacy_link,
            onChange: (value) =>
              handleInputChange("footer", "privacy_link", value),
            placeholder: "Enter privacy policy link text",
          },
        ]}
        gridCols={1}
      />

      {/* Action Buttons */}
      <SiteContentActions
        saving={saving}
        saved={saved}
        onSave={() => void handleSave()}
        onReset={handleReset}
      />
    </div>
  );
}
