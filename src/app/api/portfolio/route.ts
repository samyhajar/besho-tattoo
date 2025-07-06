import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

type Tattoo = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string;
  created_at: string;
};

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch tattoos - this should work without authentication since tattoos are public
    const { data: tattoos, error: tattoosError } = await supabase
      .from('tattoos')
      .select('*')
      .order('created_at', { ascending: false });

    if (tattoosError) {
      console.error('Error fetching tattoos:', tattoosError);
      return NextResponse.json(
        { error: 'Failed to fetch tattoos', details: tattoosError.message },
        { status: 500 },
      );
    }

    // Generate signed URLs for all images IN PARALLEL (much faster!)
    const signedUrls: Record<string, string> = {};

    if (tattoos && tattoos.length > 0) {
      const imagePaths = (tattoos as Tattoo[])
        .map((tattoo) => tattoo.image_url)
        .filter(Boolean);

      // Create all signed URL promises at once
      const signedUrlPromises = imagePaths.map(async (path) => {
        try {
          const { data, error } = await supabase.storage
            .from('tattoos')
            .createSignedUrl(path, 7200); // 2 hours expiry for better caching

          if (error) {
            console.warn(`Failed to generate signed URL for ${path}:`, error);
            return { path, signedUrl: null };
          }

          return { path, signedUrl: data?.signedUrl || null };
        } catch (error) {
          console.warn(`Failed to generate signed URL for ${path}:`, error);
          return { path, signedUrl: null };
        }
      });

      // Wait for all signed URLs to complete in parallel
      const results = await Promise.allSettled(signedUrlPromises);

      // Process results and only include successful ones
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.signedUrl) {
          signedUrls[result.value.path] = result.value.signedUrl;
        }
      });
    }

    const response = NextResponse.json({
      tattoos: tattoos || [],
      signedUrls,
    });

    // Add caching headers for better performance
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=60',
    );

    return response;
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
