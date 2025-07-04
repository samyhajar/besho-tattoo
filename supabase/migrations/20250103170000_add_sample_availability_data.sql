/*
  Migration: Add sample availability data
  Purpose: Add sample availability slots for testing the booking system
*/

-- Insert sample availability slots for the next few weeks
-- Monday through Friday, 9 AM to 5 PM slots

INSERT INTO public.availabilities (date, time_start, time_end, is_booked) VALUES
  -- This week
  ('2025-01-06', '09:00:00', '11:00:00', false),  -- Monday 9-11 AM
  ('2025-01-06', '11:30:00', '13:30:00', false),  -- Monday 11:30-1:30 PM
  ('2025-01-06', '14:00:00', '16:00:00', false),  -- Monday 2-4 PM

  ('2025-01-07', '09:00:00', '11:00:00', false),  -- Tuesday 9-11 AM
  ('2025-01-07', '11:30:00', '13:30:00', false),  -- Tuesday 11:30-1:30 PM
  ('2025-01-07', '14:00:00', '16:00:00', false),  -- Tuesday 2-4 PM

  ('2025-01-08', '09:00:00', '11:00:00', false),  -- Wednesday 9-11 AM
  ('2025-01-08', '11:30:00', '13:30:00', false),  -- Wednesday 11:30-1:30 PM
  ('2025-01-08', '14:00:00', '16:00:00', false),  -- Wednesday 2-4 PM

  ('2025-01-09', '09:00:00', '11:00:00', false),  -- Thursday 9-11 AM
  ('2025-01-09', '11:30:00', '13:30:00', false),  -- Thursday 11:30-1:30 PM
  ('2025-01-09', '14:00:00', '16:00:00', false),  -- Thursday 2-4 PM

  ('2025-01-10', '09:00:00', '11:00:00', false),  -- Friday 9-11 AM
  ('2025-01-10', '11:30:00', '13:30:00', false),  -- Friday 11:30-1:30 PM
  ('2025-01-10', '14:00:00', '16:00:00', false),  -- Friday 2-4 PM

  -- Next week
  ('2025-01-13', '09:00:00', '11:00:00', false),  -- Monday 9-11 AM
  ('2025-01-13', '11:30:00', '13:30:00', false),  -- Monday 11:30-1:30 PM
  ('2025-01-13', '14:00:00', '16:00:00', false),  -- Monday 2-4 PM

  ('2025-01-14', '09:00:00', '11:00:00', false),  -- Tuesday 9-11 AM
  ('2025-01-14', '11:30:00', '13:30:00', false),  -- Tuesday 11:30-1:30 PM
  ('2025-01-14', '14:00:00', '16:00:00', false),  -- Tuesday 2-4 PM

  ('2025-01-15', '09:00:00', '11:00:00', false),  -- Wednesday 9-11 AM
  ('2025-01-15', '11:30:00', '13:30:00', false),  -- Wednesday 11:30-1:30 PM
  ('2025-01-15', '14:00:00', '16:00:00', false),  -- Wednesday 2-4 PM

  ('2025-01-16', '09:00:00', '11:00:00', false),  -- Thursday 9-11 AM
  ('2025-01-16', '11:30:00', '13:30:00', false),  -- Thursday 11:30-1:30 PM
  ('2025-01-16', '14:00:00', '16:00:00', false),  -- Thursday 2-4 PM

  ('2025-01-17', '09:00:00', '11:00:00', false),  -- Friday 9-11 AM
  ('2025-01-17', '11:30:00', '13:30:00', false),  -- Friday 11:30-1:30 PM
  ('2025-01-17', '14:00:00', '16:00:00', false),  -- Friday 2-4 PM

  -- Week after next
  ('2025-01-20', '09:00:00', '11:00:00', false),  -- Monday 9-11 AM
  ('2025-01-20', '11:30:00', '13:30:00', false),  -- Monday 11:30-1:30 PM
  ('2025-01-20', '14:00:00', '16:00:00', false),  -- Monday 2-4 PM

  ('2025-01-21', '09:00:00', '11:00:00', false),  -- Tuesday 9-11 AM
  ('2025-01-21', '11:30:00', '13:30:00', false),  -- Tuesday 11:30-1:30 PM
  ('2025-01-21', '14:00:00', '16:00:00', false),  -- Tuesday 2-4 PM

  ('2025-01-22', '09:00:00', '11:00:00', false),  -- Wednesday 9-11 AM
  ('2025-01-22', '11:30:00', '13:30:00', false),  -- Wednesday 11:30-1:30 PM
  ('2025-01-22', '14:00:00', '16:00:00', false),  -- Wednesday 2-4 PM

  ('2025-01-23', '09:00:00', '11:00:00', false),  -- Thursday 9-11 AM
  ('2025-01-23', '11:30:00', '13:30:00', false),  -- Thursday 11:30-1:30 PM
  ('2025-01-23', '14:00:00', '16:00:00', false),  -- Thursday 2-4 PM

  ('2025-01-24', '09:00:00', '11:00:00', false),  -- Friday 9-11 AM
  ('2025-01-24', '11:30:00', '13:30:00', false),  -- Friday 11:30-1:30 PM
  ('2025-01-24', '14:00:00', '16:00:00', false);  -- Friday 2-4 PM