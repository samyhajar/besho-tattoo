# 📧 Resend Email Setup Guide

## Why Resend is Perfect for Your Tattoo Studio:

- ✅ **Professional email delivery** with 99.9% deliverability
- ✅ **Beautiful HTML email templates** with your branding
- ✅ **100 emails/day FREE** (perfect for your needs)
- ✅ **Simple API** with great TypeScript support
- ✅ **Email analytics** and delivery tracking
- ✅ **Custom domain support** for professional emails

## 🚀 Quick Setup (10 minutes):

### Step 1: Create Resend Account

1. Go to [Resend.com](https://resend.com/)
2. Sign up for **FREE** (100 emails/day)
3. Verify your email

### Step 2: Get Your API Key

1. Go to your Resend dashboard
2. Navigate to **API Keys** section
3. Click **"Create API Key"**
4. Give it a name: **"Besho Tattoo Studio"**
5. Copy the API key (starts with `re_`)

### Step 3: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=samy.hajar@gmail.com

# Optional: Custom domain (if you have one)
# RESEND_FROM_EMAIL=noreply@thinkbeforeyouink.art
# Note: For testing, emails will be sent from noreply@thinkbeforeyouink.art
```

### Step 4: Verify Your Domain (Optional but Recommended)

For professional emails, verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `besho-tattoo.com`)
4. Follow the DNS setup instructions
5. Update your `.env.local`:
   ```bash
   RESEND_FROM_EMAIL=noreply@besho-tattoo.com
   ```

## 🎯 What's Now Working:

Your email system now handles:

- ✅ **Contact Form** → Beautiful HTML emails to you
- ✅ **Booking Confirmations** → Professional emails to customers
- ✅ **Admin Notifications** → Detailed booking alerts
- ✅ **Appointment Confirmations** → Confirmed appointment details

## 📧 Email Templates Included:

### 1. Contact Form Email

- **To**: You (admin)
- **Subject**: `🎨 Besho Tattoo Studio - Contact Form: [Subject]`
- **Features**: Customer details, message, reply-to functionality

### 2. Booking Confirmation Email

- **To**: Customer
- **Subject**: `🎨 Besho Tattoo Studio - Booking Confirmation - Thank You!`
- **Features**: Appointment details, next steps, professional branding

### 3. Admin Notification Email

- **To**: You (admin)
- **Subject**: `🎨 Besho Tattoo Studio - New Appointment Booking!`
- **Features**: Customer details, appointment info, action required

### 4. Appointment Confirmation Email

- **To**: Customer
- **Subject**: `🎨 Besho Tattoo Studio - Appointment CONFIRMED - Ready to Tattoo!`
- **Features**: Confirmed details, important reminders, excitement

## 🔧 API Endpoint

All emails are sent through: `POST /api/email`

**Example usage:**

```javascript
const response = await fetch("/api/email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "contact",
    data: {
      name: "John Doe",
      email: "john@example.com",
      subject: "Tattoo Inquiry",
      message: "I want a dragon tattoo...",
    },
  }),
});
```

## 💰 Cost:

- **FREE**: 100 emails/day (3,000/month)
- **Paid**: $20/month for 50,000 emails (if you need more)

## 🎨 Email Design Features:

- **Professional HTML templates** with your branding
- **Responsive design** that works on all devices
- **Clear call-to-actions** and important information highlighted
- **Consistent styling** across all email types
- **Proper formatting** for dates, times, and contact info

## ✅ Ready to Use!

Once you add the environment variables, all your forms will work immediately:

1. **Contact form** sends beautiful emails ✅
2. **Booking system** sends confirmation emails ✅
3. **Admin dashboard** sends notification emails ✅
4. **Appointment confirmations** send detailed emails ✅

## 🔍 Testing Your Setup:

1. **Test Contact Form**: Fill out the contact form on your website
2. **Test Booking**: Create a test appointment booking
3. **Check Dashboard**: Verify emails appear in your inbox
4. **Check Resend Dashboard**: Monitor email delivery and analytics

## 🚨 Important Notes:

- **API Key Security**: Never commit your API key to git
- **Environment Variables**: Make sure to add them to your production environment
- **Domain Verification**: For best deliverability, verify your domain
- **Email Limits**: Monitor your usage in the Resend dashboard

## 🆘 Troubleshooting:

### Emails not sending?

1. Check your API key is correct
2. Verify environment variables are loaded
3. Check browser console for errors
4. Check Resend dashboard for delivery status

### Emails going to spam?

1. Verify your domain in Resend
2. Use a custom domain email address
3. Warm up your email sending gradually

### Need help?

- Check Resend documentation: [docs.resend.com](https://docs.resend.com)
- Contact Resend support for delivery issues
- Check your application logs for API errors

---

**Your email system is now professional and ready to scale! 🎉**
