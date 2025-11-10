import { useCallback, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage, validateImageFile } from "@/lib/imageUpload";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload = ({ value, onChange, folder, disabled, className }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setError(null);

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      setIsUploading(true);
      try {
        const result = await uploadImage(file, folder);
        onChange(result.url);
        setPreview(result.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setPreview(value);
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onChange, value]
  );

  const handleRemove = useCallback(() => {
    setPreview(undefined);
    onChange("");
    setError(null);
  }, [onChange]);

  return (
    <div className={className}>
      <div className="space-y-3">
        {preview ? (
          <div className="relative group">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
            {!disabled && !isUploading && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center aspect-video w-full rounded-lg border-2 border-dashed border-border bg-muted/30 cursor-pointer transition hover:bg-muted/50 hover:border-secondary ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center py-8">
              {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-3" />
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                  <ImageIcon className="h-6 w-6 text-muted-foreground/50 mb-2" />
                </>
              )}
              <p className="text-sm font-medium text-muted-foreground">
                {isUploading ? "Uploading..." : "Click to upload image"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP, GIF (max 10MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
          </label>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

