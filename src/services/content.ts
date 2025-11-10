import { supabase } from "@/lib/supabaseClient";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

export type ActivityRecord = Tables<"activities">;
export type StaffRecord = Tables<"staff_members">;
export type TopperRecord = Tables<"toppers">;
export type ReviewRecord = Tables<"homepage_reviews">;
export type GalleryRecord = Tables<"gallery_images">;

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
  const { data, error } = await supabase.from("homepage_reviews").insert(payload).select().single();
  if (error) {
    throw error;
  }
  return data;
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


