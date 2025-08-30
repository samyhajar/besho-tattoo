/*
  Migration: Add About Me section content
  Purpose: Add the About Me section content for the home page
*/

-- Insert About Me section content
insert into public.site_content (page, section, field_name, content) values
-- About Me Section
('home', 'about', 'title', 'About Me'),
('home', 'about', 'intro', 'I create tattoos that connect history and modern art. My work is inspired by Arabic calligraphy, Mesopotamian symbols, and ancient traditions, combined with the clean elegance of fine line tattooing.'),
('home', 'about', 'description', 'Every piece is custom made – from minimal fine lines to freehand drawings, from old school & new school blends to detailed cover-ups. I also offer unique smile tattoos and creative designs that flow naturally with your body.'),
('home', 'about', 'services_title', 'What I Offer'),
('home', 'about', 'services', '• Fine Line Tattoos – modern, minimal, timeless.\n• Arabic & Mesopotamian-Inspired Art – cultural depth, ancient meaning.\n• Creative Freehand Designs – drawn directly for you, one of a kind.\n• Cover-Ups – transforming old ink into new art.\n• Smile Tattoos & Special Requests – playful details, personal symbols.'),
('home', 'about', 'appointments_title', 'Appointments Only'),
('home', 'about', 'appointments_text', 'Every tattoo is personal. That\'s why I work only by appointment – to give you time, attention, and a design that\'s truly yours.'),
('home', 'about', 'seo_title', 'Looking for a fine line tattoo artist in Vienna who specializes in Arabic tattoos, Mesopotamian-inspired tattoos, and custom creative designs?'),
('home', 'about', 'seo_description', 'I offer exclusive, appointment-based tattoos that combine ancient traditions with modern fine line art.'),
('home', 'about', 'seo_portfolio', 'My portfolio includes:\n• Arabic calligraphy tattoos\n• Mesopotamian civilization tattoos\n• Fine line minimal tattoos\n• Cover-up tattoos\n• Old school & new school creative blends\n• Smile tattoos and freehand ideas'),
('home', 'about', 'seo_conclusion', 'Every tattoo is unique – designed to tell your story through lines, symbols, and culture. Book your session and let\'s create something timeless together.');

-- Update hero section to include description field for rich text
insert into public.site_content (page, section, field_name, content) values
('home', 'hero', 'description', 'Create your unique story with custom tattoos that blend ancient traditions with modern artistry. From fine line designs to cultural symbols, every piece is crafted with precision and meaning.');

-- Update existing hero content to be more focused
update public.site_content 
set content = 'Crafting Sacred Letters'
where page = 'home' and section = 'hero' and field_name = 'title';

update public.site_content 
set content = 'Where Ancient Traditions Meet Modern Art'
where page = 'home' and section = 'hero' and field_name = 'subtitle';
