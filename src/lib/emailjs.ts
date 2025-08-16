// Formspree Configuration - Simple email service
const FORMSPREE_URL =
  process.env.NEXT_PUBLIC_FORMSPREE_URL ||
  'https://formspree.io/f/YOUR_FORM_ID';

// Simple email sending function
const sendEmail = async (data: {
  type: 'contact' | 'booking' | 'admin-notification' | 'confirmation';
  subject: string;
  recipient?: string;
  [key: string]: unknown;
}) => {
  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _subject: `🎨 Besho Tattoo Studio - ${data.subject}`,
        _replyto: data.email || data.customer_email || data.from_email,
        email_type: data.type,
        recipient: data.recipient || 'admin',
        ...data,
      }),
    });

    if (response.ok) {
      console.log(`✅ ${data.type} email sent successfully via Formspree`);
      return { success: true };
    } else {
      console.error(`❌ Failed to send ${data.type} email via Formspree`);
      return { success: false, error: 'Failed to send email' };
    }
      } catch (error) {
      console.error(`❌ Error sending ${data.type} email:`, error);
      return { success: false, error };
    }
};

// No initialization needed for Formspree
export const initEmailJS = () => {
  console.log('📧 Using Formspree - no initialization required');
};

// Send booking confirmation email to customer
export const sendBookingConfirmation = async (appointmentData: {
  customer_name: string;
  customer_email: string;
  appointment_date: string;
  appointment_time: string;
  phone?: string;
  notes?: string;
  google_meet_link?: string;
}) => {
  return await sendEmail({
    type: 'booking',
    subject: 'Booking Confirmation - Thank You!',
    recipient: 'customer',
    customer_name: appointmentData.customer_name,
    customer_email: appointmentData.customer_email,
    appointment_date: appointmentData.appointment_date,
    appointment_time: appointmentData.appointment_time,
    phone: appointmentData.phone || 'Not provided',
    notes: appointmentData.notes || 'None',
    google_meet_link:
      appointmentData.google_meet_link || 'Will be provided later',
    message: `Hi ${appointmentData.customer_name}! Your tattoo appointment has been booked for ${appointmentData.appointment_date} at ${appointmentData.appointment_time}. We'll confirm your appointment soon!`,
  });
};

// Send admin notification email
export const sendAdminNotification = async (appointmentData: {
  customer_name: string;
  customer_email: string;
  appointment_date: string;
  appointment_time: string;
  phone?: string;
  notes?: string;
  google_meet_link?: string;
  appointment_id: string;
}) => {
  return await sendEmail({
    type: 'admin-notification',
    subject: 'New Appointment Booking!',
    recipient: 'admin',
    customer_name: appointmentData.customer_name,
    customer_email: appointmentData.customer_email,
    appointment_date: appointmentData.appointment_date,
    appointment_time: appointmentData.appointment_time,
    phone: appointmentData.phone || 'Not provided',
    notes: appointmentData.notes || 'None',
    google_meet_link: appointmentData.google_meet_link || 'Not created yet',
    appointment_id: appointmentData.appointment_id,
    message: `New appointment booking from ${appointmentData.customer_name} (${appointmentData.customer_email}) for ${appointmentData.appointment_date} at ${appointmentData.appointment_time}. Please confirm this appointment in your dashboard.`,
  });
};

// Send appointment confirmation email (when admin confirms)
export const sendAppointmentConfirmation = async (appointmentData: {
  customer_name: string;
  customer_email: string;
  appointment_date: string;
  appointment_time: string;
  phone?: string;
  notes?: string;
  google_meet_link?: string;
}) => {
  return await sendEmail({
    type: 'confirmation',
    subject: 'Appointment CONFIRMED - Ready to Tattoo!',
    recipient: 'customer',
    customer_name: appointmentData.customer_name,
    customer_email: appointmentData.customer_email,
    appointment_date: appointmentData.appointment_date,
    appointment_time: appointmentData.appointment_time,
    phone: appointmentData.phone || 'Not provided',
    notes: appointmentData.notes || 'None',
    google_meet_link:
      appointmentData.google_meet_link || 'Will be provided later',
    confirmation_status: 'CONFIRMED',
    message: `Great news ${appointmentData.customer_name}! Your tattoo appointment for ${appointmentData.appointment_date} at ${appointmentData.appointment_time} has been CONFIRMED. We're excited to work with you!`,
  });
};

// Send contact form email
export const sendContactForm = async (contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  return await sendEmail({
    type: 'contact',
    subject: `Contact Form: ${contactData.subject}`,
    recipient: 'admin',
    from_name: contactData.name,
    from_email: contactData.email,
    contact_subject: contactData.subject,
    message: contactData.message,
    email: contactData.email, // For reply-to functionality
  });
};

// Format date for email display
export const formatEmailDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format time for email display
export const formatEmailTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};
