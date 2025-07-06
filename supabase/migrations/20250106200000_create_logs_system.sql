/*
  Migration: Create logs system and cleanup functionality
  Purpose:
  - Create logs table to track past client appointments and activities
  - Add function to clean up past availability slots
  - Set up proper RLS policies for logs
*/

-- ----------------------------------------------------------------------
-- 1. Create logs table
-- ----------------------------------------------------------------------
CREATE TABLE public.logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Client information
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,

  -- Appointment details
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  appointment_date date NOT NULL,
  appointment_time_start time NOT NULL,
  appointment_time_end time NOT NULL,

  -- Status and notes
  status text NOT NULL DEFAULT 'completed', -- completed, cancelled, no-show, rescheduled
  session_notes text,
  admin_notes text,

  -- Images and references
  reference_image_url text, -- Original reference image from booking
  result_images text[], -- Array of URLs for completed work photos

  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL -- Admin who created the log
);

-- Add indexes for better performance
CREATE INDEX logs_client_email_idx ON public.logs (client_email);
CREATE INDEX logs_appointment_date_idx ON public.logs (appointment_date);
CREATE INDEX logs_status_idx ON public.logs (status);
CREATE INDEX logs_created_at_idx ON public.logs (created_at);

-- Add comment for documentation
COMMENT ON TABLE public.logs IS 'Historical log of client appointments and sessions';
COMMENT ON COLUMN public.logs.status IS 'Status of the appointment: completed, cancelled, no-show, rescheduled';
COMMENT ON COLUMN public.logs.session_notes IS 'Notes about the session/appointment';
COMMENT ON COLUMN public.logs.admin_notes IS 'Private admin notes';
COMMENT ON COLUMN public.logs.reference_image_url IS 'Original reference image from booking';
COMMENT ON COLUMN public.logs.result_images IS 'Array of URLs for photos of completed work';

-- ----------------------------------------------------------------------
-- 2. Add updated_at trigger for logs
-- ----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_logs_updated_at
  BEFORE UPDATE ON public.logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------
-- 3. RLS Policies for logs
-- ----------------------------------------------------------------------
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all logs
CREATE POLICY "admin select all logs" ON public.logs
FOR SELECT TO authenticated
USING ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Allow admins to insert logs
CREATE POLICY "admin insert logs" ON public.logs
FOR INSERT TO authenticated
WITH CHECK ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Allow admins to update logs
CREATE POLICY "admin update logs" ON public.logs
FOR UPDATE TO authenticated
USING ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) )
WITH CHECK ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Allow admins to delete logs
CREATE POLICY "admin delete logs" ON public.logs
FOR DELETE TO authenticated
USING ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- ----------------------------------------------------------------------
-- 4. Function to automatically create log entries from completed appointments
-- ----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_log_from_appointment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create log entry when appointment status changes to 'completed', 'cancelled', or 'no-show'
  IF NEW.status IN ('completed', 'cancelled', 'no-show') AND
     (OLD.status IS NULL OR OLD.status NOT IN ('completed', 'cancelled', 'no-show')) THEN

    INSERT INTO public.logs (
      client_name,
      client_email,
      client_phone,
      appointment_id,
      appointment_date,
      appointment_time_start,
      appointment_time_end,
      status,
      reference_image_url,
      created_by
    ) VALUES (
      NEW.full_name,
      NEW.email,
      NEW.phone,
      NEW.id,
      NEW.date,
      NEW.time_start,
      NEW.time_end,
      NEW.status,
      NEW.image_url,
      (SELECT auth.uid()) -- Current admin user
    );
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically create logs from appointments
CREATE TRIGGER create_log_from_appointment_trigger
  AFTER UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION create_log_from_appointment();

-- ----------------------------------------------------------------------
-- 5. Function to clean up past availability slots
-- ----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION cleanup_past_availability_slots()
RETURNS TABLE(deleted_count integer) AS $$
DECLARE
  deleted_rows integer;
BEGIN
  -- Delete availability slots that are in the past and not booked
  DELETE FROM public.availabilities
  WHERE date < CURRENT_DATE
    AND is_booked = false;

  GET DIAGNOSTICS deleted_rows = ROW_COUNT;

  RETURN QUERY SELECT deleted_rows;
END;
$$ language 'plpgsql';

-- Allow admins to execute the cleanup function
GRANT EXECUTE ON FUNCTION cleanup_past_availability_slots() TO authenticated;

-- ----------------------------------------------------------------------
-- 6. Create some sample log data for testing (optional - remove in production)
-- ----------------------------------------------------------------------
-- Insert a few sample log entries for testing purposes
-- These can be removed in production
INSERT INTO public.logs (
  client_name,
  client_email,
  client_phone,
  appointment_date,
  appointment_time_start,
  appointment_time_end,
  status,
  session_notes,
  reference_image_url
) VALUES
(
  'John Smith',
  'john.smith@email.com',
  '+1-555-0123',
  '2025-01-03',
  '14:00:00',
  '16:30:00',
  'completed',
  'Completed rose tattoo on forearm. Client very happy with the result. Healing instructions provided.',
  'https://example.com/reference-rose.jpg'
),
(
  'Sarah Johnson',
  'sarah.j@email.com',
  '+1-555-0456',
  '2025-01-02',
  '10:00:00',
  '12:00:00',
  'completed',
  'Small butterfly tattoo behind ear. Quick session, great placement.',
  'https://example.com/reference-butterfly.jpg'
),
(
  'Mike Wilson',
  'mike.wilson@email.com',
  '+1-555-0789',
  '2025-01-01',
  '15:00:00',
  '15:30:00',
  'cancelled',
  'Client cancelled last minute due to illness.',
  NULL
);