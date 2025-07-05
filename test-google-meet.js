const {
  createGoogleMeetSession,
  getGoogleMeetConfig,
} = require("./src/lib/google-meet");

async function testGoogleMeet() {
  try {
    console.log("🔧 Testing Google Meet configuration...");

    const config = getGoogleMeetConfig();
    console.log("✅ Config loaded successfully");
    console.log("📧 Service Account Email:", config.serviceAccountEmail);
    console.log("👤 Delegated User Email:", config.delegatedUserEmail);

    console.log("\n🎯 Creating test meeting...");
    const meetSession = await createGoogleMeetSession(
      {
        title: "Test Tattoo Consultation",
        description: "This is a test meeting for the Google Meet integration",
        startTime: new Date(Date.now() + 5 * 60000).toISOString(), // 5 minutes from now
        endTime: new Date(Date.now() + 35 * 60000).toISOString(), // 35 minutes from now
        attendeeEmails: ["test@example.com"],
        timeZone: "America/New_York",
      },
      config,
    );

    console.log("\n🎉 SUCCESS! Google Meet integration is working!");
    console.log("🔗 Meet Link:", meetSession.meetLink);
    console.log("📅 Event ID:", meetSession.eventId);
    console.log("🏠 Space ID:", meetSession.spaceId || "Not available");
  } catch (error) {
    console.log("\n❌ ERROR: Google Meet integration failed");
    console.error("Error details:", error.message);

    if (error.message.includes("Missing required Google Meet configuration")) {
      console.log("\n💡 Fix: Set up your environment variables in .env.local");
    } else if (error.message.includes("Failed to obtain access token")) {
      console.log(
        "\n💡 Fix: Check your service account key and domain delegation",
      );
    } else if (error.message.includes("Calendar API")) {
      console.log("\n💡 Fix: Enable the Google Calendar API in Cloud Console");
    }
  }
}

console.log("🚀 Starting Google Meet Integration Test\n");
testGoogleMeet();
