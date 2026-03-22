import { createAdminClient } from "@/lib/supabase/admin";
import HomePageClient, {
  type HomeHeroContent,
} from "@/components/home/HomePageClient";
import type { Event } from "@/types/event";
import type { SiteContent } from "@/types/site-content";

export const dynamic = "force-dynamic";

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getContentByField(
  content: SiteContent[],
  page: string,
  section: string,
  fieldName: string,
) {
  const item = content.find(
    (entry) =>
      entry.page === page &&
      entry.section === section &&
      entry.field_name === fieldName,
  );

  return item?.content || "";
}

function getHeroContent(content: SiteContent[]): HomeHeroContent {
  return {
    title: getContentByField(content, "home", "hero", "title"),
    subtitle: getContentByField(content, "home", "hero", "subtitle"),
    description: getContentByField(content, "home", "hero", "description"),
    portfolioButton: getContentByField(
      content,
      "home",
      "hero",
      "portfolio_button",
    ),
    bookingButton: getContentByField(content, "home", "hero", "booking_button"),
  };
}

async function loadHeroContent() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("page", { ascending: true })
    .order("section", { ascending: true })
    .order("field_name", { ascending: true });

  if (error) {
    console.error("Error loading hero content:", error.message);
    return getHeroContent([]);
  }

  return getHeroContent(data || []);
}

async function loadUpcomingEvents(): Promise<Event[]> {
  const supabase = createAdminClient();
  const today = getTodayDateString();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(6);

  if (error) {
    console.error("Error loading upcoming events:", error.message);
    return [];
  }

  return data || [];
}

export default async function HomePage() {
  const [heroContent, upcomingEvents] = await Promise.all([
    loadHeroContent(),
    loadUpcomingEvents(),
  ]);

  return (
    <HomePageClient heroContent={heroContent} upcomingEvents={upcomingEvents} />
  );
}
