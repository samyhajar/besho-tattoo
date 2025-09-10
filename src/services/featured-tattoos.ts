import { createClient } from "@/lib/supabase/browser-client";
import type { Database } from "@/types/supabase";

type FeaturedTattoo = Database["public"]["Tables"]["featured_tattoo"]["Row"];
type Tattoo = Database["public"]["Tables"]["tattoos"]["Row"];

export interface FeaturedTattooWithTattoo extends FeaturedTattoo {
  tattoo: Tattoo;
}

/**
 * Test function to verify database connectivity and permissions
 */
export async function testFeaturedTattooFunctions(): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = createClient<Database>();

  try {
    // Test 1: Check if we can call the function
    const { data, error } = await supabase.rpc("get_featured_tattoo_with_data");

    if (error) {
      return {
        success: false,
        message: `Function call failed: ${error.message} (${error.code})`,
      };
    }

    // Test 2: Check if we can access the featured_tattoo table directly
    const { data: tableData, error: tableError } = await supabase
      .from("featured_tattoo")
      .select("*")
      .limit(1);

    if (tableError) {
      return {
        success: false,
        message: `Table access failed: ${tableError.message} (${tableError.code})`,
      };
    }

    return {
      success: true,
      message: `Functions working correctly. Featured tattoo count: ${tableData?.length || 0}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Get the featured tattoo with its associated tattoo data.
 */
export async function getFeaturedTattoo(): Promise<FeaturedTattooWithTattoo | null> {
  const supabase = createClient<Database>();

  try {
    const { data, error } = await supabase.rpc("get_featured_tattoo_with_data");

    if (error) {
      console.error("Error getting featured tattoo:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Failed to get featured tattoo: ${error.message}`);
    }

    if (!data || data.length === 0) return null;

    const item = data[0];
    return {
      id: item.id,
      tattoo_id: item.tattoo_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      tattoo: item.tattoo_data as Tattoo,
    };
  } catch (error) {
    console.error("Unexpected error in getFeaturedTattoo:", error);
    throw error;
  }
}

/**
 * Set a tattoo as featured.
 * This will replace any existing featured tattoo.
 */
export async function setFeaturedTattoo(tattooId: string): Promise<void> {
  const supabase = createClient<Database>();

  try {
    const { error } = await supabase.rpc("set_featured_tattoo", {
      tattoo_id_param: tattooId,
    });

    if (error) {
      console.error("Error setting featured tattoo:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        tattooId,
      });
      throw new Error(`Failed to set featured tattoo: ${error.message}`);
    }
  } catch (error) {
    console.error("Unexpected error in setFeaturedTattoo:", error);
    throw error;
  }
}

/**
 * Remove featured status.
 */
export async function removeFeaturedTattoo(): Promise<void> {
  const supabase = createClient<Database>();

  try {
    const { error } = await supabase.rpc("remove_featured_tattoo");

    if (error) {
      console.error("Error removing featured tattoo:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Failed to remove featured tattoo: ${error.message}`);
    }
  } catch (error) {
    console.error("Unexpected error in removeFeaturedTattoo:", error);
    throw error;
  }
}

/**
 * Check if a tattoo is featured.
 */
export async function isTattooFeatured(tattooId: string): Promise<boolean> {
  const supabase = createClient<Database>();

  try {
    const { data, error } = await supabase.rpc("is_tattoo_featured", {
      tattoo_id_param: tattooId,
    });

    if (error) {
      console.error("Error checking if tattoo is featured:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        tattooId,
      });
      throw new Error(`Failed to check featured status: ${error.message}`);
    }
    return data?.[0]?.is_featured || false;
  } catch (error) {
    console.error("Unexpected error in isTattooFeatured:", error);
    throw error;
  }
}
