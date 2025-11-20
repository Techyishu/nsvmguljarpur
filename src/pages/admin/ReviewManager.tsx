import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, Loader2, MessageSquare, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
import { useToast } from "@/hooks/use-toast";
import { fetchHomepageReviews, insertHomepageReview, updateHomepageReview, deleteHomepageReview, type ReviewRecord } from "@/services/content";

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

type ReviewFormValues = z.infer<typeof reviewSchema>;

export const ReviewManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<ReviewRecord | null>(null);
    const [reviewToDelete, setReviewToDelete] = useState<ReviewRecord | null>(null);

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            author_name: "",
            author_role: "",
            content: "",
            rating: 5,
            sort_order: 0,
            is_featured: true,
        },
    });

    const { data: reviews, isLoading } = useQuery({
        queryKey: ["admin", "reviews"],
        queryFn: () => fetchHomepageReviews(true),
    });

    const createMutation = useMutation({
        mutationFn: insertHomepageReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
            toast({ title: "Success", description: "Review added successfully" });
            setIsDialogOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: string; values: Partial<ReviewRecord> }) =>
            updateHomepageReview(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
            toast({ title: "Success", description: "Review updated successfully" });
            setIsDialogOpen(false);
            setEditingReview(null);
            form.reset();
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteHomepageReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
            toast({ title: "Success", description: "Review deleted successfully" });
            setReviewToDelete(null);
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: ReviewFormValues) => {
        if (editingReview) {
            updateMutation.mutate({ id: editingReview.id, values: values as any });
        } else {
            createMutation.mutate(values as any);
        }
    };

    const handleEdit = (review: ReviewRecord) => {
        setEditingReview(review);
        form.reset({
            author_name: review.author_name,
            author_role: review.author_role || "",
            content: review.content,
            rating: review.rating,
            sort_order: review.sort_order,
            is_featured: review.is_featured,
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingReview(null);
        const nextSortOrder = reviews?.length
            ? Math.max(...reviews.map(r => r.sort_order)) + 1
            : 0;

        form.reset({
            author_name: "",
            author_role: "",
            content: "",
            rating: 5,
            sort_order: nextSortOrder,
            is_featured: true,
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
                    <p className="text-muted-foreground">Manage homepage reviews and testimonials.</p>
                </div>
                <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" /> Add Review
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {reviews?.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                            >
                                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex-1 flex flex-col gap-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {review.author_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold leading-none">{review.author_name}</h3>
                                                    {review.author_role && (
                                                        <p className="text-sm text-muted-foreground">{review.author_role}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                    onClick={() => handleEdit(review)}
                                                >
                                                    <Pencil className="h-4 w-4 text-slate-600" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() => setReviewToDelete(review)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < (review.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-slate-600 italic">"{review.content}"</p>
                                        </div>

                                        <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-auto">
                                            <span className="text-xs text-muted-foreground">Order: {review.sort_order}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${review.is_featured ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                                                }`}>
                                                {review.is_featured ? "Featured" : "Hidden"}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingReview ? "Edit Review" : "Add Review"}</DialogTitle>
                        <DialogDescription>
                            {editingReview ? "Update testimonial details." : "Add a new testimonial to the homepage."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="author_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Author Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Parent Name" {...field} />
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
                                        <FormLabel>Role (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Parent of Class X Student" {...field} />
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
                                        <FormLabel>Review Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Write the review here..." className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Rating (0-5)</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" max="5" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                            </div>

                            <FormField
                                control={form.control}
                                name="is_featured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Featured</FormLabel>
                                            <FormMessage>Show on homepage</FormMessage>
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

            <AlertDialog open={!!reviewToDelete} onOpenChange={(open) => !open && setReviewToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this review.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => reviewToDelete && deleteMutation.mutate(reviewToDelete.id)}
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
