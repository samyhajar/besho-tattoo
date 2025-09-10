# 🚀 Resend Quick Start Guide

## Step 1: Get Your Resend API Key

1. Go to [Resend.com](https://resend.com/)
2. Sign up for free (100 emails/day)
3. Go to **API Keys** in your dashboard
4. Click **"Create API Key"**
5. Name it: **"Besho Tattoo Studio"**
6. Copy the API key (starts with `re_`)

## Step 2: Add Environment Variables

Create or update your `.env.local` file with:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here
ADMIN_EMAIL=samy.hajar@gmail.com

# Optional: Custom domain (if you verify your domain)
# RESEND_FROM_EMAIL=noreply@thinkbeforeyouink.art
```

## Step 3: Test the Setup

Run this command to test your Resend integration:

```bash
npm run test-resend
```

## Step 4: Verify

1. Check your email inbox for the test email
2. If successful, you'll see: "✅ Test email sent successfully!"
3. If there's an error, the script will show you what to fix

## Step 5: Start Your App

```bash
npm run dev
```

Your email system is now ready! 🎉

## Troubleshooting

### ❌ "RESEND_API_KEY not found"

- Make sure you added the API key to `.env.local`
- Check that the file is in your project root

### ❌ "Authentication Error"

- Verify your API key is correct
- Make sure it starts with `re_`

### ❌ "Email Validation Error"

- The default "from" email should work for testing
- For production, verify your domain in Resend

## Next Steps

Once the test passes:

1. Test the contact form on your website
2. Test the booking system
3. Check that admin notifications work
4. Monitor your email delivery in the Resend dashboard
