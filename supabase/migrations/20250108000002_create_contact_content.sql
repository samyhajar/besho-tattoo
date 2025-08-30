/*
  Migration: Add contact page content management
  Purpose: Extends site_content table with contact page fields
*/

-- Insert contact page content
insert into public.site_content (page, section, field_name, content) values
-- Contact Page Header
('contact', 'header', 'title', 'Get in Touch'),
('contact', 'header', 'description', 'Have questions about our work or want to discuss a potential project? We''d love to hear from you.'),

-- Contact Information
('contact', 'info', 'address', 'TBA'),
('contact', 'info', 'phone', 'TBA'),
('contact', 'info', 'email', 'TBA'),
('contact', 'info', 'hours', 'TBA'),
('contact', 'info', 'social_media', 'TBA'),

-- Contact Form
('contact', 'form', 'title', 'Send a Message'),
('contact', 'form', 'name_label', 'Name'),
('contact', 'form', 'name_placeholder', 'Your full name'),
('contact', 'form', 'email_label', 'Email'),
('contact', 'form', 'email_placeholder', 'your.email@example.com'),
('contact', 'form', 'subject_label', 'Subject'),
('contact', 'form', 'subject_placeholder', 'What''s this about?'),
('contact', 'form', 'message_label', 'Message'),
('contact', 'form', 'message_placeholder', 'Tell us about your project or question...'),
('contact', 'form', 'submit_button', 'Send Message'),
('contact', 'form', 'sending_text', 'Sending...'),
('contact', 'form', 'success_title', 'Message sent successfully! 🎉'),
('contact', 'form', 'success_message', 'Thank you for reaching out. We''ll get back to you soon!'),
('contact', 'form', 'error_title', 'Unable to send message'),
('contact', 'form', 'error_message', 'Failed to send message. Please try again or contact us directly.'),

-- Contact Form Footer Note
('contact', 'form', 'appointment_note', '💡 For tattoo appointments: Please use our booking system for faster scheduling.');
