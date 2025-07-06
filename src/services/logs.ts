import { createClient } from '@/lib/supabase/browser-client';
import type { Database } from '@/types/supabase';
import type { LogsStats, LogsFilters } from '@/types/logs';

// Use Supabase generated types
type LogRow = Database['public']['Tables']['logs']['Row'];
type LogInsert = Database['public']['Tables']['logs']['Insert'];
type LogUpdate = Database['public']['Tables']['logs']['Update'];

/**
 * Fetch all logs with optional filtering
 */
export async function fetchLogs(filters?: LogsFilters): Promise<LogRow[]> {
  const supabase = createClient<Database>();

  let query = supabase
    .from('logs')
    .select('*')
    .order('appointment_date', { ascending: false })
    .order('appointment_time_start', { ascending: false });

  // Apply filters
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.client_email) {
    query = query.ilike('client_email', `%${filters.client_email}%`);
  }

  if (filters?.date_from) {
    query = query.gte('appointment_date', filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte('appointment_date', filters.date_to);
  }

  if (filters?.search) {
    // Search in client name, email, session notes, or admin notes
    query = query.or(
      `client_name.ilike.%${filters.search}%,client_email.ilike.%${filters.search}%,session_notes.ilike.%${filters.search}%,admin_notes.ilike.%${filters.search}%`,
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * Get a single log by ID
 */
export async function fetchLogById(id: string): Promise<LogRow | null> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data;
}

/**
 * Create a new log entry
 */
export async function createLog(logData: LogInsert): Promise<LogRow> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from('logs')
    .insert([logData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing log entry
 */
export async function updateLog(
  id: string,
  updateData: LogUpdate,
): Promise<LogRow> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from('logs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a log entry
 */
export async function deleteLog(id: string): Promise<void> {
  const supabase = createClient<Database>();

  const { error } = await supabase.from('logs').delete().eq('id', id);

  if (error) throw error;
}

/**
 * Get logs statistics
 */
export async function getLogsStats(): Promise<LogsStats> {
  const supabase = createClient<Database>();

  // Get all logs for calculations
  const { data: logs, error } = await supabase
    .from('logs')
    .select('status, appointment_date, created_at');

  if (error) throw error;

  const logsData = logs || [];
  const total = logsData.length;
  const completed = logsData.filter((log) => log.status === 'completed').length;
  const cancelled = logsData.filter((log) => log.status === 'cancelled').length;
  const no_show = logsData.filter((log) => log.status === 'no-show').length;

  // Calculate this month and this week
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

  const this_month = logsData.filter(
    (log) => new Date(log.appointment_date) >= startOfMonth,
  ).length;

  const this_week = logsData.filter(
    (log) => new Date(log.appointment_date) >= startOfWeek,
  ).length;

  return {
    total,
    completed,
    cancelled,
    no_show,
    this_month,
    this_week,
  };
}

/**
 * Get logs for a specific client by email
 */
export async function getClientLogs(clientEmail: string): Promise<LogRow[]> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('client_email', clientEmail)
    .order('appointment_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Clean up past availability slots
 */
export async function cleanupPastAvailabilitySlots(): Promise<number> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase.rpc('cleanup_past_availability_slots');

  if (error) throw error;

  // The function returns an array with one object containing deleted_count
  return data?.[0]?.deleted_count || 0;
}

/**
 * Get recent activity (last 10 logs)
 */
export async function getRecentActivity(): Promise<LogRow[]> {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data || [];
}

/**
 * Search logs by various criteria
 */
export async function searchLogs(searchTerm: string): Promise<LogRow[]> {
  return fetchLogs({ search: searchTerm });
}

// Export types for use in components
export type { LogRow, LogInsert, LogUpdate };
