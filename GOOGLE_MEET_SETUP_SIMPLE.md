# Google Meet Integration - Simple Setup (No Google Workspace Required)

This guide shows how to set up Google Meet integration using OAuth instead of domain-wide delegation. This method works with personal Google accounts and doesn't require Google Workspace.

## 🔧 **Prerequisites**

- Personal Google account (Gmail works fine)
- Google Cloud Console project

## 📋 **Step-by-Step Setup**

### 1. **Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Note your project ID

### 2. **Enable Google Calendar API**

1. In your Google Cloud project, go to **APIs & Services** > **Library**
2. Search for "Google Calendar API"
3. Click on it and click **Enable**

### 3. **Configure OAuth Consent Screen**

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** (unless you have Google Workspace)
3. Fill in required fields:
   - **App name**: "Tattoo Studio Booking"
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. Add scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
6. Click **Save and Continue**
7. Add test users (add your own email)
8. Click **Save and Continue**

### 4. **Create OAuth 2.0 Credentials**

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Name it "Tattoo Studio OAuth"
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://your-domain.com/api/auth/google/callback` (for production)
6. Click **Create**
7. **Download the JSON file** and save it securely

### 5. **Get Refresh Token**

Run this script to get your refresh token:

```bash
# Create a temporary auth script
cat > get-refresh-token.js << 'EOF'
const https = require('https');
const url = require('url');
const querystring = require('querystring');

// Replace with your OAuth credentials
const CLIENT_ID = 'your-client-id-here';
const CLIENT_SECRET = 'your-client-secret-here';
const REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

// Step 1: Get authorization URL
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify({
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: 'code',
  scope: SCOPES.join(' '),
  access_type: 'offline',
  prompt: 'consent'
})}`;

console.log('1. Visit this URL in your browser:');
console.log(authUrl);
console.log('\n2. After authorization, you\'ll be redirected to a URL like:');
console.log('http://localhost:3000/api/auth/google/callback?code=AUTHORIZATION_CODE');
console.log('\n3. Copy the AUTHORIZATION_CODE and paste it here:');

// Get input from user
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the authorization code: ', (code) => {
  // Step 2: Exchange code for tokens
  const tokenData = querystring.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI
  });

  const options = {
    hostname: 'oauth2.googleapis.com',
    port: 443,
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(tokenData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.refresh_token) {
          console.log('\n✅ SUCCESS! Add these to your .env.local file:');
          console.log(`GOOGLE_OAUTH_CLIENT_ID=${CLIENT_ID}`);
          console.log(`GOOGLE_OAUTH_CLIENT_SECRET=${CLIENT_SECRET}`);
          console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${response.refresh_token}`);
        } else {
          console.log('❌ Error:', response);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error);
      }
      rl.close();
    });
  });

  req.on('error', (error) => {
    console.log('❌ Error:', error);
    rl.close();
  });

  req.write(tokenData);
  req.end();
});
EOF

# Run the script
node get-refresh-token.js
```

### 6. **Update Environment Variables**

Add these to your `.env.local` file:

```env
# Simple Google Meet Integration (OAuth)
GOOGLE_OAUTH_CLIENT_ID=your-client-id-here
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret-here
GOOGLE_OAUTH_REFRESH_TOKEN=your-refresh-token-here
```

### 7. **Test the Setup**

```bash
# Test the configuration
node -e "
const config = {
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN
};

if (config.clientId && config.clientSecret && config.refreshToken) {
  console.log('✅ Configuration looks good!');
  console.log('- Client ID:', config.clientId?.substring(0, 20) + '...');
  console.log('- Client Secret:', config.clientSecret?.substring(0, 10) + '...');
  console.log('- Refresh Token:', config.refreshToken?.substring(0, 20) + '...');
} else {
  console.log('❌ Missing configuration:');
  console.log('- Client ID:', !!config.clientId);
  console.log('- Client Secret:', !!config.clientSecret);
  console.log('- Refresh Token:', !!config.refreshToken);
}
"
```

## 🔄 **Differences from Domain-Wide Delegation**

| Feature               | OAuth (Simple)          | Domain-Wide Delegation   |
| --------------------- | ----------------------- | ------------------------ |
| **Requirements**      | Personal Google account | Google Workspace ($)     |
| **Setup Complexity**  | Medium                  | High                     |
| **Calendar Access**   | Your personal calendar  | Any user's calendar      |
| **Business Features** | Limited                 | Full enterprise features |
| **Cost**              | Free                    | ~$6-18/month per user    |

## 🚀 **Next Steps**

1. **Complete the OAuth setup above**
2. **Test creating a Google Meet session**
3. **The existing API endpoints will work automatically**

## 🔍 **Troubleshooting**

- **"Invalid client" error**: Double-check CLIENT_ID and CLIENT_SECRET
- **"Invalid grant" error**: The refresh token may have expired, regenerate it
- **"Access denied" error**: Make sure the OAuth consent screen is properly configured
- **"Calendar not found" error**: The OAuth user must have Google Calendar enabled

## 📚 **Additional Resources**

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Meet API Documentation](https://developers.google.com/meet/api/guides/overview)
