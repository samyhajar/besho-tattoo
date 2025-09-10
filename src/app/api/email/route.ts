import { NextRequest, NextResponse } from "next/server";
import {
  sendContactForm,
  sendBookingConfirmation,
  sendAdminNotification,
  sendAppointmentConfirmation,
  type ContactFormData,
  type AppointmentData,
} from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing required fields: type and data" },
        { status: 400 },
      );
    }

    let result;

    switch (type) {
      case "contact":
        result = await sendContactForm(data as ContactFormData);
        break;

      case "booking-confirmation":
        result = await sendBookingConfirmation(data as AppointmentData);
        break;

      case "admin-notification":
        result = await sendAdminNotification(data as AppointmentData);
        break;

      case "appointment-confirmation":
        result = await sendAppointmentConfirmation(data as AppointmentData);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 },
        );
    }

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      console.error("Email sending failed:", result.error);
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
