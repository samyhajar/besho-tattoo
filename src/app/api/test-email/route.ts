import { NextRequest, NextResponse } from "next/server";
import { sendContactForm } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    // Test email data
    const testData = {
      name: "Test User",
      email: "test@example.com",
      subject: "Resend Email Test",
      message:
        "This is a test email to verify Resend integration is working correctly.",
    };

    const result = await sendContactForm(testData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully!",
        data: result.data,
      });
    } else {
      console.error("Test email failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send test email",
          details: result.error,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Test email API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
