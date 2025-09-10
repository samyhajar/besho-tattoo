import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";
import {
  sendBookingConfirmation,
  sendAdminNotification,
  formatEmailDate,
  formatEmailTime,
} from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      availability_id,
      full_name,
      email,
      phone,
      notes,
      image_url,
      create_google_meet = false,
    } = body;

    if (!availability_id || !full_name || !email) {
      return NextResponse.json(
        { error: "Missing required fields: availability_id, full_name, email" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // First, get the availability details
    const { data: availability, error: availabilityError } = await supabase
      .from("availabilities")
      .select("*")
      .eq("id", availability_id)
      .eq("is_booked", false)
      .single();

    if (availabilityError || !availability) {
      return NextResponse.json(
        { error: "Availability slot not found or already booked" },
        { status: 404 },
      );
    }

    // Create the appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        full_name: full_name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        date: availability.date,
        time_start: availability.time_start,
        time_end: availability.time_end,
        notes: notes?.trim() || null,
        image_url: image_url || null,
        status: "pending",
        google_meet_link: null, // Will be created later if needed
      })
      .select()
      .single();

    if (appointmentError) {
      console.error("Appointment creation error:", appointmentError);
      return NextResponse.json(
        { error: "Failed to create appointment" },
        { status: 500 },
      );
    }

    // Send confirmation emails
    try {
      const formattedDate = formatEmailDate(appointment.date);
      const formattedTime = `${formatEmailTime(appointment.time_start)} - ${formatEmailTime(appointment.time_end)}`;

      // Send confirmation email to customer
      const customerEmailResult = await sendBookingConfirmation({
        customer_name: appointment.full_name,
        customer_email: appointment.email,
        appointment_date: formattedDate,
        appointment_time: formattedTime,
        phone: appointment.phone || undefined,
        notes: appointment.notes || undefined,
        google_meet_link: appointment.google_meet_link || undefined,
      });

      // Send notification email to admin
      const adminEmailResult = await sendAdminNotification({
        customer_name: appointment.full_name,
        customer_email: appointment.email,
        appointment_date: formattedDate,
        appointment_time: formattedTime,
        phone: appointment.phone || undefined,
        notes: appointment.notes || undefined,
        google_meet_link: appointment.google_meet_link || undefined,
        appointment_id: appointment.id,
      });

      console.log("✅ Booking emails sent:", {
        customer: customerEmailResult.success,
        admin: adminEmailResult.success,
      });
    } catch (emailError) {
      // Don't fail the booking if email sending fails
      console.warn(
        "⚠️ Email sending failed, but appointment was still created:",
        emailError,
      );
    }

    // Mark the availability as booked
    const { error: updateError } = await supabase
      .from("availabilities")
      .update({ is_booked: true })
      .eq("id", availability_id);

    if (updateError) {
      console.warn("⚠️ Failed to mark availability as booked:", updateError);
    }

    return NextResponse.json({
      success: true,
      appointment,
      message: "Appointment created successfully",
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
