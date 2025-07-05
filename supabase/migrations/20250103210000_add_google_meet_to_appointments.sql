-- Migration: Add Google Meet integration to appointments
-- Purpose: Add fields for Google Meet session management

-- Add Google Meet fields to appointments table
ALTER TABLE public.appointments
ADD COLUMN google_meet_link text,
ADD COLUMN google_meet_event_id text,
ADD COLUMN google_meet_space_id text,
ADD COLUMN google_meet_created_at timestamptz;

-- Add index for efficient lookups
CREATE INDEX appointments_google_meet_event_idx ON public.appointments (google_meet_event_id);

-- Add comment for documentation
COMMENT ON COLUMN public.appointments.google_meet_link IS 'Google Meet session URL for the appointment';
COMMENT ON COLUMN public.appointments.google_meet_event_id IS 'Google Calendar event ID associated with the Meet session';
COMMENT ON COLUMN public.appointments.google_meet_space_id IS 'Google Meet space ID for advanced meeting management';
COMMENT ON COLUMN public.appointments.google_meet_created_at IS 'Timestamp when the Google Meet session was created';