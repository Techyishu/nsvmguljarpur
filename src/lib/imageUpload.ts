import { supabase } from "./supabaseClient";

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param folder - Optional folder path within the bucket (e.g., 'activities', 'staff', 'gallery')
 * @returns The public URL and storage path of the uploaded image
 */
export async function uploadImage(file: File, folder?: string): Promise<UploadResult> {
  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage.from("images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path,
  };
}

/**
 * Delete an image from Supabase Storage
 * @param path - The storage path of the image to delete
 */
export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from("images").remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Extract storage path from a Supabase Storage public URL
 * @param url - The public URL
 * @returns The storage path or null if not a valid Supabase Storage URL
 */
export function extractStoragePath(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Match pattern: /storage/v1/object/public/images/{path}
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Validate image file
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10)
 */
export function validateImageFile(file: File, maxSizeMB = 10): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB. Please upload a smaller image.`,
    };
  }

  return { valid: true };
}

