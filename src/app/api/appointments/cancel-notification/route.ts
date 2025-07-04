import { NextRequest, NextResponse } from "next/server";
import type { Appointment } from "@/services/appointments";

export async function POST(request: NextRequest) {
  try {
    const requestData = (await request.json()) as {
      appointment: Appointment;
      reason: string;
    };
    const { appointment, reason } = requestData;

    // For now, we'll just log the email details
    // In a real implementation, you'd integrate with an email service like SendGrid, Resend, etc.

    const formatDate = (dateStr: string): string => {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const formatTime = (timeStr: string): string => {
      const [hours, minutes] = timeStr.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    const emailContent = {
      to: appointment.email,
      subject: "Appointment Cancellation - Besho Tattoo Studio",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin-bottom: 10px;">Besho Tattoo Studio</h1>
            <h2 style="color: #dc2626; margin: 0;">Appointment Cancelled</h2>
          </div>

          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0; color: #991b1b;">
              <strong>We regret to inform you that your appointment has been cancelled.</strong>
            </p>
          </div>

          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">Appointment Details:</h3>
            <p style="margin: 5px 0; color: #374151;"><strong>Name:</strong> ${appointment.full_name}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Date:</strong> ${formatDate(appointment.date)}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Time:</strong> ${formatTime(appointment.time_start)} - ${formatTime(appointment.time_end)}</p>
            ${appointment.notes ? `<p style="margin: 5px 0; color: #374151;"><strong>Notes:</strong> ${appointment.notes}</p>` : ""}
          </div>

          <div style="background-color: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">Cancellation Reason:</h3>
            <p style="margin: 0; color: #92400e;">${reason}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; margin-bottom: 15px;">
              We apologize for any inconvenience this may cause.
              If you would like to reschedule, please feel free to book a new appointment.
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/contact"
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Book New Appointment
            </a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Best regards,<br>
              Besho Tattoo Studio Team
            </p>
          </div>
        </div>
      `,
      text: `
Appointment Cancellation - Besho Tattoo Studio

We regret to inform you that your appointment has been cancelled.

Appointment Details:
- Name: ${appointment.full_name}
- Date: ${formatDate(appointment.date)}
- Time: ${formatTime(appointment.time_start)} - ${formatTime(appointment.time_end)}
${appointment.notes ? `- Notes: ${appointment.notes}` : ""}

Cancellation Reason:
${reason}

We apologize for any inconvenience this may cause. If you would like to reschedule, please feel free to book a new appointment at: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/contact

Best regards,
Besho Tattoo Studio Team
      `.trim(),
    };

    // Log the email content for now
    console.log("=== CANCELLATION EMAIL ===");
    console.log("To:", emailContent.to);
    console.log("Subject:", emailContent.subject);
    console.log("Content:", emailContent.text);
    console.log("========================");

    // TODO: Integrate with actual email service
    // Example for Resend:
    // const { data, error } = await resend.emails.send(emailContent);
    // if (error) throw error;

    // Example for SendGrid:
    // await sgMail.send(emailContent);

    return NextResponse.json({
      success: true,
      message: "Cancellation email logged (email service not configured)",
      emailPreview: emailContent.text,
    });
  } catch (error) {
    console.error("Error in cancel-notification API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send cancellation email" },
      { status: 500 },
    );
  }
}
