import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type Availability =
  Database['public']['Tables']['availabilities']['Row'];

export interface CreateAppointmentParams {
  full_name: string;
  email: string;
  date: string; // ISO date yyyy-mm-dd
  time_start: string; // HH:mm:ss
  time_end: string; // HH:mm:ss
  notes?: string;
  image_url?: string; // For uploaded tattoo reference images
}

export interface CreatePublicAppointmentParams {
  full_name: string;
  email: string;
  phone?: string;
  availability_id: string;
  notes?: string;
  image_url?: string;
}

/**
 * Fetches available time slots for public booking
 * Only returns slots that are not booked and are in the future
 */
export async function fetchAvailableSlots(
  startDate?: string,
  endDate?: string,
): Promise<Availability[]> {
  const supabase = createClient();

  let query = supabase
    .from('availabilities')
    .select('*')
    .eq('is_booked', false)
    .gte('date', new Date().toISOString().split('T')[0]) // Only future dates
    .order('date', { ascending: true })
    .order('time_start', { ascending: true });

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Availability[];
}

/**
 * Creates a public appointment booking (no authentication required)
 */
export async function createPublicAppointment(
  params: CreatePublicAppointmentParams,
): Promise<Appointment> {
  const supabase = createClient();

  // First, get the availability details
  const { data: availability, error: availabilityError } = await supabase
    .from('availabilities')
    .select('*')
    .eq('id', params.availability_id)
    .eq('is_booked', false)
    .single();

  if (availabilityError) throw availabilityError;
  if (!availability) throw new Error('Time slot is no longer available');

  // Create the appointment
  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments')
    .insert([
      {
        full_name: params.full_name,
        email: params.email,
        phone: params.phone ?? null,
        date: availability.date,
        time_start: availability.time_start,
        time_end: availability.time_end,
        notes: params.notes ?? null,
        image_url: params.image_url ?? null,
        status: 'pending',
        user_id: null, // Public booking, no user_id
      },
    ])
    .select()
    .single();

  if (appointmentError) throw appointmentError;

  // Mark the availability as booked
  const { error: updateError } = await supabase
    .from('availabilities')
    .update({ is_booked: true })
    .eq('id', params.availability_id);

  if (updateError) throw updateError;

  return appointment as Appointment;
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

/**
 * Fetches all appointments for admin dashboard
 * Only works for authenticated admin users
 */
export async function fetchAllAppointments(): Promise<Appointment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true })
    .order('time_start', { ascending: true });

  if (error) throw error;
  return data as Appointment[];
}

/**
 * Fetches appointment statistics for admin dashboard
 */
export async function fetchAppointmentStats() {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];

  // Get start of current week (Monday)
  const now = new Date();
  const startOfWeek = new Date(now);
  // Calculate days to go back to Monday: (getDay() + 6) % 7
  // Monday=0 days back, Tuesday=1 day back, ..., Sunday=6 days back
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekStart = startOfWeek.toISOString().split('T')[0];

  const [
    todayResult,
    weekResult,
    pendingResult,
    completedResult,
    confirmedResult,
    cancelledResult,
    totalResult,
  ] = await Promise.all([
    // Today's appointments
    supabase.from('appointments').select('id.count()').eq('date', today),

    // This week's appointments
    supabase.from('appointments').select('id.count()').gte('date', weekStart),

    // Pending appointments
    supabase.from('appointments').select('id.count()').eq('status', 'pending'),

    // Completed appointments
    supabase
      .from('appointments')
      .select('id.count()')
      .eq('status', 'completed'),

    // Confirmed appointments
    supabase
      .from('appointments')
      .select('id.count()')
      .eq('status', 'confirmed'),

    // Cancelled appointments
    supabase
      .from('appointments')
      .select('id.count()')
      .eq('status', 'cancelled'),

    // Total appointments
    supabase.from('appointments').select('id.count()'),
  ]);

  return {
    today: todayResult.data?.[0]?.count || 0,
    thisWeek: weekResult.data?.[0]?.count || 0,
    pending: pendingResult.data?.[0]?.count || 0,
    completed: completedResult.data?.[0]?.count || 0,
    confirmed: confirmedResult.data?.[0]?.count || 0,
    cancelled: cancelledResult.data?.[0]?.count || 0,
    total: totalResult.data?.[0]?.count || 0,
  };
}

/**
 * Confirms an appointment (changes status to confirmed)
 */
export async function confirmAppointment(appointmentId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'confirmed' })
    .eq('id', appointmentId);

  if (error) throw error;
}

/**
 * Cancels an appointment with a reason and sends notification email
 * Also frees up the corresponding availability slot
 */
export async function cancelAppointment(
  appointmentId: string,
  reason: string,
): Promise<void> {
  const supabase = createClient();

  // First, get the appointment details for the email
  const { data: appointment, error: fetchError } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .single();

  if (fetchError) throw fetchError;
  if (!appointment) throw new Error('Appointment not found');

  // Update the appointment status
  const { error: updateError } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId);

  if (updateError) throw updateError;

  // Free up the corresponding availability slot
  const { error: availabilityError } = await supabase
    .from('availabilities')
    .update({ is_booked: false })
    .eq('date', appointment.date)
    .eq('time_start', appointment.time_start)
    .eq('time_end', appointment.time_end);

  if (availabilityError) {
    console.error('Error freeing up availability slot:', availabilityError);
    // Don't throw here - the appointment is already cancelled
  }

  // Send cancellation email
  try {
    const response = await fetch('/api/appointments/cancel-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appointment,
        reason,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send cancellation email');
      // Don't throw here - the appointment is already cancelled
    }
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    // Don't throw here - the appointment is already cancelled
  }
}

/**
 * Generates a signed URL for appointment reference images
 * Only works for authenticated users (admin)
 */
export async function getAppointmentImageSignedUrl(
  imagePath: string,
  expiresIn: number = 3600, // 1 hour default
): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from('tattoosappointment')
    .createSignedUrl(imagePath, expiresIn);

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }

  return data.signedUrl;
}
