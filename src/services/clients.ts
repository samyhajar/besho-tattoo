import { createClient } from '@/lib/supabase/browser-client';

export interface Client {
  email: string;
  full_name: string;
  phone?: string;
  appointment_count: number;
  last_appointment: string | null;
  first_appointment: string | null;
  appointment_statuses: string[];
  total_spent: number;
}

export interface ClientDetail extends Client {
  appointments: Array<{
    id: string;
    date: string;
    time_start: string;
    time_end: string;
    status: string;
    notes?: string;
    created_at: string;
  }>;
}

/**
 * Fetches all clients with their appointment statistics
 * Aggregates data from the appointments table
 */
export async function fetchAllClients(): Promise<Client[]> {
  const supabase = createClient();

  // Get all appointments with client information
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Group appointments by client email and aggregate statistics
  const clientMap = new Map<string, Client>();

  appointments.forEach((appointment) => {
    const key = appointment.email;

    if (!clientMap.has(key)) {
      clientMap.set(key, {
        email: appointment.email,
        full_name: appointment.full_name,
        phone: appointment.phone || undefined,
        appointment_count: 0,
        last_appointment: null,
        first_appointment: null,
        appointment_statuses: [],
        total_spent: 0,
      });
    }

    const client = clientMap.get(key)!;
    client.appointment_count++;

    // Track unique statuses
    if (!client.appointment_statuses.includes(appointment.status)) {
      client.appointment_statuses.push(appointment.status);
    }

    // Update first/last appointment dates
    const appointmentDate = appointment.date;
    if (
      !client.first_appointment ||
      appointmentDate < client.first_appointment
    ) {
      client.first_appointment = appointmentDate;
    }
    if (!client.last_appointment || appointmentDate > client.last_appointment) {
      client.last_appointment = appointmentDate;
    }
  });

  // Convert map to array and sort by appointment count (descending)
  return Array.from(clientMap.values()).sort(
    (a, b) => b.appointment_count - a.appointment_count,
  );
}

/**
 * Fetches detailed information for a specific client
 * Including all their appointments
 */
export async function fetchClientDetails(
  email: string,
): Promise<ClientDetail | null> {
  const supabase = createClient();

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('email', email)
    .order('date', { ascending: false });

  if (error) throw error;
  if (!appointments || appointments.length === 0) return null;

  // Get unique statuses
  const uniqueStatuses = [...new Set(appointments.map((a) => a.status))];

  // Calculate statistics
  const client: ClientDetail = {
    email: appointments[0].email,
    full_name: appointments[0].full_name,
    phone: appointments[0].phone || undefined,
    appointment_count: appointments.length,
    last_appointment: appointments[0].date, // Already sorted desc
    first_appointment: appointments[appointments.length - 1].date,
    appointment_statuses: uniqueStatuses,
    total_spent: 0, // TODO: Calculate from orders if needed
    appointments: appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      time_start: appointment.time_start,
      time_end: appointment.time_end,
      status: appointment.status,
      notes: appointment.notes || undefined,
      created_at: appointment.created_at,
    })),
  };

  return client;
}

/**
 * Searches clients by name or email
 */
export async function searchClients(query: string): Promise<Client[]> {
  const supabase = createClient();

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('*')
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Group and aggregate similar to fetchAllClients
  const clientMap = new Map<string, Client>();

  appointments.forEach((appointment) => {
    const key = appointment.email;

    if (!clientMap.has(key)) {
      clientMap.set(key, {
        email: appointment.email,
        full_name: appointment.full_name,
        phone: appointment.phone || undefined,
        appointment_count: 0,
        last_appointment: null,
        first_appointment: null,
        appointment_statuses: [],
        total_spent: 0,
      });
    }

    const client = clientMap.get(key)!;
    client.appointment_count++;

    if (!client.appointment_statuses.includes(appointment.status)) {
      client.appointment_statuses.push(appointment.status);
    }

    const appointmentDate = appointment.date;
    if (
      !client.first_appointment ||
      appointmentDate < client.first_appointment
    ) {
      client.first_appointment = appointmentDate;
    }
    if (!client.last_appointment || appointmentDate > client.last_appointment) {
      client.last_appointment = appointmentDate;
    }
  });

  return Array.from(clientMap.values()).sort(
    (a, b) => b.appointment_count - a.appointment_count,
  );
}
