/* eslint-disable @typescript-eslint/no-require-imports */
// Load environment variables
require("dotenv").config({ path: ".env.local" });

async function testGoogleMeet() {
  console.log("🧪 Testing Google Meet OAuth Configuration...\n");

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

  try {
    // Import using dynamic import for ES modules
    const { createSimpleGoogleMeetSession, getSimpleMeetConfig } = await import(
      "./src/lib/google-meet-simple"
    );

    // Get configuration
    const config = getSimpleMeetConfig();
    console.log("✅ Configuration loaded successfully");

    // Test creating a simple meeting
    console.log("📧 Creating test Google Meet session...");

    const testMeeting = await createSimpleGoogleMeetSession(
      {
        title: "Test Tattoo Consultation",
        description: "Test meeting for Google Meet integration",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
        ).toISOString(), // Tomorrow + 1 hour
        attendeeEmails: ["test@example.com"],
        timeZone: "America/New_York",
      },
      config,
    );

    console.log("✅ Google Meet session created successfully!");
    console.log("📧 Meeting Link:", testMeeting.meetLink);
    console.log("📅 Event ID:", testMeeting.eventId);
    console.log("🔗 Space ID:", testMeeting.spaceId);

    console.log("\n🎉 Google Meet integration is working perfectly!");
    console.log("\nNext steps:");
    console.log(
      "1. Your booking system will now create Google Meet sessions automatically",
    );
    console.log(
      "2. Customers will receive meeting links in their confirmation emails",
    );
    console.log("3. You can manage meetings from your Google Calendar");
  } catch (error) {
    console.error("❌ Google Meet test failed:", error.message);

    if (error.message.includes("Bad Request")) {
      console.log('\n🔧 Troubleshooting "Bad Request" error:');
      console.log("1. Check that your OAuth credentials are correct");
      console.log("2. Verify the refresh token is valid");
      console.log(
        "3. Ensure Google Calendar API is enabled in your Google Cloud project",
      );
      console.log(
        "4. Check that the OAuth scopes include calendar permissions",
      );
    } else if (error.message.includes("Access denied")) {
      console.log('\n🔧 Troubleshooting "Access denied" error:');
      console.log("1. Check that your OAuth consent screen is configured");
      console.log("2. Verify the redirect URIs match your setup");
      console.log("3. Make sure you're using the right Google account");
    } else if (error.message.includes("Quota exceeded")) {
      console.log('\n🔧 Troubleshooting "Quota exceeded" error:');
      console.log("1. Check your Google Cloud Console quotas");
      console.log("2. Free tier includes 10,000 requests/day");
      console.log("3. Consider upgrading if needed");
    }

    console.log(
      "\n📚 For detailed setup instructions, see: GOOGLE_MEET_SETUP_SIMPLE.md",
    );
  }
}

// Run the test
testGoogleMeet();
