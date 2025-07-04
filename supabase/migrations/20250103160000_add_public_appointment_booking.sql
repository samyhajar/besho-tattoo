/*
  Migration: Add public appointment booking support
  Purpose:
  - Add image_url column to appointments table for reference images
  - Update RLS policies to allow anonymous users to create appointments
  - Add phone column to appointments table
*/

-- Add image_url column to appointments table
ALTER TABLE public.appointments
ADD COLUMN image_url text;

-- Add phone column to appointments table
ALTER TABLE public.appointments
ADD COLUMN phone text;

-- Update RLS policies to allow anonymous users to create appointments
-- First, drop existing policies
DROP POLICY IF EXISTS "user select own appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin select all appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin update appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin delete appointments" ON public.appointments;

-- Create new policies
-- Allow users to view their own appointments (authenticated users only)
CREATE POLICY "user select own appointments" ON public.appointments
FOR SELECT TO authenticated
USING ( user_id = (SELECT auth.uid()) );

-- Allow admins to view all appointments
CREATE POLICY "admin select all appointments" ON public.appointments
FOR SELECT TO authenticated
USING ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Allow anonymous users to create appointments (for public booking)
CREATE POLICY "anonymous insert appointments" ON public.appointments
FOR INSERT TO anon
WITH CHECK ( user_id IS NULL );

-- Allow authenticated users to create appointments for themselves
CREATE POLICY "user insert own appointments" ON public.appointments
FOR INSERT TO authenticated
WITH CHECK ( user_id = (SELECT auth.uid()) );

-- Allow admins to create appointments for anyone
CREATE POLICY "admin insert appointments" ON public.appointments
FOR INSERT TO authenticated
WITH CHECK ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Allow admins to update appointments
CREATE POLICY "admin update appointments" ON public.appointments
FOR UPDATE TO authenticated
USING ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) )
WITH CHECK ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Allow admins to delete appointments
CREATE POLICY "admin delete appointments" ON public.appointments
FOR DELETE TO authenticated
USING ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Update availabilities policies to allow anonymous users to view available slots
-- First, drop existing policies
DROP POLICY IF EXISTS "public select open slots" ON public.availabilities;
DROP POLICY IF EXISTS "admin select all availabilities" ON public.availabilities;
DROP POLICY IF EXISTS "admin insert availabilities" ON public.availabilities;
DROP POLICY IF EXISTS "admin update availabilities" ON public.availabilities;
DROP POLICY IF EXISTS "admin delete availabilities" ON public.availabilities;

-- Create new policies
-- Allow anonymous and authenticated users to view available slots
CREATE POLICY "public select open slots" ON public.availabilities
FOR SELECT TO anon, authenticated
USING ( is_booked = false );

-- Allow admins to view all availabilities
CREATE POLICY "admin select all availabilities" ON public.availabilities
FOR SELECT TO authenticated
USING ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Allow admins to insert availabilities
CREATE POLICY "admin insert availabilities" ON public.availabilities
FOR INSERT TO authenticated
WITH CHECK ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Allow admins to update availabilities
CREATE POLICY "admin update availabilities" ON public.availabilities
FOR UPDATE TO authenticated
USING ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) )
WITH CHECK ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Allow anonymous users to update availabilities (for booking slots)
-- This is needed for the booking system to mark slots as booked
CREATE POLICY "anonymous update booking status" ON public.availabilities
FOR UPDATE TO anon
USING ( is_booked = false )
WITH CHECK ( is_booked = true );

-- Allow admins to delete availabilities
CREATE POLICY "admin delete availabilities" ON public.availabilities
FOR DELETE TO authenticated
USING ( (SELECT is_admin FROM public.profiles WHERE id = (SELECT auth.uid())) );

-- Add comment to explain the new columns
COMMENT ON COLUMN public.appointments.image_url IS 'URL of reference image uploaded by client';
COMMENT ON COLUMN public.appointments.phone IS 'Client phone number for contact';