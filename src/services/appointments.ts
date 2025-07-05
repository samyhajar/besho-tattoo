import { createClient } from "@/lib/supabase/browser-client";
import { Database } from "@/types/supabase";

export type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export type Availability =
  Database["public"]["Tables"]["availabilities"]["Row"];

export interface CreateAppointmentParams {
  full_name: string;
  email: string;
  date: string; // ISO date yyyy-mm-dd
  time_start: string; // HH:mm:ss
  time_end: string; // HH:mm:ss
  notes?: string;
  image_url?: string; // For uploaded tattoo reference images
  create_google_meet?: boolean; // Whether to create a Google Meet session
}

export interface CreatePublicAppointmentParams {
  full_name: string;
  email: string;
  phone?: string;
  availability_id: string;
  notes?: string;
  image_url?: string;
  create_google_meet?: boolean; // Whether to create a Google Meet session
}

/**
 * Fetches available time slots for public booking
 * Only returns slots that are not booked and are in the future
 */
export async function fetchAvailableSlots(
  startDate?: string,
  endDate?: string,
): Promise<Availability[]> {
  const supabase = createClient();

  let query = supabase
    .from("availabilities")
    .select("*")
    .eq("is_booked", false)
    .gte("date", new Date().toISOString().split("T")[0]) // Only future dates
    .order("date", { ascending: true })
    .order("time_start", { ascending: true });

  if (startDate) {
    query = query.gte("date", startDate);
  }

  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Availability[];
}

/**
 * Creates a public appointment booking (no authentication required)
 */
