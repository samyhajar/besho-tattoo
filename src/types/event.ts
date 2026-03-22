import type { Database } from "@/types/supabase";

export type Event = Database["public"]["Tables"]["events"]["Row"];

export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

export type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

export interface EventFormData {
  title: string;
  event_date: string;
  location: string;
  redirect_url: string;
  is_published: boolean;
  display_order: string;
}

export interface EventMutationInput {
  title: string;
  event_date: string;
  location: string;
  redirect_url: string | null;
  is_published: boolean;
  display_order: number;
}
