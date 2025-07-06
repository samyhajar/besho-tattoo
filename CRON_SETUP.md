# Automated Daily Cleanup Setup

This project includes an automated daily cleanup system that removes past availability slots at midnight every day using Vercel Cron Jobs.

## 🚀 Setup Instructions

### 1. Environment Variable Configuration

Add the following environment variable to your Vercel project:

**In Vercel Dashboard:**

1. Go to your project settings
2. Navigate to Environment Variables
3. Add a new variable:
   - **Name:** `CRON_SECRET`
   - **Value:** A secure random string (generate one using: `openssl rand -base64 32`)
   - **Environment:** Production (and Preview if needed)

**Example:**

```
CRON_SECRET=your-super-secure-random-string-here
```

**Suggested secure value:**

```
CRON_SECRET=88hTFGZS4VICEhKvmzW4Iu3VLMT3RXny996HOUMy370=
```

### 2. Vercel Cron Job Configuration

The cron job is automatically configured via `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cleanup-slots",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Schedule Explanation:**

- `0 0 * * *` = Every day at midnight (00:00) UTC
- This will run the cleanup automatically every day

### 3. Manual Testing

You can manually test the cleanup endpoint (for debugging):

```bash
# GET method (primary - matches Vercel cron pattern)
curl -X GET https://your-domain.vercel.app/api/cleanup-slots \
  -H "Authorization: Bearer your-cron-secret-here"

# POST method (also supported for backward compatibility)
curl -X POST https://your-domain.vercel.app/api/cleanup-slots \
  -H "Authorization: Bearer your-cron-secret-here"
```

## 🔧 How It Works

1. **Daily Execution**: Every day at midnight UTC, Vercel automatically calls `/api/cleanup-slots` using GET method
2. **Security**: The endpoint requires the `CRON_SECRET` for authentication (follows official Vercel pattern)
3. **Cleanup**: The function removes all availability slots that are:
   - In the past (date < today)
   - Not booked (`is_booked = false`)
4. **Logging**: Results are logged to Vercel Functions logs

## 📊 Monitoring

### Vercel Dashboard

- Check **Functions** tab for execution logs
- Monitor cron job status in **Settings > Cron Jobs**

### Manual Cleanup

If you need to clean up slots manually, use the "Clean Past Slots" button in the Logs dashboard (`/dashboard/logs`).

## 🔒 Security Features

- **Authentication**: Cron secret prevents unauthorized access (follows official Vercel pattern)
- **Admin Only**: Manual cleanup requires admin authentication
- **Safe Operations**: Only removes unbooked past slots
- **Logging**: All operations are logged for audit trail

## 📅 Schedule Customization

To change the cleanup schedule, modify the `schedule` field in `vercel.json`:

- `0 0 * * *` - Daily at midnight
- `0 2 * * *` - Daily at 2 AM
- `0 0 * * 1` - Weekly on Monday at midnight
- `0 0 1 * *` - Monthly on the 1st at midnight

After changing the schedule, redeploy to Vercel.

## 🚨 Troubleshooting

### Cron Job Not Running

1. Check that `CRON_SECRET` environment variable is set
2. Verify the cron job is listed in Vercel dashboard
3. Check function logs for errors

### Authentication Errors

1. Ensure `CRON_SECRET` matches between environment variables and Vercel's cron system
2. Generate a new secret if needed: `openssl rand -base64 32`

### Database Errors

1. Check Supabase connection and permissions
2. Verify the `cleanup_past_availability_slots()` function exists in the database
3. Check RLS policies allow the operation
