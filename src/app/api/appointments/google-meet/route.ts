import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-client";
import {
  createGoogleMeetSession,
  updateGoogleMeetSession,
  deleteGoogleMeetSession,
  getGoogleMeetConfig,
} from "@/lib/google-meet";
import {
  createSimpleGoogleMeetSession,
  getSimpleMeetConfig,
} from "@/lib/google-meet-simple";

// POST /api/appointments/google-meet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, create_google_meet } = body;

    if (!appointmentId || !create_google_meet) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Get appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Check if Google Meet already exists
    if (appointment.google_meet_link) {
      return NextResponse.json(
        { error: "Google Meet session already exists for this appointment" },
        { status: 409 },
      );
    }

    // Try to determine which method to use based on available environment variables
    const hasOAuthConfig =
      process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

    const hasServiceAccountConfig =
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
      process.env.GOOGLE_DELEGATED_USER_EMAIL;

    let meetSession;

    if (hasOAuthConfig) {
      // Use OAuth method (simpler setup)
      console.log("Using OAuth method for Google Meet");
      const config = getSimpleMeetConfig();

      meetSession = await createSimpleGoogleMeetSession(
        {
          title: `Tattoo Appointment - ${appointment.full_name}`,
          description: `Tattoo appointment scheduled for ${appointment.date} at ${appointment.time_start}`,
          startTime: new Date(
            `${appointment.date}T${appointment.time_start}`,
          ).toISOString(),
          endTime: new Date(
            `${appointment.date}T${appointment.time_end}`,
          ).toISOString(),
          attendeeEmails: [appointment.email].filter(Boolean),
          timeZone: "America/New_York",
        },
        config,
      );
    } else if (hasServiceAccountConfig) {
      // Use service account method (domain-wide delegation)
      console.log("Using service account method for Google Meet");
      const config = getGoogleMeetConfig();

      meetSession = await createGoogleMeetSession(
        {
          title: `Tattoo Appointment - ${appointment.full_name}`,
          description: `Tattoo appointment scheduled for ${appointment.date} at ${appointment.time_start}`,
          startTime: new Date(
            `${appointment.date}T${appointment.time_start}`,
          ).toISOString(),
          endTime: new Date(
            `${appointment.date}T${appointment.time_end}`,
          ).toISOString(),
          attendeeEmails: [appointment.email].filter(Boolean),
          timeZone: "America/New_York",
        },
        config,
      );
    } else {
      return NextResponse.json(
        {
          error:
            "Google Meet configuration not found. Please set up either OAuth or Service Account credentials.",
          details:
            "Check GOOGLE_MEET_SETUP.md or GOOGLE_MEET_SETUP_SIMPLE.md for setup instructions",
        },
        { status: 500 },
      );
    }

    // Update appointment with Google Meet information
    const { error: updateError } = await supabase
      .from("appointments")
      .update({
        google_meet_link: meetSession.meetLink,
        google_meet_event_id: meetSession.eventId,
        google_meet_space_id: meetSession.spaceId || null,
        google_meet_created_at: new Date().toISOString(),
      })
      .eq("id", appointmentId);

    if (updateError) {
      console.error(
        "Error updating appointment with Google Meet info:",
        updateError,
      );
      return NextResponse.json(
        { error: "Failed to update appointment with Google Meet information" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      meetLink: meetSession.meetLink,
      eventId: meetSession.eventId,
      spaceId: meetSession.spaceId,
    });
  } catch (error) {
    console.error("Error creating Google Meet session:", error);
    return NextResponse.json(
      {
        error: "Failed to create Google Meet session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// PATCH /api/appointments/google-meet
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, update_google_meet } = body;

    if (!appointmentId || !update_google_meet) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Get appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    if (!appointment.google_meet_event_id) {
      return NextResponse.json(
        { error: "No Google Meet session found for this appointment" },
        { status: 404 },
      );
    }

    // Determine which method to use
    const hasOAuthConfig =
      process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

    const hasServiceAccountConfig =
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
      process.env.GOOGLE_DELEGATED_USER_EMAIL;

    if (hasServiceAccountConfig) {
      // Use service account method (OAuth method doesn't have separate update function)
      const config = getGoogleMeetConfig();

      await updateGoogleMeetSession(
        appointment.google_meet_event_id,
        {
          title: `Tattoo Appointment - ${appointment.full_name}`,
          description: `Updated tattoo appointment scheduled for ${appointment.date} at ${appointment.time_start}`,
          startTime: new Date(
            `${appointment.date}T${appointment.time_start}`,
          ).toISOString(),
          endTime: new Date(
            `${appointment.date}T${appointment.time_end}`,
          ).toISOString(),
          attendeeEmails: [appointment.email].filter(Boolean),
          timeZone: "America/New_York",
        },
        config,
      );
    } else if (hasOAuthConfig) {
      // For OAuth method, we can't easily update, so we inform the user
      return NextResponse.json({
        success: true,
        message:
          "Google Meet session update requested. Please manually update the calendar event if needed.",
        meetLink: appointment.google_meet_link,
      });
    } else {
      return NextResponse.json(
        { error: "Google Meet configuration not found" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      meetLink: appointment.google_meet_link,
      eventId: appointment.google_meet_event_id,
    });
  } catch (error) {
    console.error("Error updating Google Meet session:", error);
    return NextResponse.json(
      {
        error: "Failed to update Google Meet session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/appointments/google-meet
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Missing appointmentId" },
        { status: 400 },
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Get appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    if (!appointment.google_meet_event_id) {
      return NextResponse.json(
        { error: "No Google Meet session found for this appointment" },
        { status: 404 },
      );
    }

    // Determine which method to use
    const hasOAuthConfig =
      process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

    const hasServiceAccountConfig =
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY &&
      process.env.GOOGLE_DELEGATED_USER_EMAIL;

    if (hasServiceAccountConfig) {
      // Use service account method
      const config = getGoogleMeetConfig();
      await deleteGoogleMeetSession(appointment.google_meet_event_id, config);
    } else if (hasOAuthConfig) {
      // For OAuth method, we can't easily delete, so we inform the user
      console.log("OAuth method: Cannot automatically delete calendar event");
    } else {
      return NextResponse.json(
        { error: "Google Meet configuration not found" },
        { status: 500 },
      );
    }

    // Clear Google Meet information from appointment
    const { error: updateError } = await supabase
      .from("appointments")
      .update({
        google_meet_link: null,
        google_meet_event_id: null,
        google_meet_space_id: null,
        google_meet_created_at: null,
      })
      .eq("id", appointmentId);

    if (updateError) {
      console.error(
        "Error clearing Google Meet info from appointment:",
        updateError,
      );
      return NextResponse.json(
        { error: "Failed to clear Google Meet information from appointment" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: hasOAuthConfig
        ? "Google Meet session cleared from appointment. Please manually delete the calendar event if needed."
        : "Google Meet session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Google Meet session:", error);
    return NextResponse.json(
      {
        error: "Failed to delete Google Meet session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
