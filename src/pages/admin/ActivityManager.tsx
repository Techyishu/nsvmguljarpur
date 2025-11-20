import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, Loader2, Calendar as CalendarIcon, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { ImageUpload } from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { fetchActivities, insertActivity, updateActivity, deleteActivity, type ActivityRecord } from "@/services/content";

const activitySchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    activity_date: z.string().min(1, "Date is required"),
    image_url: z.string().optional(),
    sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
    is_published: z.boolean(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

export const ActivityManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<ActivityRecord | null>(null);
    const [activityToDelete, setActivityToDelete] = useState<ActivityRecord | null>(null);

    const form = useForm<ActivityFormValues>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            title: "",
            description: "",
            activity_date: new Date().toISOString().split("T")[0],
            image_url: "",
            sort_order: 0,
            is_published: true,
        },
    });

    const { data: activities, isLoading } = useQuery({
        queryKey: ["admin", "activities"],
        queryFn: () => fetchActivities(true),
    });

    const createMutation = useMutation({
        mutationFn: insertActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
            toast({ title: "Success", description: "Activity created successfully" });
            setIsDialogOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: string; values: Partial<ActivityRecord> }) =>
            updateActivity(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
            toast({ title: "Success", description: "Activity updated successfully" });
            setIsDialogOpen(false);
            setEditingActivity(null);
            form.reset();
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "activities"] });
            toast({ title: "Success", description: "Activity deleted successfully" });
            setActivityToDelete(null);
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: ActivityFormValues) => {
        if (editingActivity) {
            updateMutation.mutate({ id: editingActivity.id, values: values as any });
        } else {
            createMutation.mutate(values as any);
        }
    };

    const handleEdit = (activity: ActivityRecord) => {
        setEditingActivity(activity);
        form.reset({
            title: activity.title,
            description: activity.description || "",
            activity_date: activity.activity_date,
            image_url: activity.image_url || "",
            sort_order: activity.sort_order,
            is_published: activity.is_published,
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingActivity(null);
        const nextSortOrder = activities?.length
            ? Math.max(...activities.map(a => a.sort_order)) + 1
            : 0;

        form.reset({
            title: "",
            description: "",
            activity_date: new Date().toISOString().split("T")[0],
            image_url: "",
            sort_order: nextSortOrder,
            is_published: true,
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Activities</h2>
                    <p className="text-muted-foreground">Manage school events and activities.</p>
                </div>
                <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" /> Add Activity
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {activities?.map((activity) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                            >
                                <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                                    <div className="aspect-video relative bg-slate-100">
                                        {activity.image_url ? (
                                            <img
                                                src={activity.image_url}
                                                alt={activity.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400">
                                                <ImageIcon className="h-12 w-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8 bg-white/90 hover:bg-white"
                                                onClick={() => handleEdit(activity)}
                                            >
                                                <Pencil className="h-4 w-4 text-slate-600" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="h-8 w-8"
                                                onClick={() => setActivityToDelete(activity)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 flex-1 flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" />
                                                {format(new Date(activity.activity_date), "MMM d, yyyy")}
                                            </div>
                                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${activity.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                }`}>
                                                {activity.is_published ? "Published" : "Draft"}
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-lg leading-tight">{activity.title}</h3>
                                        {activity.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingActivity ? "Edit Activity" : "Create Activity"}</DialogTitle>
                        <DialogDescription>
                            {editingActivity ? "Update the details of this activity." : "Add a new activity to the school timeline."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Annual Sports Day" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="activity_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Details about the event..." className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cover Image</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <ImageUpload
                                                    onChange={(url) => field.onChange(url)}
                                                    value={field.value}
                                                    folder="activities"
                                                />
                                                <Input {...field} type="hidden" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="is_published"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8 flex-1">
                                            <div className="space-y-0.5">
                                                <FormLabel>Published</FormLabel>
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
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                    {(createMutation.isPending || updateMutation.isPending) && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!activityToDelete} onOpenChange={(open) => !open && setActivityToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the activity
                            "{activityToDelete?.title}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => activityToDelete && deleteMutation.mutate(activityToDelete.id)}
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
