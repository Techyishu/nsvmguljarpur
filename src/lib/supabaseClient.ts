import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push("VITE_SUPABASE_URL");
  if (!supabaseAnonKey) missingVars.push("VITE_SUPABASE_ANON_KEY");
  
  const errorMessage = `Missing Supabase environment variables: ${missingVars.join(", ")}. Please create a .env file in the project root with these variables.`;
  
  if (import.meta.env.DEV) {
    console.error("❌ Supabase Configuration Error:", errorMessage);
    console.error("📝 Create a .env file with:");
    console.error("   VITE_SUPABASE_URL=your_supabase_url");
    console.error("   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key");
  }
  
  throw new Error(errorMessage);
}

// Validate that the values are not just whitespace
if (supabaseUrl.length === 0 || supabaseAnonKey.length === 0) {
  throw new Error("Supabase environment variables cannot be empty. Please set valid values for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

// Create a Chrome-compatible storage adapter
// Chrome has stricter storage policies, so we need to handle storage errors gracefully
const createStorageAdapter = () => {
  try {
    // Check if localStorage is available and accessible
    if (typeof window !== "undefined" && window.localStorage) {
      const testKey = "__supabase_storage_test__";
      try {
        window.localStorage.setItem(testKey, "test");
        window.localStorage.removeItem(testKey);
        return window.localStorage;
      } catch (e) {
        // localStorage is blocked (e.g., in Chrome incognito or with strict privacy settings)
        console.warn("localStorage is not available, using memory storage");
        return createMemoryStorage();
      }
    }
    return createMemoryStorage();
  } catch (e) {
    console.warn("Storage initialization failed, using memory storage", e);
    return createMemoryStorage();
  }
};

// Fallback memory storage for when localStorage is blocked
const createMemoryStorage = () => {
  const storage = new Map<string, string>();
  return {
    getItem: (key: string) => storage.get(key) || null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
  };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: createStorageAdapter(),
    storageKey: "shikhsha-web-builder-auth",
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "apikey": supabaseAnonKey,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
    },
  },
  realtime: {
    params: {
      apikey: supabaseAnonKey,
    },
  },
});


