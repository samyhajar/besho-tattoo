import { JWT } from "google-auth-library";

// Google Meet integration service
export interface GoogleMeetConfig {
  serviceAccountEmail: string;
  serviceAccountKey: string;
  delegatedUserEmail: string; // Email of the user to impersonate (admin/artist)
}

export interface GoogleMeetSession {
  meetLink: string;
  eventId: string;
  spaceId?: string;
}

export interface CreateMeetingParams {
  title: string;
  description?: string;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  attendeeEmails: string[];
  timeZone?: string;
}

interface GoogleCalendarEntryPoint {
  entryPointType?: string;
  uri?: string;
}

interface GoogleCalendarEventResponse {
  id?: string;
  hangoutLink?: string;
  conferenceData?: {
    conferenceId?: string;
    entryPoints?: GoogleCalendarEntryPoint[];
  };
}

interface GoogleCalendarApiErrorResponse {
  error?: {
    message?: string;
  };
}

interface GoogleCalendarEventUpdate {
  summary?: string;
  description?: string;
  start?: {
    dateTime: string;
    timeZone: string;
  };
  end?: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{ email: string }>;
}

/**
 * Creates a Google Meet session for an appointment
 * Uses Google Calendar API to create an event with Meet integration
 */
export async function createGoogleMeetSession(
  params: CreateMeetingParams,
  config: GoogleMeetConfig,
): Promise<GoogleMeetSession> {
  try {
    // Create JWT client for service account authentication
    const jwtClient = new JWT({
      email: config.serviceAccountEmail,
      key: config.serviceAccountKey.replace(/\\n/g, "\n"),
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
      subject: config.delegatedUserEmail, // Domain-wide delegation
    });

    // Get access token
    const accessToken = await jwtClient.getAccessToken();

    if (!accessToken.token) {
      throw new Error("Failed to obtain access token");
    }

    // Create calendar event with Google Meet
    const eventData = {
      summary: params.title,
      description: params.description || "",
      start: {
        dateTime: params.startTime,
        timeZone: params.timeZone || "America/New_York",
      },
      end: {
        dateTime: params.endTime,
        timeZone: params.timeZone || "America/New_York",
      },
      attendees: params.attendeeEmails.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    // Create the event
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      },
    );

    if (!response.ok) {
      const errorData =
        (await response.json()) as GoogleCalendarApiErrorResponse;
      throw new Error(
        `Google Calendar API error: ${errorData.error?.message || response.statusText}`,
      );
    }

    const event = (await response.json()) as GoogleCalendarEventResponse;

    // Extract Meet information from the response
    const meetLink =
      event.hangoutLink ||
      event.conferenceData?.entryPoints?.find(
        (entryPoint) => entryPoint.entryPointType === "video",
      )?.uri;

    if (!meetLink || !event.id) {
      throw new Error("Failed to create Google Meet link");
    }

    return {
      meetLink,
      eventId: event.id,
      spaceId: event.conferenceData?.conferenceId,
    };
  } catch (error) {
    console.error("Error creating Google Meet session:", error);
    throw new Error(
      `Failed to create Google Meet session: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Updates an existing Google Meet session
 */
export async function updateGoogleMeetSession(
  eventId: string,
  params: Partial<CreateMeetingParams>,
  config: GoogleMeetConfig,
): Promise<void> {
  try {
    const jwtClient = new JWT({
      email: config.serviceAccountEmail,
      key: config.serviceAccountKey.replace(/\\n/g, "\n"),
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
      subject: config.delegatedUserEmail,
    });

    const accessToken = await jwtClient.getAccessToken();

    if (!accessToken.token) {
      throw new Error("Failed to obtain access token");
    }

    // Prepare update data
    const updateData: GoogleCalendarEventUpdate = {};

    if (params.title) updateData.summary = params.title;
    if (params.description) updateData.description = params.description;
    if (params.startTime) {
      updateData.start = {
        dateTime: params.startTime,
        timeZone: params.timeZone || "America/New_York",
      };
    }
    if (params.endTime) {
      updateData.end = {
        dateTime: params.endTime,
        timeZone: params.timeZone || "America/New_York",
      };
    }
    if (params.attendeeEmails) {
      updateData.attendees = params.attendeeEmails.map((email) => ({ email }));
    }

    // Update the event
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?sendUpdates=all`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      },
    );

    if (!response.ok) {
      const errorData =
        (await response.json()) as GoogleCalendarApiErrorResponse;
      throw new Error(
        `Google Calendar API error: ${errorData.error?.message || response.statusText}`,
      );
    }
  } catch (error) {
    console.error("Error updating Google Meet session:", error);
    throw new Error(
      `Failed to update Google Meet session: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Deletes a Google Meet session
 */
export async function deleteGoogleMeetSession(
  eventId: string,
  config: GoogleMeetConfig,
): Promise<void> {
  try {
    const jwtClient = new JWT({
      email: config.serviceAccountEmail,
      key: config.serviceAccountKey.replace(/\\n/g, "\n"),
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
      subject: config.delegatedUserEmail,
    });

    const accessToken = await jwtClient.getAccessToken();

    if (!accessToken.token) {
      throw new Error("Failed to obtain access token");
    }

    // Delete the event
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}?sendUpdates=all`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      },
    );

    if (!response.ok && response.status !== 410) {
      // 410 = already deleted
      const errorData =
        (await response.json()) as GoogleCalendarApiErrorResponse;
      throw new Error(
        `Google Calendar API error: ${errorData.error?.message || response.statusText}`,
      );
    }
  } catch (error) {
    console.error("Error deleting Google Meet session:", error);
    throw new Error(
      `Failed to delete Google Meet session: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Get Google Meet configuration from environment variables
 */
export function getGoogleMeetConfig(): GoogleMeetConfig {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const delegatedUserEmail = process.env.GOOGLE_DELEGATED_USER_EMAIL;

  if (!serviceAccountEmail || !serviceAccountKey || !delegatedUserEmail) {
    throw new Error(
      "Missing required Google Meet configuration. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_KEY, and GOOGLE_DELEGATED_USER_EMAIL environment variables.",
    );
  }

  return {
    serviceAccountEmail,
    serviceAccountKey,
    delegatedUserEmail,
  };
}
