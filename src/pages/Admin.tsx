import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, LogOut, Pencil, Plus, Trash2, UploadCloud } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ImageUpload } from "@/components/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  deleteActivity,
  deleteGalleryImage,
  deleteHomepageReview,
  deleteStaffMember,
  deleteTopper,
  fetchActivities,
  fetchGalleryImages,
  fetchHomepageReviews,
  fetchStaff,
  fetchToppers,
  insertActivity,
  insertGalleryImage,
  insertHomepageReview,
  insertStaffMember,
  insertTopper,
  updateActivity,
  updateGalleryImage,
  updateHomepageReview,
  updateStaffMember,
  updateTopper,
  type ActivityRecord,
  type GalleryRecord,
  type ReviewRecord,
  type StaffRecord,
  type TopperRecord,
} from "@/services/content";
import { uploadImage } from "@/lib/imageUpload";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const activitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  activity_date: z.string().min(1, "Date is required"),
  image_url: z.string().optional(),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
  is_published: z.boolean(),
});

const staffSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  qualification: z.string().optional(),
  photo_url: z.string().optional(),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
  is_active: z.boolean(),
});

const topperSchema = z.object({
  student_name: z.string().min(1, "Name is required"),
  class_name: z.string().min(1, "Class is required"),
  percentage: z.coerce.number().min(0).max(100),
  exam_year: z.union([z.string(), z.number(), z.null()]).optional(),
  photo_url: z.string().optional(),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
  is_active: z.boolean(),
});

const reviewSchema = z.object({
  author_name: z.string().min(1, "Name is required"),
  author_role: z.string().optional(),
  content: z.string().min(10, "Review must contain at least 10 characters"),
  rating: z.union([
    z.coerce.number().min(0, "Rating cannot be negative").max(5, "Rating cannot exceed 5"),
    z.literal(null),
  ]),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
  is_featured: z.boolean(),
});

