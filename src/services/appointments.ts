import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

export type Appointment = Database['public']['Tables']['appointments']['Row'];

export interface CreateAppointmentParams {
  full_name: string;
  email: string;
  date: string; // ISO date yyyy-mm-dd
  time_start: string; // HH:mm:ss
  time_end: string; // HH:mm:ss
  notes?: string;
}

/**
 * Creates an appointment for the currently authenticated user.
 * Throws if the user is not authenticated or on any Supabase error.
 */
export async function createAppointment(
  params: CreateAppointmentParams,
): Promise<Appointment> {
  const supabase = createClient();
  // Ensure we have a logged-in user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        user_id: user.id,
        full_name: params.full_name,
        email: params.email,
        date: params.date,
        time_start: params.time_start,
        time_end: params.time_end,
        notes: params.notes ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Appointment;
}

/**
 * Returns appointments belonging to the authenticated user.
 */
export async function fetchMyAppointments(): Promise<Appointment[]> {
  const supabase = createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Appointment[];
}
