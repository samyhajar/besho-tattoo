/*
  Migration: Add Contact Information content
  Purpose: Insert contact information content for the contact page
*/

-- Insert Contact Information content (only if not exists)
insert into public.site_content (page, section, field_name, content) 
select 'contact', 'info', 'address', 'Vienna, Austria\nBy appointment only'
where not exists (
  select 1 from public.site_content 
  where page = 'contact' and section = 'info' and field_name = 'address'
);

insert into public.site_content (page, section, field_name, content) 
select 'contact', 'info', 'phone', '+43 123 456 789'
where not exists (
  select 1 from public.site_content 
  where page = 'contact' and section = 'info' and field_name = 'phone'
);

insert into public.site_content (page, section, field_name, content) 
select 'contact', 'info', 'email', 'info@beshotattoo.com'
where not exists (
  select 1 from public.site_content 
  where page = 'contact' and section = 'info' and field_name = 'email'
);

insert into public.site_content (page, section, field_name, content) 
select 'contact', 'info', 'hours', 'By appointment only\nTuesday - Saturday'
where not exists (
  select 1 from public.site_content 
  where page = 'contact' and section = 'info' and field_name = 'hours'
);

insert into public.site_content (page, section, field_name, content) 
select 'contact', 'info', 'social_media', '@beshotattoo'
where not exists (
  select 1 from public.site_content 
  where page = 'contact' and section = 'info' and field_name = 'social_media'
);
