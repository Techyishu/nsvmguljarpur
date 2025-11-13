import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, UploadCloud, Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { fetchSiteSettings, updateSiteSetting } from "@/services/content";
import { uploadMusic, deleteMusic, extractMusicStoragePath, validateAudioFile } from "@/lib/musicUpload";

const musicSettingsSchema = z.object({
  url: z.string().url("Please enter a valid URL").or(z.literal("")),
  enabled: z.boolean(),
  volume: z.number().min(0).max(1),
  startTime: z.number().min(0),
  endTime: z.number().min(0),
  duration: z.number().min(0),
});

type MusicSettingsValues = z.infer<typeof musicSettingsSchema>;

export const BackgroundMusicSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentMusicPath, setCurrentMusicPath] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: fetchSiteSettings,
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      updateSiteSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      queryClient.invalidateQueries({ queryKey: ["backgroundMusicSettings"] });
      toast({
        title: "Settings updated",
        description: "Background music settings have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<MusicSettingsValues>({
    resolver: zodResolver(musicSettingsSchema),
    defaultValues: {
      url: "",
      enabled: false,
      volume: 0.5,
      startTime: 0,
      endTime: 0,
      duration: 0,
    },
    values: settings
      ? {
          url: settings.background_music_url || "",
          enabled: settings.background_music_enabled === "true",
          volume: parseFloat(settings.background_music_volume || "0.5"),
          startTime: parseFloat(settings.background_music_start_time || "0"),
          endTime: parseFloat(settings.background_music_end_time || "0"),
          duration: parseFloat(settings.background_music_duration || "0"),
        }
      : undefined,
  });

  // Update currentMusicPath when settings change
  useEffect(() => {
    if (settings?.background_music_url) {
      const path = extractMusicStoragePath(settings.background_music_url);
      setCurrentMusicPath(path);
    } else {
      setCurrentMusicPath(null);
    }
  }, [settings?.background_music_url]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateAudioFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Delete old music file if it exists and is from Supabase Storage
      if (currentMusicPath) {
        try {
          await deleteMusic(currentMusicPath);
        } catch (error) {
          console.warn("Failed to delete old music file:", error);
        }
      }

      // Upload new music file
      const result = await uploadMusic(file);
      
      // Update the form with the new URL
      form.setValue("url", result.url);
      setCurrentMusicPath(result.path);
      
      toast({
        title: "Music uploaded",
        description: "Music file has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Music upload error:", error);
      let errorMessage = "Failed to upload music file";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide more helpful error messages
        if (error.message.includes("You must be signed in")) {
          errorMessage = "Please sign in to the admin panel to upload music files.";
        } else if (error.message.includes("400")) {
          errorMessage = "Upload failed. Please check: 1) You're signed in, 2) File size is under 100MB, 3) File is a valid audio format.";
        } else if (error.message.includes("413") || error.message.includes("size")) {
          errorMessage = "File is too large. Maximum size is 100MB.";
        }
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteCurrentMusic = async () => {
    if (!currentMusicPath || !settings?.background_music_url) return;

    try {
      await deleteMusic(currentMusicPath);
      form.setValue("url", "");
      setCurrentMusicPath(null);
      
      toast({
        title: "Music deleted",
        description: "Music file has been removed.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete music file",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (values: MusicSettingsValues) => {
    // Update all settings
    updateMutation.mutate({
      key: "background_music_url",
      value: values.url,
    });
    updateMutation.mutate({
      key: "background_music_enabled",
      value: values.enabled.toString(),
    });
    updateMutation.mutate({
      key: "background_music_volume",
      value: values.volume.toString(),
    });
    updateMutation.mutate({
      key: "background_music_start_time",
      value: values.startTime.toString(),
    });
    updateMutation.mutate({
      key: "background_music_end_time",
      value: values.endTime.toString(),
    });
    updateMutation.mutate({
      key: "background_music_duration",
      value: values.duration.toString(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <FormLabel className="text-base mb-2 block">Upload Music File</FormLabel>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm,audio/aac,audio/m4a,.mp3,.wav,.ogg,.webm,.aac,.m4a"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="music-upload"
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Choose Music File
                    </>
                  )}
                </Button>
                {form.watch("url") && currentMusicPath && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteCurrentMusic}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
              <FormDescription>
                Upload an audio file (MP3, WAV, OGG, WebM, AAC, M4A). Max size: 50MB.
              </FormDescription>
            </div>
          </div>

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Music URL</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/music.mp3 or upload above"
                      {...field}
                    />
                    {field.value && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const audio = new Audio(field.value);
                          audio.play().catch(() => {
                            toast({
                              title: "Preview failed",
                              description: "Could not play audio preview",
                              variant: "destructive",
                            });
                          });
                        }}
                        title="Preview music"
                      >
                        <Music className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Music file URL. Upload a file above or enter an external URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Background Music</FormLabel>
              <FormDescription>
                Enable background music to autoplay on the website. Music will start playing after user interaction (browser autoplay policy).
              </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="volume"
          render={({ field }) => {
            // Calculate effective volume for display (using the same curve as BackgroundMusic)
            const effectiveVolume = Math.pow(Math.max(0, Math.min(1, field.value)), 2.5) * 100;
            return (
              <FormItem>
                <FormLabel>
                  Default Volume: {Math.round(field.value * 100)}% 
                  {field.value > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (Effective: ~{Math.round(effectiveVolume)}%)
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </FormControl>
                <FormDescription>
                  Set the default volume for background music (0-100%). Lower values are much quieter. 
                  Recommended: 5-15% for subtle background music. Only admins can control playback and volume.
                </FormDescription>
              </FormItem>
            );
          }}
        />

        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-sm font-semibold">Playback Timing Controls</h3>
          
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time (seconds)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Set the time (in seconds) where the music should start playing. Leave as 0 to start from the beginning.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time (seconds)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Set the time (in seconds) where the music should stop. Leave as 0 to play until the end. If set, music will loop between start and end time.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auto-Stop Duration (seconds)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Set how long (in seconds) the music should play before automatically stopping. Leave as 0 to play continuously. This overrides the end time setting.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </form>
    </Form>
  );
};