export async function createPublicAppointment(
  params: CreatePublicAppointmentParams,
): Promise<Appointment> {
  console.log(
    "📝 Creating public appointment with params:",
    JSON.stringify(params, null, 2),
  );

  let supabase;
  try {
    console.log("🔧 Creating Supabase client...");
    supabase = createClient();
    console.log("✅ Supabase client created successfully");
  } catch (clientError) {
    console.error("❌ Failed to create Supabase client:", clientError);
    console.error(
      "❌ Client error details:",
      JSON.stringify(clientError, Object.getOwnPropertyNames(clientError)),
    );
    throw new Error(
      `Failed to create database client: ${clientError instanceof Error ? clientError.message : "Unknown error"}`,
    );
  }

  try {
    // First, get the availability details
    console.log("🔍 Fetching availability slot:", params.availability_id);
    console.log("🔍 About to call supabase.from(availabilities)...");

    const availabilityQuery = supabase
      .from("availabilities")
      .select("*")
      .eq("id", params.availability_id)
      .eq("is_booked", false);

    console.log("🔍 Query built, executing...");
    const { data: availability, error: availabilityError } =
      await availabilityQuery.single();

    console.log("🔍 Query completed. Results:");
    console.log("  - Data:", availability);
    console.log("  - Error:", availabilityError);
    console.log("  - Error type:", typeof availabilityError);
    console.log(
      "  - Error details:",
      JSON.stringify(
        availabilityError,
        Object.getOwnPropertyNames(availabilityError || {}),
      ),
    );

    if (availabilityError) {
      console.error("❌ Availability fetch error:", availabilityError);
      console.error(
        "❌ Availability error serialized:",
        JSON.stringify(
          availabilityError,
          Object.getOwnPropertyNames(availabilityError),
        ),
      );
      throw new Error(
        `Availability fetch failed: ${availabilityError.message || JSON.stringify(availabilityError)}`,
      );
    }
    if (!availability) {
      console.error("❌ Availability slot not found or already booked");
      throw new Error("Time slot is no longer available");
    }

    console.log(
      "✅ Availability slot found:",
      JSON.stringify(availability, null, 2),
    );

    // Create the appointment
    console.log("💾 Creating appointment record...");
    const appointmentData = {
      full_name: params.full_name,
      email: params.email,
      phone: params.phone ?? null,
      date: availability.date,
      time_start: availability.time_start,
      time_end: availability.time_end,
      notes: params.notes ?? null,
      image_url: params.image_url ?? null,
      status: "pending",
      user_id: null, // Public booking, no user_id
    };

    console.log(
      "💾 Appointment data to insert:",
      JSON.stringify(appointmentData, null, 2),
    );

    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert([appointmentData])
      .select()
      .single();

    console.log("💾 Appointment insert completed. Results:");
    console.log("  - Data:", appointment);
    console.log("  - Error:", appointmentError);
    console.log("  - Error type:", typeof appointmentError);
    console.log(
      "  - Error details:",
      JSON.stringify(
        appointmentError,
        Object.getOwnPropertyNames(appointmentError || {}),
      ),
    );

    if (appointmentError) {
      console.error("❌ Appointment creation error:", appointmentError);
      console.error(
        "❌ Appointment error serialized:",
        JSON.stringify(
          appointmentError,
          Object.getOwnPropertyNames(appointmentError),
        ),
      );
      throw new Error(
        `Appointment creation failed: ${appointmentError.message || JSON.stringify(appointmentError)}`,
      );
    }

    console.log(
      "✅ Appointment created:",
      JSON.stringify(appointment, null, 2),
    );

    // Automatically create Google Meet session for the new appointment
    console.log("📹 Creating Google Meet session...");
    try {
      // Call our API endpoint to create Google Meet session
      // The server will check if configuration is available
      const response = await fetch("/api/appointments/google-meet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          create_google_meet: true,
        }),
      });

      if (response.ok) {
        const meetData = (await response.json()) as {
          meetLink?: string;
          eventId?: string;
          spaceId?: string;
        };
        console.log(
          "✅ Google Meet session created automatically:",
          meetData.meetLink,
        );

        // Update the appointment with Google Meet information
        appointment.google_meet_link = meetData.meetLink || null;
        appointment.google_meet_event_id = meetData.eventId || null;
        appointment.google_meet_space_id = meetData.spaceId || null;
      } else {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        console.warn(
          "⚠️ Failed to create Google Meet session automatically:",
          errorData.error || "Unknown error",
        );
      }
    } catch (error) {
      // Don't fail the booking if Google Meet creation fails
      console.warn(
        "⚠️ Google Meet creation failed, but appointment was still created:",
        error,
      );
    }

    // Mark the availability as booked
    console.log("🔒 Marking availability slot as booked...");
    const { error: updateError } = await supabase
      .from("availabilities")
      .update({ is_booked: true })
      .eq("id", params.availability_id);

    console.log("🔒 Update availability completed. Results:");
    console.log("  - Error:", updateError);
    console.log("  - Error type:", typeof updateError);
    console.log(
      "  - Error details:",
      JSON.stringify(
        updateError,
        Object.getOwnPropertyNames(updateError || {}),
      ),
    );

    if (updateError) {
      console.error("❌ Error marking availability as booked:", updateError);
      console.error(
        "❌ Update error serialized:",
        JSON.stringify(updateError, Object.getOwnPropertyNames(updateError)),
      );
      throw new Error(
        `Failed to mark slot as booked: ${updateError.message || JSON.stringify(updateError)}`,
      );
    }

    console.log("✅ Availability slot marked as booked");
    console.log("🎉 Public appointment creation completed successfully!");
    return appointment as Appointment;
  } catch (error) {
    console.error("❌ Error in createPublicAppointment:", error);
    console.error("❌ Error type:", typeof error);
    console.error("❌ Error instanceof Error:", error instanceof Error);
    console.error(
      "❌ Error name:",
      error instanceof Error ? error.name : "N/A",
    );
    console.error(
      "❌ Error message:",
      error instanceof Error ? error.message : "N/A",
    );
    console.error(
      "❌ Error stack:",
      error instanceof Error ? error.stack : "N/A",
    );
    console.error(
      "❌ Error serialized:",
      JSON.stringify(error, Object.getOwnPropertyNames(error || {})),
    );

    // Re-throw with more details
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        `Unknown error type: ${typeof error} - ${JSON.stringify(error)}`,
      );
    }
  }
}

/**
 * Creates an appointment for the currently authenticated user.
 * Throws if the user is not authenticated or on any Supabase error.
 */
