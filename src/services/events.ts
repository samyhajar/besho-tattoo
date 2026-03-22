import { createClient } from "@/lib/supabase/browser-client";
import type { Database } from "@/types/supabase";
import type { Event, EventMutationInput } from "@/types/event";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeEvent(row: EventRow): Event {
  return row;
}

function sortEvents(events: Event[]) {
  return [...events].sort((left, right) => {
    if (left.event_date !== right.event_date) {
      return left.event_date.localeCompare(right.event_date);
    }

    if (left.display_order !== right.display_order) {
      return left.display_order - right.display_order;
    }

    if (left.created_at !== right.created_at) {
      return left.created_at.localeCompare(right.created_at);
    }

    return left.id.localeCompare(right.id);
  });
}

export function isPastEvent(event: Pick<Event, "event_date">) {
  return event.event_date < getTodayDateString();
}

export function formatEventDate(eventDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${eventDate}T00:00:00`));
}

export async function fetchAllEvents(): Promise<Event[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return sortEvents((data || []).map(normalizeEvent));
}

export async function fetchUpcomingPublishedEvents(
  limit = 2,
): Promise<Event[]> {
  const supabase = createClient();
  const today = getTodayDateString();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch upcoming events: ${error.message}`);
  }

  return sortEvents((data || []).map(normalizeEvent)).slice(0, limit);
}

export async function createEvent(input: EventMutationInput): Promise<Event> {
  const supabase = createClient();
  const insert: EventInsert = {
    title: input.title.trim(),
    event_date: input.event_date,
    location: input.location.trim(),
    redirect_url: input.redirect_url,
    is_published: input.is_published,
    display_order: input.display_order,
  };

  const { data, error } = await supabase
    .from("events")
    .insert(insert)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return normalizeEvent(data);
}

export async function updateEvent(
  id: string,
  input: EventMutationInput,
): Promise<Event> {
  const supabase = createClient();
  const update: EventUpdate = {
    title: input.title.trim(),
    event_date: input.event_date,
    location: input.location.trim(),
    redirect_url: input.redirect_url,
    is_published: input.is_published,
    display_order: input.display_order,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("events")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return normalizeEvent(data);
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

export async function setEventPublished(
  id: string,
  isPublished: boolean,
): Promise<Event> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .update({
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update event visibility: ${error.message}`);
  }

  return normalizeEvent(data);
}
