const { Resend } = require("resend");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

async function testResend() {
  console.log("🧪 Testing Resend Email Integration...\n");

  // Check if API key is set
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY not found in environment variables");
    console.log(
      "Please add RESEND_API_KEY=re_your_api_key_here to your .env.local file",
    );
    return;
  }

  console.log("✅ RESEND_API_KEY found");

  // Initialize Resend
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log("📧 Sending test email...");

    const result = await resend.emails.send({
      from: "Besho Tattoo Studio <noreply@thinkbeforeyouink.art>",
      to: [process.env.ADMIN_EMAIL || "samy.hajar@gmail.com"],
      subject: "🧪 Resend Email Test - Besho Tattoo Studio",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
            Resend Email Test - Success! 🎉
          </h2>

          <p>Hello!</p>

          <p>This is a test email to verify that your Resend integration is working correctly for Besho Tattoo Studio.</p>

          <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h4 style="margin-top: 0; color: #155724;">✅ Integration Successful!</h4>
            <p style="margin-bottom: 0; color: #155724;">
              Your Resend email service is properly configured and working.
            </p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Test Details:</h3>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>API Key:</strong> ${process.env.RESEND_API_KEY.substring(0, 10)}...</p>
            <p><strong>Admin Email:</strong> ${process.env.ADMIN_EMAIL || "samy.hajar@gmail.com"}</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Besho Tattoo Studio<br>
              Email system ready! 🎨
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ Test email sent successfully!");
    console.log("📧 Email ID:", result.data?.id);
    console.log("📧 To:", process.env.ADMIN_EMAIL || "samy.hajar@gmail.com");
    console.log("\n🎉 Resend integration is working perfectly!");
    console.log("\nNext steps:");
    console.log("1. Check your email inbox for the test email");
    console.log("2. Start your development server: npm run dev");
    console.log("3. Test the contact form on your website");
    console.log("4. Test the booking system");
  } catch (error) {
    console.error("❌ Failed to send test email:", error);

    if (error.statusCode === 401) {
      console.log("\n🔑 Authentication Error:");
      console.log("- Check that your RESEND_API_KEY is correct");
      console.log('- Make sure the API key starts with "re_"');
    } else if (error.statusCode === 422) {
      console.log("\n📧 Email Validation Error:");
      console.log('- Check that the "from" email address is valid');
      console.log("- Verify your domain if using a custom domain");
    } else {
      console.log("\n🔧 General Error:");
      console.log("- Check your internet connection");
      console.log("- Verify Resend service status");
    }
  }
}

// Run the test
testResend();