const gallerySchema = z.object({
  image_url: z.string().min(1, "Image is required"),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
  is_published: z.boolean(),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type ActivityFormValues = z.infer<typeof activitySchema>;
type StaffFormValues = z.infer<typeof staffSchema>;
type TopperFormValues = z.infer<typeof topperSchema>;
type ReviewFormValues = z.infer<typeof reviewSchema>;
type GalleryFormValues = z.infer<typeof gallerySchema>;

interface EntityDialogState<T> {
  mode: "create" | "edit";
  record?: T;
}

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activityDialog, setActivityDialog] = useState<EntityDialogState<ActivityRecord> | null>(null);
  const [staffDialog, setStaffDialog] = useState<EntityDialogState<StaffRecord> | null>(null);
  const [topperDialog, setTopperDialog] = useState<EntityDialogState<TopperRecord> | null>(null);
  const [reviewDialog, setReviewDialog] = useState<EntityDialogState<ReviewRecord> | null>(null);
  const [galleryDialog, setGalleryDialog] = useState<EntityDialogState<GalleryRecord> | null>(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ total: 0, completed: 0, failed: 0 });
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);

  const [activityToDelete, setActivityToDelete] = useState<ActivityRecord | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffRecord | null>(null);
  const [topperToDelete, setTopperToDelete] = useState<TopperRecord | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewRecord | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<GalleryRecord | null>(null);

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    let isMounted = true;

    const verifyAdmin = async (currentSession: Session) => {
      setIsCheckingAdmin(true);
      
      // Check if user has admin role in metadata
      const userRole = currentSession.user.user_metadata?.role;
      
      if (!isMounted) return;

      if (userRole === "admin") {
        setAuthError(null);
        setIsAdmin(true);
      } else {
        setAuthError("Your account is not authorised for this admin panel. Contact the site owner.");
        setIsAdmin(false);
      }

      setIsCheckingAdmin(false);
    };

    const syncSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (error) {
        setAuthError(error.message);
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

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        void verifyAdmin(nextSession);
      } else {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
      }
    });

    void syncSession();

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

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

  const reviewsQuery = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: () => fetchHomepageReviews(true),
    enabled: isAdmin,
  });

  const galleryQuery = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: () => fetchGalleryImages(true),
    enabled: isAdmin,
  });

  const nextActivitySortOrder = useMemo(() => {
    if (!activitiesQuery.data?.length) return 0;
    return Math.max(...activitiesQuery.data.map((item) => item.sort_order)) + 1;
  }, [activitiesQuery.data]);

  const nextStaffSortOrder = useMemo(() => {
    if (!staffQuery.data?.length) return 0;
    return Math.max(...staffQuery.data.map((item) => item.sort_order)) + 1;
  }, [staffQuery.data]);

  const nextTopperSortOrder = useMemo(() => {
    if (!toppersQuery.data?.length) return 0;
    return Math.max(...toppersQuery.data.map((item) => item.sort_order)) + 1;
  }, [toppersQuery.data]);

  const nextReviewSortOrder = useMemo(() => {
    if (!reviewsQuery.data?.length) return 0;
    return Math.max(...reviewsQuery.data.map((item) => item.sort_order)) + 1;
  }, [reviewsQuery.data]);

  const nextGallerySortOrder = useMemo(() => {
    if (!galleryQuery.data?.length) return 0;
    return Math.max(...galleryQuery.data.map((item) => item.sort_order)) + 1;
  }, [galleryQuery.data]);

  const resetBulkState = useCallback(() => {
    setBulkProgress({ total: 0, completed: 0, failed: 0 });
    setBulkErrors([]);
  }, []);

  const handleBulkDialogOpenChange = useCallback(
    (open: boolean) => {
      if (isBulkUploading) return;
      setIsBulkUploadOpen(open);
      resetBulkState();
    },
    [isBulkUploading, resetBulkState]
  );

  const handleBulkFilesAccepted = useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      setBulkErrors([]);
      setBulkProgress({ total: files.length, completed: 0, failed: 0 });
      setIsBulkUploading(true);

      let sortOrder = Number.isFinite(nextGallerySortOrder) ? nextGallerySortOrder : 0;
      let completed = 0;
      let failed = 0;
      const failures: string[] = [];

      for (const file of files) {
        try {
          const { url } = await uploadImage(file, "gallery");
          await insertGalleryImage({
            image_url: url,
            sort_order: sortOrder++,
            is_published: true,
          });
          completed += 1;
        } catch (error) {
          failed += 1;
          failures.push(`${file.name}: ${error instanceof Error ? error.message : "Upload failed"}`);
        }

        setBulkProgress({ total: files.length, completed, failed });
      }

      await queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      await queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });

      if (completed > 0) {
        toast({
          title: "Bulk upload complete",
          description: `${completed} image${completed === 1 ? "" : "s"} uploaded successfully.`,
        });
      }

      if (failures.length) {
        setBulkErrors(failures);
        toast({
          title: "Some uploads failed",
          description: failures.slice(0, 3).join(" • "),
          variant: "destructive",
        });
      } else {
        setIsBulkUploadOpen(false);
        resetBulkState();
      }

      setIsBulkUploading(false);
    },
    [nextGallerySortOrder, queryClient, resetBulkState, toast, insertGalleryImage, uploadImage]
  );

  const handleSignIn = signInForm.handleSubmit(async (values) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setAuthError(error.message);
    toast({
        title: "Unable to sign in",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed in",
        description: "Welcome back! Loading your admin workspace.",
      });
    }
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    queryClient.removeQueries({ queryKey: ["admin"] });
    toast({
      title: "Signed out",
      description: "You have been signed out of the admin panel.",
    });
  };

  const activityCreateMutation = useMutation({
    mutationFn: insertActivity,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
      toast({ title: "Activity created", description: "The activity has been added successfully." });
      setActivityDialog(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to create activity", description: error.message, variant: "destructive" });
    },
  });

  const activityUpdateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<ActivityRecord> }) =>
      updateActivity(id, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
      toast({ title: "Activity updated", description: "Changes saved successfully." });
      setActivityDialog(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to update activity", description: error.message, variant: "destructive" });
    },
  });

  const activityDeleteMutation = useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
      toast({ title: "Activity removed", description: "The activity has been deleted." });
      setActivityToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to delete activity", description: error.message, variant: "destructive" });
    },
  });

  const staffCreateMutation = useMutation({
    mutationFn: insertStaffMember,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
      toast({ title: "Staff member added", description: "The staff profile is live." });
      setStaffDialog(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to add staff member", description: error.message, variant: "destructive" });
    },
  });

  const staffUpdateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<StaffRecord> }) =>
      updateStaffMember(id, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
      toast({ title: "Staff member updated", description: "Changes saved successfully." });
      setStaffDialog(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to update staff member", description: error.message, variant: "destructive" });
    },
  });

  const staffDeleteMutation = useMutation({
    mutationFn: (id: string) => deleteStaffMember(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
      toast({ title: "Staff member removed", description: "The staff profile has been deleted." });
      setStaffToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to delete staff member", description: error.message, variant: "destructive" });
    },
  });

  const topperCreateMutation = useMutation({
    mutationFn: insertTopper,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "toppers"] });
      toast({ title: "Topper added", description: "The topper profile is now visible." });
      setTopperDialog(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to add topper", description: error.message, variant: "destructive" });
    },
  });

  const topperUpdateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<TopperRecord> }) =>
      updateTopper(id, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "toppers"] });
      toast({ title: "Topper updated", description: "Changes saved successfully." });
      setTopperDialog(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to update topper", description: error.message, variant: "destructive" });
    },
  });

  const topperDeleteMutation = useMutation({
    mutationFn: (id: string) => deleteTopper(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "toppers"] });
      toast({ title: "Topper removed", description: "The topper entry has been deleted." });
      setTopperToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to delete topper", description: error.message, variant: "destructive" });
    },
  });

  const reviewCreateMutation = useMutation({
    mutationFn: insertHomepageReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast({ title: "Review added", description: "The review is live on the homepage." });
      setReviewDialog(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to add review", description: error.message, variant: "destructive" });
    },
  });

  const reviewUpdateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<ReviewRecord> }) =>
      updateHomepageReview(id, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast({ title: "Review updated", description: "Changes saved successfully." });
      setReviewDialog(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to update review", description: error.message, variant: "destructive" });
    },
  });

  const reviewDeleteMutation = useMutation({
    mutationFn: (id: string) => deleteHomepageReview(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast({ title: "Review removed", description: "The review has been deleted." });
      setReviewToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to delete review", description: error.message, variant: "destructive" });
    },
  });

  const galleryCreateMutation = useMutation({
    mutationFn: insertGalleryImage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      void queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });
      toast({ title: "Gallery image added", description: "The image has been added to the gallery." });
      setGalleryDialog(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to add image", description: error.message, variant: "destructive" });
    },
  });

  const galleryUpdateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<GalleryRecord> }) =>
      updateGalleryImage(id, values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      void queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });
      toast({ title: "Gallery image updated", description: "Changes saved successfully." });
      setGalleryDialog(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to update image", description: error.message, variant: "destructive" });
    },
  });

  const galleryDeleteMutation = useMutation({
    mutationFn: (id: string) => deleteGalleryImage(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
      void queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });
      toast({ title: "Gallery image removed", description: "The image has been deleted." });
      setGalleryToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Unable to delete image", description: error.message, variant: "destructive" });
    },
  });

  const renderLoadingState = (label: string) => (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm uppercase tracking-wider">{label}</p>
    </div>
  );

  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2 border border-dashed border-border rounded-lg">
      <p className="text-sm uppercase tracking-widest">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <PageHero
        title="Admin Panel"
        description="Manage your school's content, events, and key information with streamlined tools designed for administrators."
        eyebrow="School Operations"
      />

      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {isCheckingAdmin ? (
            renderLoadingState("Checking admin access")
          ) : !session ? (
            <Card className="mx-auto max-w-md border-border bg-card">
              <CardHeader>
                <CardTitle className="uppercase tracking-wider text-center">Administrator Sign In</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...signInForm}>
                  <form className="space-y-6" onSubmit={handleSignIn}>
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" type="password" autoComplete="current-password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {authError ? <p className="text-sm text-destructive">{authError}</p> : null}
                    <Button
                      type="submit"
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      disabled={signInForm.formState.isSubmitting}
                    >
                      {signInForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Signing in
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : !isAdmin ? (
            <Card className="mx-auto max-w-xl border border-destructive/40 bg-destructive/10">
              <CardHeader>
                <CardTitle className="uppercase tracking-wider text-destructive">Access Restricted</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Your account is signed in but does not have permission to manage the admin panel.</p>
                <p>Please contact the project owner to add admin role to your user metadata in Supabase.</p>
                <p className="text-xs bg-muted p-2 rounded font-mono">User Metadata → {`{"role": "admin"}`}</p>
                {authError ? <p className="text-destructive">{authError}</p> : null}
                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Signed in as {session.user.email}
                </p>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>

              <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-card border border-border h-auto p-2">
              <TabsTrigger 
                value="activities" 
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold uppercase tracking-wider py-3"
              >
                Activities
              </TabsTrigger>
              <TabsTrigger 
                value="staff"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold uppercase tracking-wider py-3"
              >
                Staff
              </TabsTrigger>
              <TabsTrigger 
                value="toppers"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold uppercase tracking-wider py-3"
              >
                Toppers
              </TabsTrigger>
              <TabsTrigger 
                    value="reviews"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold uppercase tracking-wider py-3"
              >
                    Reviews
              </TabsTrigger>
              <TabsTrigger 
                value="gallery"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold uppercase tracking-wider py-3"
              >
                Gallery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4 mt-8">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="uppercase tracking-wider">Manage Activities</CardTitle>
                  <Button 
                        onClick={() =>
                          setActivityDialog({
                            mode: "create",
                            record: undefined,
                          })
                        }
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                      {activitiesQuery.isLoading ? (
                        renderLoadingState("Loading activities")
                      ) : !activitiesQuery.data?.length ? (
                        renderEmptyState("No activities yet. Start by adding the first event.")
                      ) : (
                  <div className="space-y-4">
                          {activitiesQuery.data.map((activity) => (
                      <Card key={activity.id} className="bg-background border-border">
                        <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                                      <span className="font-semibold text-secondary">Order {activity.sort_order}</span>
                                      <span>•</span>
                                      <span>
                                        {new Date(activity.activity_date).toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </span>
                                      {!activity.is_published ? <span className="text-amber-500">Draft</span> : null}
                            </div>
                                    <h3 className="font-bold text-lg uppercase tracking-wider">{activity.title}</h3>
                                    {activity.description ? (
                                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                                    ) : null}
                                    {activity.image_url ? (
                                      <a
                                        href={activity.image_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-secondary underline underline-offset-4"
                                      >
                                        View image reference
                                      </a>
                                    ) : null}
                                  </div>
                                  <div className="flex items-center md:flex-col gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="border-border hover:border-secondary"
                                      onClick={() => setActivityDialog({ mode: "edit", record: activity })}
                                    >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                      onClick={() => setActivityToDelete(activity)}
                                      disabled={activityDeleteMutation.isPending && activityToDelete?.id === activity.id}
                              >
                                      {activityDeleteMutation.isPending && activityToDelete?.id === activity.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                <Trash2 className="h-4 w-4" />
                                      )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                      )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="space-y-4 mt-8">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="uppercase tracking-wider">Manage Staff</CardTitle>
                  <Button 
                        onClick={() =>
                          setStaffDialog({
                            mode: "create",
                            record: undefined,
                          })
                        }
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                      {staffQuery.isLoading ? (
                        renderLoadingState("Loading staff members")
                      ) : !staffQuery.data?.length ? (
                        renderEmptyState("No staff profiles available yet.")
                      ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                          {staffQuery.data.map((member) => (
                      <Card key={member.id} className="bg-background border-border">
                        <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                  {member.photo_url ? (
                            <img
                                      src={member.photo_url}
                                      alt={member.full_name}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                                  ) : (
                                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                                      No Photo
                                    </div>
                                  )}
                                  <div className="flex-1 space-y-2">
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                                      Order {member.sort_order} {member.is_active ? "• Active" : "• Hidden"}
                                    </p>
                                    <div>
                                      <h3 className="font-bold uppercase tracking-wider">{member.full_name}</h3>
                                      <p className="text-sm text-secondary font-semibold">{member.designation}</p>
                                    </div>
                                    {member.qualification ? (
                              <p className="text-xs text-muted-foreground">{member.qualification}</p>
                                    ) : null}
                            </div>
                            <div className="flex flex-col space-y-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="border-border hover:border-secondary"
                                      onClick={() => setStaffDialog({ mode: "edit", record: member })}
                                    >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                      onClick={() => setStaffToDelete(member)}
                                      disabled={staffDeleteMutation.isPending && staffToDelete?.id === member.id}
                              >
                                      {staffDeleteMutation.isPending && staffToDelete?.id === member.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                <Trash2 className="h-4 w-4" />
                                      )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                      )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="toppers" className="space-y-4 mt-8">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="uppercase tracking-wider">Manage Toppers</CardTitle>
                  <Button 
                        onClick={() =>
                          setTopperDialog({
                            mode: "create",
                            record: undefined,
                          })
                        }
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                      {toppersQuery.isLoading ? (
                        renderLoadingState("Loading toppers")
                      ) : !toppersQuery.data?.length ? (
                        renderEmptyState("No toppers recorded yet.")
                      ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                          {toppersQuery.data.map((topper) => (
                      <Card key={topper.id} className="bg-background border-border">
                              <CardContent className="pt-6 text-center space-y-4">
                                <div className="flex flex-col items-center gap-3">
                                  {topper.photo_url ? (
                                    <img
                                      src={topper.photo_url}
                                      alt={topper.student_name}
                                      className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
                                    />
                                  ) : (
                                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                                      No Photo
                                    </div>
                                  )}
                                  <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    Order {topper.sort_order} {topper.is_active ? "• Featured" : "• Hidden"}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <h3 className="font-bold uppercase tracking-wider">{topper.student_name}</h3>
                                  <p className="text-sm text-secondary font-bold">{topper.class_name}</p>
                                  <p className="text-3xl font-black text-secondary mt-2">
                                    {topper.percentage.toFixed(2)}%
                                  </p>
                                  {topper.exam_year ? (
                                    <p className="text-xs text-muted-foreground">Batch {topper.exam_year}</p>
                                  ) : null}
                                </div>
                                <div className="flex justify-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-border hover:border-secondary"
                                    onClick={() => setTopperDialog({ mode: "edit", record: topper })}
                                  >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                                    onClick={() => setTopperToDelete(topper)}
                                    disabled={topperDeleteMutation.isPending && topperToDelete?.id === topper.id}
                            >
                                    {topperDeleteMutation.isPending && topperToDelete?.id === topper.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                              <Trash2 className="h-4 w-4" />
                                    )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                      )}
                </CardContent>
              </Card>
            </TabsContent>

                <TabsContent value="reviews" className="space-y-4 mt-8">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="uppercase tracking-wider">Homepage Reviews</CardTitle>
                  <Button 
                        onClick={() =>
                          setReviewDialog({
                            mode: "create",
                            record: undefined,
                          })
                        }
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                      {reviewsQuery.isLoading ? (
                        renderLoadingState("Loading reviews")
                      ) : !reviewsQuery.data?.length ? (
                        renderEmptyState("No reviews yet. Add testimonials to highlight your school.")
                      ) : (
                        <div className="space-y-4">
                          {reviewsQuery.data.map((review) => (
                            <Card key={review.id} className="bg-background border-border">
                              <CardContent className="pt-6 space-y-3">
                                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                  <span>Order {review.sort_order}</span>
                                  {review.is_featured ? (
                                    <span className="text-secondary">Featured</span>
                                  ) : (
                                    <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-600 font-semibold">
                                      Pending Approval
                                    </span>
                                  )}
                                  {review.rating !== null ? (
                                    <span className="text-secondary">{review.rating.toFixed(1)} / 5</span>
                                  ) : null}
                                </div>
                                <div>
                                  <h3 className="font-semibold uppercase tracking-wider">{review.author_name}</h3>
                                  {review.author_role ? (
                                    <p className="text-xs text-muted-foreground">{review.author_role}</p>
                                  ) : null}
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground">"{review.content}"</p>
                                <div className="flex gap-2">
                                  {!review.is_featured && (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                      onClick={() => {
                                        reviewUpdateMutation.mutate({
                                          id: review.id,
                                          values: { is_featured: true },
                                        });
                                      }}
                                      disabled={reviewUpdateMutation.isPending}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve & Feature
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-border hover:border-secondary"
                                    onClick={() => setReviewDialog({ mode: "edit", record: review })}
                                  >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                                    onClick={() => setReviewToDelete(review)}
                                    disabled={reviewDeleteMutation.isPending && reviewToDelete?.id === review.id}
                            >
                                    {reviewDeleteMutation.isPending && reviewToDelete?.id === review.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                              <Trash2 className="h-4 w-4" />
                                    )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                      )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4 mt-8">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="uppercase tracking-wider">Gallery Images</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleBulkDialogOpenChange(true)}
                      disabled={isBulkUploading}
                      className="font-semibold uppercase"
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Bulk Upload
                    </Button>
                    <Button
                      onClick={() =>
                        setGalleryDialog({
                          mode: "create",
                          record: undefined,
                        })
                      }
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {galleryQuery.isLoading ? (
                    renderLoadingState("Loading gallery images")
                  ) : !galleryQuery.data?.length ? (
                    renderEmptyState("No gallery images yet. Add photos to showcase your school.")
                  ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                      {galleryQuery.data.map((image) => (
                        <Card key={image.id} className="overflow-hidden bg-background border-border">
                          <div className="relative aspect-[4/3]">
                            <img
                              src={image.image_url}
                              alt="Gallery image"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              {image.is_published ? (
                                <span className="bg-secondary/90 text-secondary-foreground px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wider rounded">
                                  Published
                                </span>
                              ) : (
                                <span className="bg-muted/90 text-muted-foreground px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wider rounded">
                                  Draft
                                </span>
                              )}
                            </div>
                          </div>
                          <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                              <span>Order {image.sort_order}</span>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="border-border hover:border-secondary"
                                onClick={() => setGalleryDialog({ mode: "edit", record: image })}
                              >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                                onClick={() => setGalleryToDelete(image)}
                                disabled={galleryDeleteMutation.isPending && galleryToDelete?.id === image.id}
                            >
                                {galleryDeleteMutation.isPending && galleryToDelete?.id === image.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                              <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ActivityFormDialog
        open={Boolean(activityDialog)}
        mode={activityDialog?.mode ?? "create"}
        initialData={activityDialog?.record}
        onOpenChange={(open) => (!open ? setActivityDialog(null) : null)}
        onSubmit={async (values) => {
          const payload = {
            title: values.title,
            description: values.description?.trim() ? values.description.trim() : null,
            activity_date: values.activity_date,
            image_url: values.image_url?.trim() ? values.image_url.trim() : null,
            sort_order: values.sort_order,
            is_published: values.is_published,
          };

          if (activityDialog?.mode === "edit" && activityDialog.record) {
            await activityUpdateMutation.mutateAsync({ id: activityDialog.record.id, values: payload });
          } else {
            await activityCreateMutation.mutateAsync(payload);
          }
        }}
        isSubmitting={activityCreateMutation.isPending || activityUpdateMutation.isPending}
        defaultSortOrder={nextActivitySortOrder}
      />

      <StaffFormDialog
        open={Boolean(staffDialog)}
        mode={staffDialog?.mode ?? "create"}
        initialData={staffDialog?.record}
        onOpenChange={(open) => (!open ? setStaffDialog(null) : null)}
        onSubmit={async (values) => {
          const payload = {
            full_name: values.full_name,
            designation: values.designation,
            qualification: values.qualification?.trim() ? values.qualification.trim() : null,
            photo_url: values.photo_url?.trim() ? values.photo_url.trim() : null,
            sort_order: values.sort_order,
            is_active: values.is_active,
          };

          if (staffDialog?.mode === "edit" && staffDialog.record) {
            await staffUpdateMutation.mutateAsync({ id: staffDialog.record.id, values: payload });
          } else {
            await staffCreateMutation.mutateAsync(payload);
          }
        }}
        isSubmitting={staffCreateMutation.isPending || staffUpdateMutation.isPending}
        defaultSortOrder={nextStaffSortOrder}
      />

      <TopperFormDialog
        open={Boolean(topperDialog)}
        mode={topperDialog?.mode ?? "create"}
        initialData={topperDialog?.record}
        onOpenChange={(open) => (!open ? setTopperDialog(null) : null)}
        onSubmit={async (values) => {
          const payload = {
            student_name: values.student_name,
            class_name: values.class_name,
            percentage: values.percentage,
            exam_year:
              values.exam_year === "" || values.exam_year === null
                ? null
                : typeof values.exam_year === "number"
                ? values.exam_year
                : Number(values.exam_year),
            photo_url: values.photo_url?.trim() ? values.photo_url.trim() : null,
            sort_order: values.sort_order,
            is_active: values.is_active,
          };

          if (payload.exam_year !== null && Number.isNaN(payload.exam_year)) {
            toast({
              title: "Invalid year",
              description: "Please provide a valid exam year or leave the field blank.",
              variant: "destructive",
            });
            return;
          }

          if (topperDialog?.mode === "edit" && topperDialog.record) {
            await topperUpdateMutation.mutateAsync({ id: topperDialog.record.id, values: payload });
          } else {
            await topperCreateMutation.mutateAsync(payload);
          }
        }}
        isSubmitting={topperCreateMutation.isPending || topperUpdateMutation.isPending}
        defaultSortOrder={nextTopperSortOrder}
      />

      <ReviewFormDialog
        open={Boolean(reviewDialog)}
        mode={reviewDialog?.mode ?? "create"}
        initialData={reviewDialog?.record}
        onOpenChange={(open) => (!open ? setReviewDialog(null) : null)}
        onSubmit={async (values) => {
          const payload = {
            author_name: values.author_name,
            author_role: values.author_role?.trim() ? values.author_role.trim() : null,
            content: values.content.trim(),
            rating: values.rating === null || Number.isNaN(values.rating) ? null : values.rating,
            sort_order: values.sort_order,
            is_featured: values.is_featured,
          };

          if (reviewDialog?.mode === "edit" && reviewDialog.record) {
            await reviewUpdateMutation.mutateAsync({ id: reviewDialog.record.id, values: payload });
          } else {
            await reviewCreateMutation.mutateAsync(payload);
          }
        }}
        isSubmitting={reviewCreateMutation.isPending || reviewUpdateMutation.isPending}
        defaultSortOrder={nextReviewSortOrder}
      />

      <DeleteConfirmDialog
        open={Boolean(activityToDelete)}
        title="Delete activity?"
        description="This action cannot be undone. The activity will be permanently removed."
        onConfirm={() => {
          if (activityToDelete) {
            activityDeleteMutation.mutate(activityToDelete.id);
          }
        }}
        onCancel={() => setActivityToDelete(null)}
        isDeleting={activityDeleteMutation.isPending}
      />

      <DeleteConfirmDialog
        open={Boolean(staffToDelete)}
        title="Delete staff member?"
        description="This action cannot be undone. The staff profile will be permanently removed."
        onConfirm={() => {
          if (staffToDelete) {
            staffDeleteMutation.mutate(staffToDelete.id);
          }
        }}
        onCancel={() => setStaffToDelete(null)}
        isDeleting={staffDeleteMutation.isPending}
      />

      <DeleteConfirmDialog
        open={Boolean(topperToDelete)}
        title="Delete topper?"
        description="This action cannot be undone. The topper entry will be permanently removed."
        onConfirm={() => {
          if (topperToDelete) {
            topperDeleteMutation.mutate(topperToDelete.id);
          }
        }}
        onCancel={() => setTopperToDelete(null)}
        isDeleting={topperDeleteMutation.isPending}
      />

      <DeleteConfirmDialog
        open={Boolean(reviewToDelete)}
        title="Delete review?"
        description="This action cannot be undone. The review will be permanently removed."
        onConfirm={() => {
          if (reviewToDelete) {
            reviewDeleteMutation.mutate(reviewToDelete.id);
          }
        }}
        onCancel={() => setReviewToDelete(null)}
        isDeleting={reviewDeleteMutation.isPending}
      />

      <GalleryFormDialog
        open={Boolean(galleryDialog)}
        mode={galleryDialog?.mode ?? "create"}
        initialData={galleryDialog?.record}
        onOpenChange={(open) => (!open ? setGalleryDialog(null) : null)}
        onSubmit={async (values) => {
          const payload = {
            title: null,
            category: null,
            image_url: values.image_url,
            sort_order: values.sort_order,
            is_published: values.is_published,
          };

          if (galleryDialog?.mode === "edit" && galleryDialog.record) {
            await galleryUpdateMutation.mutateAsync({ id: galleryDialog.record.id, values: payload });
          } else {
            await galleryCreateMutation.mutateAsync(payload);
          }
        }}
        isSubmitting={galleryCreateMutation.isPending || galleryUpdateMutation.isPending}
        defaultSortOrder={nextGallerySortOrder}
      />

      <DeleteConfirmDialog
        open={Boolean(galleryToDelete)}
        title="Delete gallery image?"
        description="This action cannot be undone. The image will be permanently removed from the gallery."
        onConfirm={() => {
          if (galleryToDelete) {
            galleryDeleteMutation.mutate(galleryToDelete.id);
          }
        }}
        onCancel={() => setGalleryToDelete(null)}
        isDeleting={galleryDeleteMutation.isPending}
      />

      <BulkGalleryUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={handleBulkDialogOpenChange}
        onFilesAccepted={handleBulkFilesAccepted}
        isUploading={isBulkUploading}
        progress={bulkProgress}
        errors={bulkErrors}
      />
    </div>
  );
};

interface ActivityFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: ActivityRecord;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ActivityFormValues) => Promise<void>;
  isSubmitting: boolean;
  defaultSortOrder: number;
}

const ActivityFormDialog = ({
  open,
  mode,
  initialData,
  onOpenChange,
  onSubmit,
  isSubmitting,
  defaultSortOrder,
}: ActivityFormDialogProps) => {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      activity_date: initialData?.activity_date
        ? initialData.activity_date.substring(0, 10)
        : "",
      image_url: initialData?.image_url ?? "",
      sort_order: initialData?.sort_order ?? defaultSortOrder,
      is_published: initialData?.is_published ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: initialData?.title ?? "",
        description: initialData?.description ?? "",
        activity_date: initialData?.activity_date
          ? initialData.activity_date.substring(0, 10)
          : "",
        image_url: initialData?.image_url ?? "",
        sort_order: initialData?.sort_order ?? defaultSortOrder,
        is_published: initialData?.is_published ?? true,
      });
    }
  }, [open, initialData, defaultSortOrder, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset({
      title: "",
      description: "",
      activity_date: "",
      image_url: "",
      sort_order: defaultSortOrder,
      is_published: true,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wider">
            {mode === "edit" ? "Edit Activity" : "Add Activity"}
          </DialogTitle>
          <DialogDescription>Publish events, announcements, and co-curricular updates.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4 overflow-y-auto flex-1 pr-2" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Optional summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="activity_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="activities"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-3">
                  <div>
                    <FormLabel className="uppercase tracking-wider text-xs">Published</FormLabel>
                    <p className="text-xs text-muted-foreground">Toggle visibility on the public site.</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {mode === "edit" ? "Save Changes" : "Create Activity"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface StaffFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: StaffRecord;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StaffFormValues) => Promise<void>;
  isSubmitting: boolean;
  defaultSortOrder: number;
}

const StaffFormDialog = ({
  open,
  mode,
  initialData,
  onOpenChange,
  onSubmit,
  isSubmitting,
  defaultSortOrder,
}: StaffFormDialogProps) => {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      full_name: initialData?.full_name ?? "",
      designation: initialData?.designation ?? "",
      qualification: initialData?.qualification ?? "",
      photo_url: initialData?.photo_url ?? "",
      sort_order: initialData?.sort_order ?? defaultSortOrder,
      is_active: initialData?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        full_name: initialData?.full_name ?? "",
        designation: initialData?.designation ?? "",
        qualification: initialData?.qualification ?? "",
        photo_url: initialData?.photo_url ?? "",
        sort_order: initialData?.sort_order ?? defaultSortOrder,
        is_active: initialData?.is_active ?? true,
      });
    }
  }, [open, initialData, defaultSortOrder, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset({
      full_name: "",
      designation: "",
      qualification: "",
      photo_url: "",
      sort_order: defaultSortOrder,
      is_active: true,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wider">
            {mode === "edit" ? "Edit Staff Member" : "Add Staff Member"}
          </DialogTitle>
          <DialogDescription>Introduce key educators and administrators.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4 overflow-y-auto flex-1 pr-2" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Prof. Ananya Sharma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Principal, Academic Dean…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualification</FormLabel>
                  <FormControl>
                    <Input placeholder="M.Ed., Ph.D. Education" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Photo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="staff"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-3">
                    <div>
                      <FormLabel className="uppercase tracking-wider text-xs">Visible</FormLabel>
                      <p className="text-xs text-muted-foreground">Toggle whether this profile appears publicly.</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {mode === "edit" ? "Save Changes" : "Create Profile"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface TopperFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: TopperRecord;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TopperFormValues) => Promise<void>;
  isSubmitting: boolean;
  defaultSortOrder: number;
}

const TopperFormDialog = ({
  open,
  mode,
  initialData,
  onOpenChange,
  onSubmit,
  isSubmitting,
  defaultSortOrder,
}: TopperFormDialogProps) => {
  const form = useForm<TopperFormValues>({
    resolver: zodResolver(topperSchema),
    defaultValues: {
      student_name: initialData?.student_name ?? "",
      class_name: initialData?.class_name ?? "",
      percentage: initialData?.percentage ?? 0,
      exam_year: initialData?.exam_year ?? "",
      photo_url: initialData?.photo_url ?? "",
      sort_order: initialData?.sort_order ?? defaultSortOrder,
      is_active: initialData?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        student_name: initialData?.student_name ?? "",
        class_name: initialData?.class_name ?? "",
        percentage: initialData?.percentage ?? 0,
        exam_year: initialData?.exam_year ?? "",
        photo_url: initialData?.photo_url ?? "",
        sort_order: initialData?.sort_order ?? defaultSortOrder,
        is_active: initialData?.is_active ?? true,
      });
    }
  }, [open, initialData, defaultSortOrder, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset({
      student_name: "",
      class_name: "",
      percentage: 0,
      exam_year: "",
      photo_url: "",
      sort_order: defaultSortOrder,
      is_active: true,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wider">
            {mode === "edit" ? "Edit Topper" : "Add Topper"}
          </DialogTitle>
          <DialogDescription>Highlight outstanding academic achievements.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4 overflow-y-auto flex-1 pr-2" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="student_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rohan Patel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="class_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class / Grade</FormLabel>
                  <FormControl>
                    <Input placeholder="Class X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={100} step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exam_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Year (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1990} max={2100} placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="photo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Photo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="toppers"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-3">
                    <div>
                      <FormLabel className="uppercase tracking-wider text-xs">Featured</FormLabel>
                      <p className="text-xs text-muted-foreground">Hide or show on the public toppers section.</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {mode === "edit" ? "Save Changes" : "Create Entry"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface ReviewFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: ReviewRecord;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ReviewFormValues) => Promise<void>;
  isSubmitting: boolean;
  defaultSortOrder: number;
}

const ReviewFormDialog = ({
  open,
  mode,
  initialData,
  onOpenChange,
  onSubmit,
  isSubmitting,
  defaultSortOrder,
}: ReviewFormDialogProps) => {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author_name: initialData?.author_name ?? "",
      author_role: initialData?.author_role ?? "",
      content: initialData?.content ?? "",
      rating: initialData?.rating ?? null,
      sort_order: initialData?.sort_order ?? defaultSortOrder,
      is_featured: initialData?.is_featured ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        author_name: initialData?.author_name ?? "",
        author_role: initialData?.author_role ?? "",
        content: initialData?.content ?? "",
        rating: initialData?.rating ?? null,
        sort_order: initialData?.sort_order ?? defaultSortOrder,
        is_featured: initialData?.is_featured ?? true,
      });
    }
  }, [open, initialData, defaultSortOrder, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset({
      author_name: "",
      author_role: "",
      content: "",
      rating: null,
      sort_order: defaultSortOrder,
      is_featured: true,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wider">
            {mode === "edit" ? "Edit Review" : "Add Review"}
          </DialogTitle>
          <DialogDescription>Share testimonials from parents, alumni, or partners.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4 overflow-y-auto flex-1 pr-2" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="author_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Sunita Verma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Parent, Class X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Share their experience…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={5}
                        step="0.1"
                        value={field.value === null ? "" : field.value}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value === "" ? null : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-3">
                  <div>
                    <FormLabel className="uppercase tracking-wider text-xs">Featured</FormLabel>
                    <p className="text-xs text-muted-foreground">Toggle to hide the review from the homepage.</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {mode === "edit" ? "Save Changes" : "Create Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface GalleryFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: GalleryRecord;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GalleryFormValues) => Promise<void>;
  isSubmitting: boolean;
  defaultSortOrder: number;
}

const GalleryFormDialog = ({
  open,
  mode,
  initialData,
  onOpenChange,
  onSubmit,
  isSubmitting,
  defaultSortOrder,
}: GalleryFormDialogProps) => {
  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      image_url: initialData?.image_url ?? "",
      sort_order: initialData?.sort_order ?? defaultSortOrder,
      is_published: initialData?.is_published ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        image_url: initialData?.image_url ?? "",
        sort_order: initialData?.sort_order ?? defaultSortOrder,
        is_published: initialData?.is_published ?? true,
      });
    }
  }, [open, initialData, defaultSortOrder, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset({
      image_url: "",
      sort_order: defaultSortOrder,
      is_published: true,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wider">
            {mode === "edit" ? "Edit Gallery Image" : "Add Gallery Image"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the gallery image details below."
              : "Fill in the details to add a new image to the gallery."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gallery Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="gallery"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-3">
                  <div>
                    <FormLabel className="uppercase tracking-wider text-xs">Published</FormLabel>
                    <p className="text-xs text-muted-foreground">Toggle to hide the image from the public gallery.</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {mode === "edit" ? "Save Changes" : "Add Image"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmDialog = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmDialogProps) => (
  <AlertDialog open={open} onOpenChange={(value) => (value ? null : onCancel())}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel type="button" onClick={onCancel}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

interface BulkGalleryUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesAccepted: (files: File[]) => void | Promise<void>;
  isUploading: boolean;
  progress: { total: number; completed: number; failed: number };
  errors: string[];
}

const BulkGalleryUploadDialog = ({
  open,
  onOpenChange,
  onFilesAccepted,
  isUploading,
  progress,
  errors,
}: BulkGalleryUploadDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const triggerFilePicker = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFiles = (files: File[]) => {
    if (!files.length || isUploading) return;
    void onFilesAccepted(files);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    handleFiles(files);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    if (isUploading) return;

    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    handleFiles(imageFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isUploading) {
      event.dataTransfer.dropEffect = "none";
      return;
    }
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const dropAreaClasses = [
    "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/30 py-12 text-center transition",
    isDragOver ? "border-secondary bg-secondary/10" : "",
    isUploading ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-muted/50",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-wider">Bulk Upload Images</DialogTitle>
          <DialogDescription>Drag and drop multiple images or click to browse your files.</DialogDescription>
        </DialogHeader>
        <div
          className={dropAreaClasses}
          onClick={triggerFilePicker}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleInputChange}
            disabled={isUploading}
          />
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Uploading images…</p>
              {progress.total > 0 && (
                <p className="text-xs text-muted-foreground/70">
                  {progress.completed} of {progress.total} completed
                </p>
              )}
            </>
          ) : (
            <>
              <UploadCloud className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Drop images here or click to upload</p>
              <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF • Max 10MB each</p>
            </>
          )}
        </div>
        {progress.total > 0 && (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm">
            <p className="font-semibold text-primary">
              {progress.completed} of {progress.total} uploaded
            </p>
            {progress.failed > 0 && <p className="text-destructive">Failed: {progress.failed}</p>}
          </div>
        )}
        {errors.length > 0 && (
          <div className="max-h-48 overflow-y-auto rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive space-y-1">
            {errors.map((error, index) => (
              <p key={`${error}-${index}`}>{error}</p>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Admin;
