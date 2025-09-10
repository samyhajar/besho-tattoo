// Load environment variables
require("dotenv").config({ path: ".env.local" });

async function testGoogleMeetCredentials() {
  console.log("🧪 Testing Google Meet OAuth Credentials...\n");

  // Check if configuration is available
  const hasConfig =
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
    process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!hasConfig) {
    console.error("❌ Google Meet OAuth configuration not found");
    console.log("\nPlease add these to your .env.local file:");
    console.log("GOOGLE_OAUTH_CLIENT_ID=your_client_id_here");
    console.log("GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret_here");
    console.log("GOOGLE_OAUTH_REFRESH_TOKEN=your_refresh_token_here");
    console.log("\nSee GOOGLE_MEET_SETUP_SIMPLE.md for setup instructions");
    return;
  }

  console.log("✅ OAuth configuration found");
  console.log(
    "📧 Client ID:",
    process.env.GOOGLE_OAUTH_CLIENT_ID.substring(0, 20) + "...",
  );
  console.log(
    "🔑 Client Secret:",
    process.env.GOOGLE_OAUTH_CLIENT_SECRET.substring(0, 10) + "...",
  );
  console.log(
    "🔄 Refresh Token:",
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN.substring(0, 20) + "...",
  );

  try {
    // Test the OAuth token exchange directly
    console.log("\n🔐 Testing OAuth token exchange...");

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OAuth token exchange failed");
      console.error("Status:", response.status);
      console.error("Error:", data);

      if (data.error === "invalid_client") {
        console.log("\n🔧 Fix: Check your Client ID and Client Secret");
      } else if (data.error === "invalid_grant") {
        console.log("\n🔧 Fix: Your refresh token is invalid or expired");
        console.log("   You need to generate a new refresh token");
      } else if (data.error === "unauthorized_client") {
        console.log("\n🔧 Fix: Check your OAuth consent screen configuration");
      }

      return;
    }

    console.log("✅ OAuth token exchange successful!");
    console.log("📧 Access Token:", data.access_token.substring(0, 20) + "...");
    console.log("⏰ Expires In:", data.expires_in, "seconds");
    console.log("🔄 Token Type:", data.token_type);

    // Test Google Calendar API access
    console.log("\n📅 Testing Google Calendar API access...");

    const calendarResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      },
    );

    if (calendarResponse.ok) {
      console.log("✅ Google Calendar API access successful!");
      console.log("🎉 Your Google Meet integration is ready to use!");

      console.log("\nNext steps:");
      console.log(
        "1. Your booking system will create Google Meet sessions automatically",
      );
      console.log(
        "2. Customers will receive meeting links in confirmation emails",
      );
      console.log("3. You can manage meetings from your Google Calendar");
    } else {
      const calendarError = await calendarResponse.json();
      console.error("❌ Google Calendar API access failed");
      console.error("Error:", calendarError);

      if (calendarError.error?.code === 403) {
        console.log(
          "\n🔧 Fix: Enable Google Calendar API in your Google Cloud Console",
        );
        console.log(
          "   Go to: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com",
        );
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n🔧 This might be a network issue or configuration problem");
  }
}

// Run the test
testGoogleMeetCredentials();
