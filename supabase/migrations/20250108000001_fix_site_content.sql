/*
  Migration: Fix site_content table structure
  Purpose: Drop and recreate the site_content table with correct constraints
*/

-- Drop the existing table if it exists
drop table if exists public.site_content cascade;

-- Recreate the table with correct structure
create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section text not null,
  field_name text not null,
  content text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id),
  
  -- Ensure unique combination of page, section, and field_name
  unique(page, section, field_name)
);
comment on table public.site_content is 'Site content management for editable text fields across pages.';

-- Create index for efficient lookups
create index site_content_page_section_idx on public.site_content (page, section);

-- Insert default content for home page
insert into public.site_content (page, section, field_name, content) values
-- Hero Section
('home', 'hero', 'title', 'Crafting Sacred Letters'),
('home', 'hero', 'subtitle', 'For Your Journey'),
('home', 'hero', 'portfolio_button', 'View Portfolio'),
('home', 'hero', 'booking_button', 'Book Appointment'),

-- Navigation
('navigation', 'header', 'home_link', 'Home'),
('navigation', 'header', 'portfolio_link', 'Portfolio'),
('navigation', 'header', 'contact_link', 'Contact'),
('navigation', 'header', 'bookings_button', 'Bookings'),

-- Footer
('footer', 'main', 'description', 'Professional tattoo studio dedicated to creating unique, high-quality tattoos that tell your story.'),
('footer', 'main', 'copyright', '© Mhanna Letters Berlin - Germany 2025'),
('footer', 'main', 'privacy_link', 'Privacy Policy');

-- Enable RLS
alter table public.site_content enable row level security;

-- Allow public read access to site content
create policy "Public can view site content" on public.site_content
  for select using (true);

-- Only admins can insert, update, or delete site content
create policy "Admins can manage site content" on public.site_content
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Create the update function
create or replace function public.update_site_content(
  p_page text,
  p_section text,
  p_field_name text,
  p_content text
)
returns void
language plpgsql
security definer
as $$
begin
  -- Ensure user is admin
  if not exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.is_admin = true
  ) then
    raise exception 'Only admins can update site content';
  end if;

  -- Update or insert content
  insert into public.site_content (page, section, field_name, content, updated_by)
  values (p_page, p_section, p_field_name, p_content, auth.uid())
  on conflict (page, section, field_name)
  do update set
    content = excluded.content,
    updated_at = now(),
    updated_by = auth.uid();
end;
$$;

-- Grant execute permission to authenticated users (function will check admin status)
grant execute on function public.update_site_content to authenticated;
