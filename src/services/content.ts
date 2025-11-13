import { supabase } from "@/lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

// Create a dedicated anonymous client for public operations
// This ensures consistent behavior across browsers (Chrome vs Safari)
// by explicitly using the anon role without any session context
const getAnonymousClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabase; // Fallback to main client
  }
  
  // Create a fresh client instance with no session storage
  // Don't set Authorization header - let Supabase handle it automatically based on the anon key
  const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Don't persist session for anonymous operations
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
    },
    global: {
      headers: {
        "apikey": supabaseAnonKey,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
        // Don't set Authorization - Supabase will handle it based on the anon key
      },
    },
  });
  
  return client;
};

export type ActivityRecord = Tables<"activities">;
export type StaffRecord = Tables<"staff_members">;
export type TopperRecord = Tables<"toppers">;
export type ReviewRecord = Tables<"homepage_reviews">;
export type GalleryRecord = Tables<"gallery_images">;
export type SiteSettingRecord = Tables<"site_settings">;

export const fetchActivities = async (includeDrafts = false): Promise<ActivityRecord[]> => {
  const query = includeDrafts
    ? supabase.from("activities").select("*").order("sort_order").order("activity_date", { ascending: false })
    : supabase
        .from("activities")
        .select("*")
        .eq("is_published", true)
        .order("sort_order")
        .order("activity_date", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const insertActivity = async (payload: TablesInsert<"activities">) => {
  const { data, error } = await supabase.from("activities").insert(payload).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const updateActivity = async (id: string, payload: TablesUpdate<"activities">) => {
  const { data, error } = await supabase.from("activities").update(payload).eq("id", id).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const deleteActivity = async (id: string) => {
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) {
    throw error;
  }
};

export const fetchStaff = async (includeInactive = false): Promise<StaffRecord[]> => {
  const query = includeInactive
    ? supabase.from("staff_members").select("*").order("sort_order").order("full_name")
    : supabase
        .from("staff_members")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .order("full_name");

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data ?? [];
};

export const insertStaffMember = async (payload: TablesInsert<"staff_members">) => {
  const { data, error } = await supabase.from("staff_members").insert(payload).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const updateStaffMember = async (id: string, payload: TablesUpdate<"staff_members">) => {
  const { data, error } = await supabase.from("staff_members").update(payload).eq("id", id).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const deleteStaffMember = async (id: string) => {
  const { error } = await supabase.from("staff_members").delete().eq("id", id);
  if (error) {
    throw error;
  }
};

export const fetchToppers = async (includeInactive = false): Promise<TopperRecord[]> => {
  const query = includeInactive
    ? supabase.from("toppers").select("*").order("sort_order").order("percentage", { ascending: false })
    : supabase
        .from("toppers")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .order("percentage", { ascending: false });

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data ?? [];
};

export const insertTopper = async (payload: TablesInsert<"toppers">) => {
  const { data, error } = await supabase.from("toppers").insert(payload).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const updateTopper = async (id: string, payload: TablesUpdate<"toppers">) => {
  const { data, error } = await supabase.from("toppers").update(payload).eq("id", id).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const deleteTopper = async (id: string) => {
  const { error } = await supabase.from("toppers").delete().eq("id", id);
  if (error) {
    throw error;
  }
};

export const fetchHomepageReviews = async (includeHidden = false): Promise<ReviewRecord[]> => {
  const query = includeHidden
    ? supabase.from("homepage_reviews").select("*").order("sort_order").order("created_at", { ascending: false })
    : supabase
        .from("homepage_reviews")
        .select("*")
        .eq("is_featured", true)
        .order("sort_order")
        .order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data ?? [];
};

export const insertHomepageReview = async (payload: TablesInsert<"homepage_reviews">) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase configuration missing");
  }
  
  // Use the secure RPC function - testing has shown RLS policies are problematic
  // The function is secure with validation and works consistently across all browsers
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('apikey', supabaseAnonKey);
  headers.set('Prefer', 'return=representation');
  
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/insert_homepage_review`, {
    method: 'POST',
    headers: headers,
    credentials: 'omit',
    body: JSON.stringify({
      p_author_name: payload.author_name,
      p_author_role: payload.author_role || '',
      p_content: payload.content,
      p_rating: payload.rating,
      p_is_featured: payload.is_featured ?? false,
      p_sort_order: payload.sort_order ?? 999,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
    
    console.error("Supabase insert error:", {
      message: errorMessage,
      details: errorData.details,
      hint: errorData.hint,
      code: errorData.code || response.status,
      payload: payload,
      status: response.status,
      statusText: response.statusText,
    });
    
    throw new Error(errorMessage || "Failed to insert review");
  }
  
  const data = await response.json();
  // Supabase returns an array when using select=*, so get the first item
  return Array.isArray(data) ? data[0] : data;
};

export const updateHomepageReview = async (id: string, payload: TablesUpdate<"homepage_reviews">) => {
  const { data, error } = await supabase.from("homepage_reviews").update(payload).eq("id", id).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const deleteHomepageReview = async (id: string) => {
  const { error } = await supabase.from("homepage_reviews").delete().eq("id", id);
  if (error) {
    throw error;
  }
};

export const fetchGalleryImages = async (includeDrafts = false): Promise<GalleryRecord[]> => {
  const query = includeDrafts
    ? supabase.from("gallery_images").select("*").order("sort_order").order("created_at", { ascending: false })
    : supabase
        .from("gallery_images")
        .select("*")
        .eq("is_published", true)
        .order("sort_order")
        .order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data ?? [];
};

export const insertGalleryImage = async (payload: TablesInsert<"gallery_images">) => {
  const { data, error } = await supabase.from("gallery_images").insert(payload).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const updateGalleryImage = async (id: string, payload: TablesUpdate<"gallery_images">) => {
  const { data, error } = await supabase.from("gallery_images").update(payload).eq("id", id).select().single();
  if (error) {
    throw error;
  }
  return data;
};

export const deleteGalleryImage = async (id: string) => {
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) {
    throw error;
  }
};

export const fetchSiteSettings = async (): Promise<Record<string, string>> => {
  const { data, error } = await supabase.from("site_settings").select("*");
  
  if (error) {
    throw error;
  }
  
  // Convert array to object with setting_key as key
  const settings: Record<string, string> = {};
  data?.forEach((setting) => {
    settings[setting.setting_key] = setting.setting_value || "";
  });
  
  return settings;
};

export const updateSiteSetting = async (key: string, value: string) => {
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(
      {
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "setting_key",
      }
    )
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
};

export const fetchBackgroundMusicSettings = async () => {
  const settings = await fetchSiteSettings();
  return {
    url: settings.background_music_url || "",
    enabled: settings.background_music_enabled === "true",
    volume: parseFloat(settings.background_music_volume || "0.5"),
  };
};


