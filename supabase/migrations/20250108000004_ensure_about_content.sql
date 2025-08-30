/*
  Migration: Ensure About Me content exists
  Purpose: Insert About Me section content if it doesn't already exist
*/

-- Insert About Me section content (only if not exists)
insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'title', 'About Me'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'title'
);

insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'intro', 'I create tattoos that connect history and modern art. My work is inspired by Arabic calligraphy, Mesopotamian symbols, and ancient traditions, combined with the clean elegance of fine line tattooing.'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'intro'
);

insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'description', 'Every piece is custom made – from minimal fine lines to freehand drawings, from old school & new school blends to detailed cover-ups. I also offer unique smile tattoos and creative designs that flow naturally with your body.'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'description'
);

insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'services_title', 'What I Offer'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'services_title'
);

insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'services', '• Fine Line Tattoos – modern, minimal, timeless.\n• Arabic & Mesopotamian-Inspired Art – cultural depth, ancient meaning.\n• Creative Freehand Designs – drawn directly for you, one of a kind.\n• Cover-Ups – transforming old ink into new art.\n• Smile Tattoos & Special Requests – playful details, personal symbols.'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'services'
);

insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'appointments_title', 'Appointments Only'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'appointments_title'
);

insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'appointments_text', 'Every tattoo is personal. That''s why I work only by appointment – to give you time, attention, and a design that''s truly yours.'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'appointments_text'
);

insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'seo_title', 'Looking for a fine line tattoo artist in Vienna who specializes in Arabic tattoos, Mesopotamian-inspired tattoos, and custom creative designs?'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'seo_title'
);

insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'seo_description', 'I offer exclusive, appointment-based tattoos that combine ancient traditions with modern fine line art.'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'seo_description'
);

insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'seo_portfolio', 'My portfolio includes:\n• Arabic calligraphy tattoos\n• Mesopotamian civilization tattoos\n• Fine line minimal tattoos\n• Cover-up tattoos\n• Old school & new school creative blends\n• Smile tattoos and freehand ideas'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'seo_portfolio'
);

insert into public.site_content (page, section, field_name, content) 
select 'home', 'about', 'seo_conclusion', 'Every tattoo is unique – designed to tell your story through lines, symbols, and culture. Book your session and let''s create something timeless together.'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'about' and field_name = 'seo_conclusion'
);

-- Insert hero description if not exists
insert into public.site_content (page, section, field_name, content) 
select 'home', 'hero', 'description', 'Create your unique story with custom tattoos that blend ancient traditions with modern artistry. From fine line designs to cultural symbols, every piece is crafted with precision and meaning.'
where not exists (
  select 1 from public.site_content 
  where page = 'home' and section = 'hero' and field_name = 'description'
);
