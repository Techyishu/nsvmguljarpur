import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

import { AdminLayout } from "./admin/AdminLayout";
import { AdminLogin } from "./admin/AdminLogin";
import { Dashboard } from "./admin/Dashboard";
import { ActivityManager } from "./admin/ActivityManager";
import { StaffManager } from "./admin/StaffManager";
import { TopperManager } from "./admin/TopperManager";
import { GalleryManager } from "./admin/GalleryManager";
import { ReviewManager } from "./admin/ReviewManager";
import { BackgroundMusicSettings } from "@/components/BackgroundMusicSettings";
import {
  fetchActivities,
  fetchStaff,
  fetchToppers,
  fetchGalleryImages
} from "@/services/content";

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Dashboard Stats Queries
  const activitiesQuery = useQuery({
    queryKey: ["admin", "activities"],
    queryFn: () => fetchActivities(true),
    enabled: isAdmin,
  });

  const staffQuery = useQuery({
    queryKey: ["admin", "staff"],
    queryFn: () => fetchStaff(true),
    enabled: isAdmin,
  });

  const toppersQuery = useQuery({
    queryKey: ["admin", "toppers"],
    queryFn: () => fetchToppers(true),
    enabled: isAdmin,
  });

  const galleryQuery = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: () => fetchGalleryImages(true),
  });

  useEffect(() => {
    let isMounted = true;

    const verifyAdmin = async (currentSession: Session) => {
      setIsCheckingAdmin(true);
      const userRole = currentSession.user.user_metadata?.role;

      if (!isMounted) return;

      if (userRole === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        });
      }
      setIsCheckingAdmin(false);
    };

    const syncSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (error) {
        await supabase.auth.signOut();
        setSession(null);
        setIsCheckingAdmin(false);
        return;
      }

      if (data.session) {
        setSession(data.session);
        void verifyAdmin(data.session);
      } else {
        setSession(null);
        setIsCheckingAdmin(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (!isMounted) return;

      if (event === "SIGNED_OUT" || !nextSession) {
        setSession(null);
        setIsAdmin(false);
        setIsCheckingAdmin(false);
      } else if (nextSession) {
        setSession(nextSession);
        void verifyAdmin(nextSession);
      }
    });

    void syncSession();

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [toast]);

  const handleLogin = async (values: any) => {
    setIsLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome Back",
        description: "Successfully logged in to admin panel.",
      });
    }
    setIsLoginLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    toast({
      title: "Signed Out",
      description: "You have been logged out successfully.",
    });
  };

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <AdminLogin onLogin={handleLogin} isLoading={isLoginLoading} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            stats={{
              activities: activitiesQuery.data?.length || 0,
              staff: staffQuery.data?.length || 0,
              toppers: toppersQuery.data?.length || 0,
              gallery: galleryQuery.data?.length || 0,
            }}
          />
        );
      case "activities":
        return <ActivityManager />;
      case "staff":
        return <StaffManager />;
      case "toppers":
        return <TopperManager />;
      case "gallery":
        return <GalleryManager />;
      case "reviews": // Added reviews case
        return <ReviewManager />;
      case "settings": // Changed from 'music' to 'settings' to match sidebar if I update sidebar
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <BackgroundMusicSettings />
          </div>
        );
      default:
        return <Dashboard stats={{ activities: 0, staff: 0, toppers: 0, gallery: 0 }} />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default Admin;
