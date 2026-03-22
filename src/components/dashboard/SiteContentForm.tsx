"use client";

import { useState } from "react";
import { SiteContent, SiteContentFormData } from "@/types/site-content";
import {
  transformSiteContentToFormData,
  transformFormDataToUpdates,
  updateMultipleSiteContent,
} from "@/services/site-content";
import { SiteContentActions } from "@/components/dashboard/SiteContentActions";
import { HeroSection } from "@/components/dashboard/SiteContentHeroSection";
import { AboutSection } from "@/components/dashboard/SiteContentAboutSection";
import { ContactSection } from "@/components/dashboard/SiteContentContactSection";
import { SeoSection } from "@/components/dashboard/SiteContentSeoSection";

interface SiteContentFormProps {
  content: SiteContent[];
  onContentUpdated: () => void;
  mode?: "all" | "contact";
}

export function SiteContentForm({
  content,
  onContentUpdated,
  mode = "all",
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
      const updates = transformFormDataToUpdates(formData).filter((update) =>
        mode === "contact" ? update.page === "contact" : true,
      );
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
      {mode === "all" ? (
        <>
          <HeroSection formData={formData} onInputChange={handleInputChange} />
          <AboutSection formData={formData} onInputChange={handleInputChange} />
        </>
      ) : null}

      <ContactSection formData={formData} onInputChange={handleInputChange} />

      {mode === "all" ? (
        <SeoSection formData={formData} onInputChange={handleInputChange} />
      ) : null}

      <SiteContentActions
        saving={saving}
        saved={saved}
        onSave={() => void handleSave()}
        onReset={handleReset}
      />
    </div>
  );
}
