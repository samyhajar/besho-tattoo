import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

/**
 * API route for cleaning up past availability slots
 * This endpoint is called by Vercel cron job daily at midnight
 */
export async function GET(request: NextRequest) {
  // Verify this is a cron job request (following official Vercel pattern)
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // Call the cleanup function
    const { data, error } = await supabase.rpc(
      'cleanup_past_availability_slots',
    );

    if (error) {
      console.error('Error cleaning up past slots:', error);
      return NextResponse.json(
        { error: 'Failed to cleanup past slots', details: error.message },
        { status: 500 },
      );
    }

    const deletedCount = data?.[0]?.deleted_count || 0;

    console.log(`✅ Cleanup completed: ${deletedCount} past slots removed`);

    return NextResponse.json({
      ok: true,
      message: `Successfully cleaned up ${deletedCount} past availability slots`,
      deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Unexpected error during cleanup:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 },
    );
  }
}

// Keep POST for backward compatibility and manual testing
export async function POST(request: NextRequest) {
  return GET(request);
}
