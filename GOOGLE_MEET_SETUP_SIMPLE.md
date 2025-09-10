# 🔗 Google Meet Setup Guide (Simple OAuth Method)

## Why This Method is Better:

- ✅ **No domain-wide delegation required**
- ✅ **Works with any Google account**
- ✅ **Simpler setup process**
- ✅ **No service account needed**

## 🚀 Quick Setup (15 minutes):

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Calendar API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click **"Create Credentials"** > **"OAuth 2.0 Client IDs"**
3. Choose **"Web application"**
4. Set **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Click **"Create"**
6. Copy the **Client ID** and **Client Secret**

### Step 3: Get Refresh Token

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click the settings icon (⚙️) in the top right
3. Check **"Use your own OAuth credentials"**
4. Enter your **Client ID** and **Client Secret**
5. Close settings
6. In the left panel, find **"Google Calendar API v3"**
7. Select these scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
8. Click **"Authorize APIs"**
9. Sign in with your Google account
10. Click **"Exchange authorization code for tokens"**
11. Copy the **Refresh token**

### Step 4: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Google Meet OAuth Configuration
GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret_here
GOOGLE_OAUTH_REFRESH_TOKEN=your_refresh_token_here
```

## 🎯 What This Enables:

- ✅ **Automatic Google Meet creation** for appointments
- ✅ **Calendar events** with video conferencing
- ✅ **Email invitations** to customers
- ✅ **Professional video consultations**

## 🔧 How It Works:

1. **Customer books appointment** → System creates Google Meet
2. **Calendar event created** → With video conferencing link
3. **Customer receives email** → With meeting link and details
4. **You receive notification** → With meeting information

## 🚨 Important Notes:

- **Refresh tokens don't expire** (unless revoked)
- **Keep credentials secure** - never commit to git
- **Test in development** before production
- **Monitor API usage** in Google Cloud Console

## 🆘 Troubleshooting:

### "Bad Request" Error:

- Check that all environment variables are set correctly
- Verify the refresh token is valid
- Ensure Google Calendar API is enabled

### "Access Denied" Error:

- Check that the OAuth scopes are correct
- Verify the redirect URIs match your setup
- Make sure you're using the right Google account

### "Quota Exceeded" Error:

- Check your Google Cloud Console quotas
- Free tier includes 10,000 requests/day
- Consider upgrading if needed

## ✅ Ready to Use!

Once you add the environment variables, Google Meet will be automatically created for all appointments. The system will:

1. Create a calendar event with video conferencing
2. Send the meeting link to the customer
3. Include the link in confirmation emails
4. Store the meeting details in your database

Your tattoo studio will now have professional video consultation capabilities! 🎨
