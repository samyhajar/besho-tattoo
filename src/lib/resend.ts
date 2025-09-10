import { Resend } from "resend";

// Initialize Resend client only on server side
const getResendClient = () => {
  if (typeof window !== "undefined") {
    throw new Error("Resend client cannot be used on the client side");
  }
  return new Resend(process.env.RESEND_API_KEY);
};

// Email templates and types
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AppointmentData {
  customer_name: string;
  customer_email: string;
  appointment_date: string;
  appointment_time: string;
  phone?: string;
  notes?: string;
  google_meet_link?: string;
  appointment_id?: string;
}

// Email templates
const createContactFormEmail = (data: ContactFormData): EmailData => ({
  to: process.env.ADMIN_EMAIL || "samy.hajar@gmail.com",
  subject: `🎨 Besho Tattoo Studio - Contact Form: ${data.subject}`,
  replyTo: data.email,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #555;">Contact Details:</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Subject:</strong> ${data.subject}</p>
      </div>

      <div style="background: #fff; padding: 20px; border-left: 4px solid #000; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #555;">Message:</h3>
        <p style="line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          This message was sent from the Besho Tattoo Studio contact form.
        </p>
      </div>
    </div>
  `,
});

const createBookingConfirmationEmail = (data: AppointmentData): EmailData => ({
  to: data.customer_email,
  subject: "🎨 Besho Tattoo Studio - Booking Confirmation - Thank You!",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
        Booking Confirmation - Thank You!
      </h2>

      <p>Hi ${data.customer_name}!</p>

      <p>Thank you for booking your tattoo appointment with Besho Tattoo Studio. We're excited to work with you!</p>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #555;">Appointment Details:</h3>
        <p><strong>Date:</strong> ${data.appointment_date}</p>
        <p><strong>Time:</strong> ${data.appointment_time}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
        ${data.google_meet_link ? `<p><strong>Google Meet:</strong> <a href="${data.google_meet_link}">Join Meeting</a></p>` : ""}
      </div>

      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h4 style="margin-top: 0; color: #856404;">What's Next?</h4>
        <p style="margin-bottom: 0; color: #856404;">
          We'll review your booking and send you a confirmation email within 24 hours.
          If you have any questions, please don't hesitate to reach out!
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          Besho Tattoo Studio<br>
          Thank you for choosing us!
        </p>
      </div>
    </div>
  `,
});

const createAdminNotificationEmail = (data: AppointmentData): EmailData => ({
  to: process.env.ADMIN_EMAIL || "samy.hajar@gmail.com",
  subject: "🎨 Besho Tattoo Studio - New Appointment Booking!",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
        New Appointment Booking!
      </h2>

      <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h4 style="margin-top: 0; color: #155724;">New booking received!</h4>
        <p style="margin-bottom: 0; color: #155724;">
          A new appointment has been booked and requires your confirmation.
        </p>
      </div>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #555;">Customer Details:</h3>
        <p><strong>Name:</strong> ${data.customer_name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.customer_email}">${data.customer_email}</a></p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        ${data.appointment_id ? `<p><strong>Appointment ID:</strong> ${data.appointment_id}</p>` : ""}
      </div>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #555;">Appointment Details:</h3>
        <p><strong>Date:</strong> ${data.appointment_date}</p>
        <p><strong>Time:</strong> ${data.appointment_time}</p>
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
        ${data.google_meet_link ? `<p><strong>Google Meet:</strong> <a href="${data.google_meet_link}">Join Meeting</a></p>` : ""}
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          Please log into your dashboard to confirm this appointment.
        </p>
      </div>
    </div>
  `,
});

const createAppointmentConfirmationEmail = (
  data: AppointmentData,
): EmailData => ({
  to: data.customer_email,
  subject: "🎨 Besho Tattoo Studio - Appointment CONFIRMED - Ready to Tattoo!",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
        Appointment CONFIRMED - Ready to Tattoo! 🎉
      </h2>

      <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h4 style="margin-top: 0; color: #155724;">Great news ${data.customer_name}!</h4>
        <p style="margin-bottom: 0; color: #155724;">
          Your tattoo appointment has been CONFIRMED and we're excited to work with you!
        </p>
      </div>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #555;">Confirmed Appointment Details:</h3>
        <p><strong>Date:</strong> ${data.appointment_date}</p>
        <p><strong>Time:</strong> ${data.appointment_time}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
        ${data.google_meet_link ? `<p><strong>Google Meet:</strong> <a href="${data.google_meet_link}">Join Meeting</a></p>` : ""}
      </div>

      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h4 style="margin-top: 0; color: #856404;">Important Reminders:</h4>
        <ul style="color: #856404; margin-bottom: 0;">
          <li>Please arrive 10 minutes before your appointment time</li>
          <li>Bring a valid ID and any reference images you'd like to discuss</li>
          <li>Stay hydrated and get a good night's sleep before your appointment</li>
          <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          We can't wait to create something amazing with you!<br>
          Besho Tattoo Studio
        </p>
      </div>
    </div>
  `,
});

// Email sending functions
export const sendEmail = async (emailData: EmailData) => {
  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from:
        emailData.from || "Besho Tattoo Studio <noreply@thinkbeforeyouink.art>",
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
      replyTo: emailData.replyTo,
    });

    console.log("✅ Email sent successfully:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return { success: false, error };
  }
};

// Specific email functions
export const sendContactForm = async (data: ContactFormData) => {
  const emailData = createContactFormEmail(data);
  return await sendEmail(emailData);
};

export const sendBookingConfirmation = async (data: AppointmentData) => {
  const emailData = createBookingConfirmationEmail(data);
  return await sendEmail(emailData);
};

export const sendAdminNotification = async (data: AppointmentData) => {
  const emailData = createAdminNotificationEmail(data);
  return await sendEmail(emailData);
};

export const sendAppointmentConfirmation = async (data: AppointmentData) => {
  const emailData = createAppointmentConfirmationEmail(data);
  return await sendEmail(emailData);
};

// Utility functions (keeping the same interface as the old emailjs.ts)
export const initEmailJS = () => {
  console.log("📧 Resend email service initialized");
};

// Format date for email display
export const formatEmailDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format time for email display
export const formatEmailTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};
