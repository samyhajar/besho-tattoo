# Google Meet Integration Setup Guide

This guide walks you through setting up Google Meet integration for your tattoo studio appointment system.

## Overview

The Google Meet integration automatically creates unique Google Meet sessions for each appointment, allowing you to conduct virtual consultations with clients. Each appointment gets its own meeting link that's automatically shared with the client.

## Prerequisites

- Google Workspace account (required for domain-wide delegation)
- Google Cloud Console access
- Admin access to your Google Workspace domain

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project"
3. Name your project (e.g., "Tattoo Studio Meet Integration")
4. Note the Project ID for later use

### 1.2 Enable Required APIs

1. In the Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Google Calendar API**
   - **Google Meet API** (if available in your region)
3. Wait for the APIs to be enabled (may take a few minutes)

### 1.3 Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Fill in the details:
   - **Service account name**: `tattoo-meet-integration`
   - **Description**: `Service account for Google Meet integration`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### 1.4 Generate Service Account Key

1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Download the JSON file and keep it secure
6. Note the `client_email` and `private_key` from this file

## Step 2: Google Workspace Admin Setup

### 2.1 Enable Domain-Wide Delegation

1. Go to [Google Admin Console](https://admin.google.com/)
2. Navigate to "Security" > "API Controls"
3. Click "Domain-wide Delegation"
4. Click "Add New"
5. Enter the Client ID from your service account JSON file
6. Add these OAuth scopes (comma-separated):
   ```
   https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/calendar.events
   ```
7. Click "Authorize"

### 2.2 Verify Setup

1. Wait up to 30 minutes for changes to propagate
2. Test the integration using the provided test script (see below)

## Step 3: Environment Configuration

Add these environment variables to your `.env.local` file:

```env
# Google Meet Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_DELEGATED_USER_EMAIL=your-admin@yourdomain.com
```

**Important Notes:**

- Replace `your-service-account@your-project.iam.gserviceaccount.com` with the actual service account email
- Replace the private key with your actual private key (keep the quotes and newlines)
- Replace `your-admin@yourdomain.com` with the email of the Google Workspace user who should own the calendar events

## Step 4: Testing the Integration

### 4.1 Test Script

Create a test file to verify your setup:

```javascript
// test-google-meet.js
const {
  createGoogleMeetSession,
  getGoogleMeetConfig,
} = require("./src/lib/google-meet");

async function testGoogleMeet() {
  try {
    const config = getGoogleMeetConfig();
    console.log("Config loaded successfully");

    const meetSession = await createGoogleMeetSession(
      {
        title: "Test Meeting",
        description: "This is a test meeting",
        startTime: new Date(Date.now() + 60000).toISOString(), // 1 minute from now
        endTime: new Date(Date.now() + 120000).toISOString(), // 2 minutes from now
        attendeeEmails: ["test@example.com"],
        timeZone: "America/New_York",
      },
      config,
    );

    console.log("Success! Meet link:", meetSession.meetLink);
    console.log("Event ID:", meetSession.eventId);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testGoogleMeet();
```

Run the test:

```bash
node test-google-meet.js
```

### 4.2 Expected Results

- **Success**: You should see a Google Meet link printed to the console
- **Failure**: Check the error message and verify your configuration

## Step 5: Using the Integration

### 5.1 In Your Application

The integration is already set up in your appointment system. Here's how it works:

1. **Automatic Creation**: When an appointment is confirmed, a Google Meet session can be created automatically
2. **Manual Creation**: Admins can create Meet sessions from the dashboard
3. **Client Access**: Clients receive the Meet link via email

### 5.2 API Endpoints

The following API endpoints are available:

- `POST /api/appointments/google-meet` - Create a Meet session
- `PATCH /api/appointments/google-meet` - Update a Meet session
- `DELETE /api/appointments/google-meet` - Delete a Meet session

### 5.3 Database Changes

The following fields have been added to the `appointments` table:

- `google_meet_link` - The Meet session URL
- `google_meet_event_id` - Google Calendar event ID
- `google_meet_space_id` - Google Meet space ID
- `google_meet_created_at` - Timestamp of Meet creation

## Troubleshooting

### Common Issues

1. **"Invalid conference type value"**
   - Ensure domain-wide delegation is set up correctly
   - Verify the OAuth scopes are correct
   - Wait up to 30 minutes for changes to propagate

2. **"Failed to obtain access token"**
   - Check that your service account key is valid
   - Verify the private key format (should include newlines)
   - Ensure the service account email is correct

3. **"Insufficient permissions"**
   - Verify the delegated user email has calendar permissions
   - Check that the Google Workspace admin has enabled the necessary APIs

4. **"Calendar API not enabled"**
   - Go to Google Cloud Console and enable the Calendar API
   - Wait a few minutes for the API to be fully enabled

### Debug Mode

To enable debug logging, set this environment variable:

```env
DEBUG_GOOGLE_MEET=true
```

This will log detailed information about API calls and responses.

## Security Considerations

1. **Keep Service Account Keys Secure**
   - Never commit the JSON key file to version control
   - Store the private key in environment variables
   - Rotate keys regularly (every 90 days recommended)

2. **Limit Permissions**
   - Only grant the minimum required OAuth scopes
   - Use a dedicated service account for this integration
   - Monitor API usage in Google Cloud Console

3. **Domain Restrictions**
   - Consider restricting the service account to specific domains
   - Monitor for unusual API activity
   - Set up alerts for failed authentication attempts

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your Google Cloud Console and Workspace settings
3. Test with the provided test script
4. Review the application logs for detailed error messages

## Cost Considerations

- Google Calendar API: Free for most usage levels
- Google Meet API: Check current pricing in Google Cloud Console
- Google Workspace: Required for domain-wide delegation

The integration is designed to be cost-effective for small to medium tattoo studios with typical appointment volumes.

106623172888909101708 UNIQUE ID
