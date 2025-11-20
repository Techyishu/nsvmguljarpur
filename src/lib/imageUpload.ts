import imageCompression from "browser-image-compression";
import { supabase } from "./supabaseClient";

export interface UploadResult {
  url: string;
  path: string;
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.8,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.85,
};

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param folder - Optional folder path within the bucket (e.g., 'activities', 'staff', 'gallery')
 * @returns The public URL and storage path of the uploaded image
 */
export async function uploadImage(file: File, folder?: string): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid image file");
  }

  // Determine content type from file extension first (more reliable)
  const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
  };
  
  // Always use extension-based MIME type to ensure correctness
  let contentType = mimeTypes[fileExt] || 'image/jpeg';
  
  // Only use file.type if it's a valid image MIME type
  if (file.type && file.type.startsWith('image/') && mimeTypes[fileExt]) {
    // Verify the file.type matches the extension
    const expectedType = mimeTypes[fileExt];
    if (file.type === expectedType || 
        (file.type === 'image/jpeg' && (fileExt === 'jpg' || fileExt === 'jpeg'))) {
      contentType = file.type;
    }
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  // CRITICAL: We must ensure the File object has the correct type property
  // Supabase Storage uses File.type to determine the MIME type, not just the contentType option
  // Always create a fresh File from the original data with explicit type
  
  let uploadData: File;
  
  try {
    // Try compression first
    const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
    
    if (compressed.size > 0 && compressed.size <= file.size) {
      // Compression succeeded - create File from compressed Blob with explicit type
      // Read as ArrayBuffer to ensure we have raw data, then create File with correct type
      const arrayBuffer = await compressed.arrayBuffer();
      uploadData = new File([arrayBuffer], fileName, { 
        type: contentType,
        lastModified: file.lastModified || Date.now()
      });
    } else {
      // Compression didn't help, use original file
      const arrayBuffer = await file.arrayBuffer();
      uploadData = new File([arrayBuffer], fileName, { 
        type: contentType,
        lastModified: file.lastModified || Date.now()
      });
    }
  } catch (error) {
    console.warn("Image compression failed, uploading original file", error);
    // Compression failed, use original file but ensure correct type
    const arrayBuffer = await file.arrayBuffer();
    uploadData = new File([arrayBuffer], fileName, { 
      type: contentType,
      lastModified: file.lastModified || Date.now()
    });
  }

  // CRITICAL VERIFICATION: Ensure File.type is exactly what we expect
  // If it's not, recreate it one more time
  if (uploadData.type !== contentType) {
    console.error('❌ File type mismatch detected!', {
      expected: contentType,
      actual: uploadData.type,
      fileExt: fileExt,
      fileName: fileName
    });
    
    // Force recreate with correct type
    const arrayBuffer = await uploadData.arrayBuffer();
    uploadData = new File([arrayBuffer], fileName, { 
      type: contentType,
      lastModified: file.lastModified || Date.now()
    });
    
    // Final check - if still wrong, something is seriously wrong
    if (uploadData.type !== contentType) {
      throw new Error(`Failed to set correct file type. Expected: ${contentType}, Got: ${uploadData.type}`);
    }
  }

  // Final verification before upload
  if (uploadData.type !== contentType) {
    console.error('❌ CRITICAL: File type is still incorrect before upload!', {
      expected: contentType,
      actual: uploadData.type,
      fileExt: fileExt,
      fileName: fileName,
      filePath: filePath
    });
    throw new Error(`File type mismatch: Expected ${contentType}, but File.type is ${uploadData.type}`);
  }

  console.log('📤 Uploading image:', {
    originalFileName: file.name,
    uploadFileName: fileName,
    fileExt: fileExt,
    contentType: contentType,
    fileType: uploadData.type,
    fileSize: uploadData.size,
    filePath: filePath,
    verified: uploadData.type === contentType,
    typeMatch: uploadData.type === contentType ? '✅' : '❌',
  });

  // Ensure uploadData is a proper File object with correct type
  if (!(uploadData instanceof File)) {
    throw new Error('uploadData must be a File object');
  }

  // Double-check the type one last time
  if (uploadData.type !== contentType) {
    console.error('❌ FINAL CHECK FAILED: File type is incorrect right before upload!', {
      expected: contentType,
      actual: uploadData.type,
      filePath: filePath
    });
    // Last resort: recreate from ArrayBuffer
    const finalArrayBuffer = await uploadData.arrayBuffer();
    uploadData = new File([finalArrayBuffer], fileName, {
      type: contentType,
      lastModified: file.lastModified || Date.now()
    });
  }

  console.log('🚀 Final upload check:', {
    fileType: uploadData.type,
    expectedType: contentType,
    match: uploadData.type === contentType,
    isFile: uploadData instanceof File,
  });

  // CRITICAL FIX: Upload ArrayBuffer directly instead of File object
  // Supabase Storage sometimes misinterprets File objects, but ArrayBuffer with explicit contentType works correctly
  const arrayBufferForUpload = await uploadData.arrayBuffer();

  console.log('📦 Uploading ArrayBuffer:', {
    arrayBufferSize: arrayBufferForUpload.byteLength,
    expectedContentType: contentType,
    filePath: filePath,
  });

  const { data, error } = await supabase.storage.from("images").upload(filePath, arrayBufferForUpload, {
    cacheControl: "3600",
    upsert: false,
    contentType: contentType, // CRITICAL: Must match the actual file type (image/png, image/jpeg, etc.)
  });

  if (error) {
    console.error("Image upload error details:", {
      message: error.message,
      statusCode: (error as any).statusCode,
      error: error,
      fileSize: uploadData.size,
      fileType: uploadData.type,
      expectedContentType: contentType,
      actualFileType: uploadData.type,
      contentType: contentType,
      fileName: file.name,
      filePath: filePath,
      verified: uploadData.type === contentType,
    });
    throw new Error(`Upload failed: ${error.message}`);
  }

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

