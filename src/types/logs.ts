export interface Log {
  id: string;
  // Client information
  client_name: string;
  client_email: string;
  client_phone?: string | null;

  // Appointment details
  appointment_id?: string | null;
  appointment_date: string; // Date string in YYYY-MM-DD format
  appointment_time_start: string; // Time string in HH:mm:ss format
  appointment_time_end: string; // Time string in HH:mm:ss format

  // Status and notes
  status: 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  session_notes?: string | null;
  admin_notes?: string | null;

  // Images and references
  reference_image_url?: string | null;
  result_images?: string[] | null; // Array of image URLs

  // Metadata
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  created_by?: string | null; // User ID of admin who created the log
}

export interface CreateLogRequest {
  client_name: string;
  client_email: string;
  client_phone?: string;
  appointment_date: string;
  appointment_time_start: string;
  appointment_time_end: string;
  status: Log['status'];
  session_notes?: string;
  admin_notes?: string;
  reference_image_url?: string;
  result_images?: string[];
}

export interface UpdateLogRequest {
  id: string;
  session_notes?: string;
  admin_notes?: string;
  result_images?: string[];
  status?: Log['status'];
}

export interface LogsStats {
  total: number;
  completed: number;
  cancelled: number;
  no_show: number;
  this_month: number;
  this_week: number;
}

export interface LogsFilters {
  status?: Log['status'] | 'all';
  client_email?: string;
  date_from?: string;
  date_to?: string;
  search?: string; // Search in client name, email, or notes
}
