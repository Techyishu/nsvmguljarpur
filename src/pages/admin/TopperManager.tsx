import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, Loader2, User, Award, GraduationCap } from "lucide-react";
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
import { fetchToppers, insertTopper, updateTopper, deleteTopper, type TopperRecord } from "@/services/content";

const topperSchema = z.object({
    student_name: z.string().min(1, "Name is required"),
    class_name: z.string().min(1, "Class is required"),
    percentage: z.coerce.number().min(0).max(100),
    exam_year: z.union([z.string(), z.number(), z.null()]).optional(),
    photo_url: z.string().optional(),
    sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
    is_active: z.boolean(),
});

type TopperFormValues = z.infer<typeof topperSchema>;

export const TopperManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTopper, setEditingTopper] = useState<TopperRecord | null>(null);
    const [topperToDelete, setTopperToDelete] = useState<TopperRecord | null>(null);

    const form = useForm<TopperFormValues>({
        resolver: zodResolver(topperSchema),
        defaultValues: {
            student_name: "",
            class_name: "",
            percentage: 0,
            exam_year: new Date().getFullYear().toString(),
            photo_url: "",
            sort_order: 0,
            is_active: true,
        },
    });

    const { data: toppers, isLoading } = useQuery({
        queryKey: ["admin", "toppers"],
        queryFn: () => fetchToppers(true),
    });

    const createMutation = useMutation({
        mutationFn: insertTopper,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "toppers"] });
            toast({ title: "Success", description: "Topper added successfully" });
            setIsDialogOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: string; values: Partial<TopperRecord> }) =>
            updateTopper(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "toppers"] });
            toast({ title: "Success", description: "Topper updated successfully" });
            setIsDialogOpen(false);
            setEditingTopper(null);
            form.reset();
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTopper,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "toppers"] });
            toast({ title: "Success", description: "Topper deleted successfully" });
            setTopperToDelete(null);
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: TopperFormValues) => {
        const formattedValues = {
            ...values,
            exam_year: values.exam_year ? Number(values.exam_year) : undefined,
        };

        if (editingTopper) {
            updateMutation.mutate({ id: editingTopper.id, values: formattedValues as any });
        } else {
            createMutation.mutate(formattedValues as any);
        }
    };

    const handleEdit = (topper: TopperRecord) => {
        setEditingTopper(topper);
        form.reset({
            student_name: topper.student_name,
            class_name: topper.class_name,
            percentage: topper.percentage,
            exam_year: topper.exam_year || "",
            photo_url: topper.photo_url || "",
            sort_order: topper.sort_order,
            is_active: topper.is_active,
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingTopper(null);
        const nextSortOrder = toppers?.length
            ? Math.max(...toppers.map(t => t.sort_order)) + 1
            : 0;

        form.reset({
            student_name: "",
            class_name: "",
            percentage: 0,
            exam_year: new Date().getFullYear().toString(),
            photo_url: "",
            sort_order: nextSortOrder,
            is_active: true,
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Academic Toppers</h2>
                    <p className="text-muted-foreground">Showcase top performing students.</p>
                </div>
                <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" /> Add Topper
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence>
                        {toppers?.map((topper) => (
                            <motion.div
                                key={topper.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                            >
                                <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                                    <div className="aspect-square relative bg-slate-100">
                                        {topper.photo_url ? (
                                            <img
                                                src={topper.photo_url}
                                                alt={topper.student_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400">
                                                <User className="h-16 w-16" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8 bg-white/90 hover:bg-white"
                                                onClick={() => handleEdit(topper)}
                                            >
                                                <Pencil className="h-4 w-4 text-slate-600" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="h-8 w-8"
                                                onClick={() => setTopperToDelete(topper)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                            {topper.percentage}%
                                        </div>
                                    </div>
                                    <CardContent className="p-4 flex-1 flex flex-col gap-2 text-center">
                                        <h3 className="font-bold text-lg leading-tight">{topper.student_name}</h3>
                                        <div className="flex items-center justify-center gap-1 text-sm text-primary font-medium">
                                            <GraduationCap className="h-3 w-3" />
                                            {topper.class_name}
                                        </div>
                                        {topper.exam_year && (
                                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                                <Award className="h-3 w-3" />
                                                Batch of {topper.exam_year}
                                            </div>
                                        )}
                                        <div className="mt-auto pt-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${topper.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                                                }`}>
                                                {topper.is_active ? "Active" : "Inactive"}
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
                        <DialogTitle>{editingTopper ? "Edit Topper" : "Add Topper"}</DialogTitle>
                        <DialogDescription>
                            {editingTopper ? "Update student achievement details." : "Recognize a new student achievement."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="photo_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Photo</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <ImageUpload
                                                    onChange={(url) => field.onChange(url)}
                                                    value={field.value}
                                                    folder="toppers"
                                                />
                                                <Input {...field} type="hidden" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="student_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="class_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Class X" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="percentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Percentage</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" max="100" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="exam_year"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Exam Year</FormLabel>
                                            <FormControl>
                                                <Input placeholder="2024" {...field} value={field.value?.toString() || ""} />
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
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Active Status</FormLabel>
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

            <AlertDialog open={!!topperToDelete} onOpenChange={(open) => !open && setTopperToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the record of
                            "{topperToDelete?.student_name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => topperToDelete && deleteMutation.mutate(topperToDelete.id)}
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