export async function createAppointment(
  params: CreateAppointmentParams,
): Promise<Appointment> {
  const supabase = createClient();
  // Ensure we have a logged-in user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error("No authenticated user");

  const { data, error } = await supabase
    .from("appointments")
    .insert([
      {
        user_id: user.id,
        full_name: params.full_name,
        email: params.email,
        date: params.date,
        time_start: params.time_start,
        time_end: params.time_end,
        notes: params.notes ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Appointment;
}

/**
 * Returns appointments belonging to the authenticated user.
 */
export async function fetchMyAppointments(): Promise<Appointment[]> {
  const supabase = createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error("No authenticated user");

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Appointment[];
}

/**
 * Fetches all appointments for admin dashboard
 * Only works for authenticated admin users
 */
export async function fetchAllAppointments(): Promise<Appointment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("date", { ascending: true })
    .order("time_start", { ascending: true });

  if (error) throw error;
  return data as Appointment[];
}

/**
 * Fetches appointment statistics for admin dashboard
 */
export async function fetchAppointmentStats() {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  // Get start of current week (Monday)
  const now = new Date();
  const startOfWeek = new Date(now);
  // Calculate days to go back to Monday: (getDay() + 6) % 7
  // Monday=0 days back, Tuesday=1 day back, ..., Sunday=6 days back
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekStart = startOfWeek.toISOString().split("T")[0];

  // Fetch all appointments and count client-side
  const { data: allAppointments, error } = await supabase
    .from("appointments")
    .select("id, date, status");

  if (error) {
    console.error("Error fetching appointment stats:", error);
    return {
      today: 0,
      thisWeek: 0,
      pending: 0,
      completed: 0,
      confirmed: 0,
      cancelled: 0,
      total: 0,
    };
  }

  const appointments = allAppointments || [];

  return {
    today: appointments.filter((apt) => apt.date === today).length,
    thisWeek: appointments.filter((apt) => apt.date >= weekStart).length,
    pending: appointments.filter((apt) => apt.status === "pending").length,
    completed: appointments.filter((apt) => apt.status === "completed").length,
    confirmed: appointments.filter((apt) => apt.status === "confirmed").length,
    cancelled: appointments.filter((apt) => apt.status === "cancelled").length,
    total: appointments.length,
  };
}

/**
 * Confirms an appointment (changes status to confirmed)
 */
export async function confirmAppointment(appointmentId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("appointments")
    .update({ status: "confirmed" })
    .eq("id", appointmentId);

  if (error) throw error;
}

/**
 * Cancels an appointment with a reason and sends notification email
 * Also frees up the corresponding availability slot
 */
export async function cancelAppointment(
  appointmentId: string,
  reason: string,
): Promise<void> {
  const supabase = createClient();

  // First, get the appointment details for the email
  const { data: appointment, error: fetchError } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", appointmentId)
    .single();

  if (fetchError) throw fetchError;
  if (!appointment) throw new Error("Appointment not found");

  // Update the appointment status
  const { error: updateError } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId);

  if (updateError) throw updateError;

  // Free up the corresponding availability slot
  const { error: availabilityError } = await supabase
    .from("availabilities")
    .update({ is_booked: false })
    .eq("date", appointment.date)
    .eq("time_start", appointment.time_start)
    .eq("time_end", appointment.time_end);

  if (availabilityError) {
    console.error("Error freeing up availability slot:", availabilityError);
    // Don't throw here - the appointment is already cancelled
  }

  // Send cancellation email
  try {
    const response = await fetch("/api/appointments/cancel-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointment,
        reason,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send cancellation email");
      // Don't throw here - the appointment is already cancelled
    }
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    // Don't throw here - the appointment is already cancelled
  }
}

/**
 * Generates a signed URL for appointment reference images
 * Only works for authenticated users (admin)
 */
export async function getAppointmentImageSignedUrl(
  imagePath: string,
  expiresIn: number = 3600, // 1 hour default
): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from("tattoosappointment")
    .createSignedUrl(imagePath, expiresIn);

  if (error) {
    console.error("Error creating signed URL:", error);
    return null;
  }

  return data.signedUrl;
}

/**
 * Creates a Google Meet session for an appointment
 */
export async function createGoogleMeetForAppointment(
  appointmentId: string,
): Promise<{ meetLink: string; eventId: string; spaceId?: string }> {
  const response = await fetch("/api/appointments/google-meet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appointmentId }),
  });

  if (!response.ok) {
    const error = (await response.json()) as { error?: string };
    throw new Error(error.error || "Failed to create Google Meet session");
  }

  return response.json() as Promise<{
    meetLink: string;
    eventId: string;
    spaceId?: string;
  }>;
}

/**
 * Updates a Google Meet session for an appointment
 */
export async function updateGoogleMeetForAppointment(
  appointmentId: string,
  updateData: {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    attendeeEmails?: string[];
  },
): Promise<void> {
  const response = await fetch("/api/appointments/google-meet", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appointmentId, ...updateData }),
  });

  if (!response.ok) {
    const error = (await response.json()) as { error?: string };
    throw new Error(error.error || "Failed to update Google Meet session");
  }
}

/**
 * Deletes a Google Meet session for an appointment
 */
export async function deleteGoogleMeetForAppointment(
  appointmentId: string,
): Promise<void> {
  const response = await fetch("/api/appointments/google-meet", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appointmentId }),
  });

  if (!response.ok) {
    const error = (await response.json()) as { error?: string };
    throw new Error(error.error || "Failed to delete Google Meet session");
  }
}
