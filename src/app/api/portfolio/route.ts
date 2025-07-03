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

    // Generate signed URLs for all images
    const signedUrls: Record<string, string> = {};

    if (tattoos && tattoos.length > 0) {
      const imagePaths = (tattoos as Tattoo[])
        .map((tattoo) => tattoo.image_url)
        .filter(Boolean);

      // Process signed URLs
      for (const path of imagePaths) {
        try {
          const { data, error } = await supabase.storage
            .from('tattoos')
            .createSignedUrl(path, 3600); // 1 hour expiry

          if (error) {
            console.warn(`Failed to generate signed URL for ${path}:`, error);
          } else if (data?.signedUrl) {
            signedUrls[path] = data.signedUrl;
          }
        } catch (error) {
          console.warn(`Failed to generate signed URL for ${path}:`, error);
        }
      }
    }

    return NextResponse.json({
      tattoos: tattoos || [],
      signedUrls,
    });
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
