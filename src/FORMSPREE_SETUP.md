# 📧 Formspree Setup Guide - Super Simple!

## Why Formspree is Perfect for You:

- ✅ **50 submissions/month FREE** (perfect for your needs)
- ✅ **No templates needed** - just sends form data directly
- ✅ **Super simple setup** - just one endpoint URL
- ✅ **Works with any email** - no domain verification
- ✅ **No complex configuration** - just HTML forms

## 🚀 Quick Setup (5 minutes):

### Step 1: Create Formspree Account

1. Go to [Formspree.io](https://formspree.io/)
2. Sign up for **FREE** (50 submissions/month)
3. Verify your email

### Step 2: Create a Form

1. Click **"New Form"**
2. Give it a name: **"Besho Tattoo Studio Contact"**
3. Set email to: **samy.hajar@gmail.com**
4. Copy your form endpoint URL (looks like: `https://formspree.io/f/YOUR_FORM_ID`)

### Step 3: Add to Your Project

Add this to your `.env.local` file:

```bash
NEXT_PUBLIC_FORMSPREE_URL=https://formspree.io/f/YOUR_FORM_ID
```

## 🎯 That's It!

Your email system will now handle:

- ✅ **Contact Form** → Emails you directly
- ✅ **Booking Notifications** → Emails you when someone books
- ✅ **Confirmation Emails** → Emails customers when you confirm
- ✅ **Admin Notifications** → All admin emails

## 📧 What Emails Look Like:

All emails will be sent to **samy.hajar@gmail.com** with:

- **Subject**: `🎨 Besho Tattoo Studio - [Type]`
- **Reply-To**: Customer's email (so you can reply directly)
- **Content**: All form data nicely formatted

### Example Email You'll Receive:

```
From: noreply@formspree.io
To: samy.hajar@gmail.com
Reply-To: customer@email.com
Subject: 🎨 Besho Tattoo Studio - New Appointment Booking!

email_type: admin-notification
recipient: admin
customer_name: John Doe
customer_email: john@email.com
appointment_date: Monday, January 15, 2024
appointment_time: 2:00 PM - 4:00 PM
phone: +1-555-123-4567
notes: Want a dragon tattoo on my arm
google_meet_link: https://meet.google.com/abc-def-ghi
appointment_id: 123e4567-e89b-12d3-a456-426614174000
message: New appointment booking from John Doe (john@email.com) for Monday, January 15, 2024 at 2:00 PM - 4:00 PM. Please confirm this appointment in your dashboard.
```

## 🔧 No Templates Needed!

Unlike EmailJS, Formspree doesn't need templates. It just sends all the form data directly to your email. Much simpler!

## 💰 Cost:

- **FREE**: 50 submissions/month
- **Paid**: $8/month for 1000 submissions (if you need more later)

## ✅ Ready to Use!

Once you add the `NEXT_PUBLIC_FORMSPREE_URL` to your `.env.local`, all your forms will work immediately:

1. **Contact form** works ✅
2. **Booking emails** work ✅
3. **Confirmation emails** work ✅
4. **Admin notifications** work ✅

**Much simpler than EmailJS!** 🎉
