// Simplified Google Meet integration without domain-wide delegation
// Uses OAuth flow instead of service account

export interface SimpleMeetConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
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

/**
 * Gets access token using refresh token (OAuth flow)
 */
async function getAccessToken(config: SimpleMeetConfig): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to get access token: ${error.error_description || error.error}`,
    );
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Creates a Google Meet session using OAuth (simpler setup)
 */
export async function createSimpleGoogleMeetSession(
  params: CreateMeetingParams,
  config: SimpleMeetConfig,
): Promise<GoogleMeetSession> {
  try {
    // Get access token
    const accessToken = await getAccessToken(config);

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
          requestId: `meet-simple-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    // Create the event in primary calendar
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Google Calendar API error: ${errorData.error?.message || response.statusText}`,
      );
    }

    const event = await response.json();

    // Extract Meet information from the response
    const meetLink =
      event.hangoutLink ||
      event.conferenceData?.entryPoints?.find(
        (ep: any) => ep.entryPointType === "video",
      )?.uri;

    if (!meetLink) {
      throw new Error("Failed to create Google Meet link");
    }

    return {
      meetLink,
      eventId: event.id,
      spaceId: event.conferenceData?.conferenceId,
    };
  } catch (error) {
    console.error("Error creating simple Google Meet session:", error);
    throw new Error(
      `Failed to create Google Meet session: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Get simple Google Meet configuration from environment variables
 */
export function getSimpleMeetConfig(): SimpleMeetConfig {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing required OAuth configuration. Please set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, and GOOGLE_OAUTH_REFRESH_TOKEN environment variables.",
    );
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
  };
}
