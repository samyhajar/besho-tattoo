import { createClient } from "@/lib/supabase/browser-client";
import {
  SiteContent,
  SiteContentUpdate,
  SiteContentFormData,
} from "@/types/site-content";

export async function getSiteContent(): Promise<SiteContent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("page, section, field_name");

  if (error) {
    throw new Error(`Failed to fetch site content: ${error.message}`);
  }

  return data || [];
}

export async function getSiteContentByPage(
  page: string,
): Promise<SiteContent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("page", page)
    .order("section, field_name");

  if (error) {
    throw new Error(
      `Failed to fetch site content for page ${page}: ${error.message}`,
    );
  }

  return data || [];
}

export async function updateSiteContent(
  update: SiteContentUpdate,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc("update_site_content", {
    p_page: update.page,
    p_section: update.section,
    p_field_name: update.field_name,
    p_content: update.content,
  });

  if (error) {
    throw new Error(`Failed to update site content: ${error.message}`);
  }
}

export async function updateMultipleSiteContent(
  updates: SiteContentUpdate[],
): Promise<void> {
  const supabase = createClient();

  // Update each field individually since we don't have a batch update function
  for (const update of updates) {
    const { error } = await supabase.rpc("update_site_content", {
      p_page: update.page,
      p_section: update.section,
      p_field_name: update.field_name,
      p_content: update.content,
    });

    if (error) {
      throw new Error(`Failed to update site content: ${error.message}`);
    }
  }
}

export function transformSiteContentToFormData(
  content: SiteContent[],
): SiteContentFormData {
  const formData: SiteContentFormData = {
    hero: {
      title: "",
      subtitle: "",
      description: "",
      portfolio_button: "",
      booking_button: "",
    },
    about: {
      title: "",
      intro: "",
      description: "",
      services_title: "",
      services: "",
      appointments_title: "",
      appointments_text: "",
      seo_title: "",
      seo_description: "",
      seo_portfolio: "",
      seo_conclusion: "",
    },
    contact: {
      address: "",
      phone: "",
      email: "",
      hours: "",
      social_media: "",
      image_url: "",
    },
  };

  content.forEach((item) => {
    if (item.page === "home" && item.section === "hero") {
      formData.hero[item.field_name as keyof typeof formData.hero] =
        item.content;
    } else if (item.page === "home" && item.section === "about") {
      formData.about[item.field_name as keyof typeof formData.about] =
        item.content;
    } else if (item.page === "contact" && item.section === "info") {
      formData.contact[item.field_name as keyof typeof formData.contact] =
        item.content;
    }
  });

  return formData;
}

export function transformFormDataToUpdates(
  formData: SiteContentFormData,
): SiteContentUpdate[] {
  const updates: SiteContentUpdate[] = [];

  // Hero section
  Object.entries(formData.hero).forEach(([field_name, content]) => {
    updates.push({
      page: "home",
      section: "hero",
      field_name,
      content,
    });
  });

  // About section
  Object.entries(formData.about).forEach(([field_name, content]) => {
    updates.push({
      page: "home",
      section: "about",
      field_name,
      content,
    });
  });

  // Contact section
  Object.entries(formData.contact).forEach(([field_name, content]) => {
    updates.push({
      page: "contact",
      section: "info",
      field_name,
      content,
    });
  });

  return updates;
}
