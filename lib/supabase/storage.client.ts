import { getSupabaseClient } from "./client";

/**
 * Get the public URL for a file in Supabase Storage (client-side only)
 * @param bucketName - The name of the storage bucket
 * @param filePath - The path to the file within the bucket
 * @returns The public URL string, or empty string if failed
 */
export function getPublicUrlSync(bucketName: string, filePath: string): string {
  if (!bucketName || !filePath) {
    console.error("getPublicUrlSync: bucketName and filePath are required");
    return "";
  }

  try {
    const supabase = getSupabaseClient();

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return data?.publicUrl ?? "";
  } catch (error) {
    console.error("Failed to get public URL:", error);
    return "";
  }
}
