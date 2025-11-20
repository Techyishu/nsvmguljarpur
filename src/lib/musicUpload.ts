import { supabase } from "./supabaseClient";

export interface MusicUploadResult {
  url: string;
  path: string;
}

/**
 * Upload an audio file to Supabase Storage
 * @param file - The audio file to upload
 * @returns The public URL and storage path of the uploaded audio file
 */
export async function uploadMusic(file: File): Promise<MusicUploadResult> {
  const validation = validateAudioFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid audio file");
  }

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("You must be signed in to upload music files");
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "mp3";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  // Upload directly to root of bucket (not in a subfolder)
  const filePath = fileName;

  // Determine content type more accurately
  // Always use extension-based MIME type to ensure consistency
  const mimeTypes: Record<string, string> = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'webm': 'audio/webm',
    'aac': 'audio/aac',
    'm4a': 'audio/mp4',
    'flac': 'audio/flac',
    'opus': 'audio/opus',
  };
  
  // Use extension-based MIME type first, fallback to file.type if not found
  let contentType = mimeTypes[fileExt] || file.type;
  
  // If still no valid content type, use audio/mpeg as default for MP3
  if (!contentType || contentType === 'application/octet-stream' || contentType === 'application/json') {
    contentType = mimeTypes[fileExt] || 'audio/mpeg';
  }

  // Ensure we're uploading a proper File/Blob object
  // Create a new File object with explicit content type if needed
  let fileToUpload: File | Blob = file;
  if (file.type !== contentType) {
    // If the file's type doesn't match, create a new File with correct type
    fileToUpload = new File([file], file.name, { type: contentType });
  }

  const { data, error } = await supabase.storage.from("music").upload(filePath, fileToUpload, {
    cacheControl: "3600",
    upsert: false,
    contentType: contentType,
  });

  if (error) {
    console.error("Upload error details:", {
      message: error.message,
      statusCode: (error as any).statusCode,
      error: error,
      fileSize: file.size,
      fileType: file.type,
      contentType: contentType,
      fileName: file.name,
    });
    throw new Error(`Upload failed: ${error.message}`);
  }

  if (!data) {
    throw new Error("Upload failed: No data returned");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("music").getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path,
  };
}

/**
 * Delete an audio file from Supabase Storage
 * @param path - The storage path of the audio file to delete
 */
export async function deleteMusic(path: string): Promise<void> {
  const { error } = await supabase.storage.from("music").remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Extract storage path from a Supabase Storage public URL
 * @param url - The public URL
 * @returns The storage path or null if not a valid Supabase Storage URL
 */
export function extractMusicStoragePath(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Match pattern: /storage/v1/object/public/music/{path}
    // Also handle paths that might have "music/" prefix
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/music\/(.+)/);
    if (match) {
      let path = match[1];
      // Remove "music/" prefix if it exists (for backward compatibility)
      if (path.startsWith('music/')) {
        path = path.substring(6);
      }
      return path;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validate audio file
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 50)
 */
export function validateAudioFile(file: File, maxSizeMB = 50): { valid: boolean; error?: string } {
  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
    "audio/aac",
    "audio/m4a",
  ];
  
  // Also check file extension as fallback
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const allowedExtensions = ["mp3", "wav", "ogg", "webm", "aac", "m4a"];
  
  if (!allowedTypes.includes(file.type) && (!fileExt || !allowedExtensions.includes(fileExt))) {
    return {
      valid: false,
      error: "Invalid file type. Please upload an MP3, WAV, OGG, WebM, AAC, or M4A audio file.",
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB. Please upload a smaller audio file.`,
    };
  }

  return { valid: true };
}

