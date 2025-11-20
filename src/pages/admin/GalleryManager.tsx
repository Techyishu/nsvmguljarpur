import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Upload } from "lucide-react";
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
import { uploadImage } from "@/lib/imageUpload";
import { fetchGalleryImages, insertGalleryImage, updateGalleryImage, deleteGalleryImage, type GalleryRecord } from "@/services/content";

const gallerySchema = z.object({
    image_url: z.string().min(1, "Image is required"),
    sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
    is_published: z.boolean(),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

export const GalleryManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryRecord | null>(null);
    const [imageToDelete, setImageToDelete] = useState<GalleryRecord | null>(null);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
    const [isBulkUploading, setIsBulkUploading] = useState(false);
    const [bulkProgress, setBulkProgress] = useState({ total: 0, completed: 0, failed: 0 });
    const [bulkErrors, setBulkErrors] = useState<string[]>([]);

    const form = useForm<GalleryFormValues>({
        resolver: zodResolver(gallerySchema),
        defaultValues: {
            image_url: "",
            sort_order: 0,
            is_published: true,
        },
    });

    const { data: images, isLoading } = useQuery({
        queryKey: ["admin", "gallery"],
        queryFn: () => fetchGalleryImages(true),
    });

    const createMutation = useMutation({
        mutationFn: insertGalleryImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
            queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });
            toast({ title: "Success", description: "Image added to gallery" });
            setIsDialogOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: string; values: Partial<GalleryRecord> }) =>
            updateGalleryImage(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
            queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });
            toast({ title: "Success", description: "Image updated successfully" });
            setIsDialogOpen(false);
            setEditingImage(null);
            form.reset();
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteGalleryImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
            queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });
            toast({ title: "Success", description: "Image deleted successfully" });
            setImageToDelete(null);
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: GalleryFormValues) => {
        if (editingImage) {
            updateMutation.mutate({ id: editingImage.id, values: values as any });
        } else {
            createMutation.mutate(values as any);
        }
    };

    const handleEdit = (image: GalleryRecord) => {
        setEditingImage(image);
        form.reset({
            image_url: image.image_url,
            sort_order: image.sort_order,
            is_published: image.is_published,
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingImage(null);
        const nextSortOrder = images?.length
            ? Math.max(...images.map(i => i.sort_order)) + 1
            : 0;

        form.reset({
            image_url: "",
            sort_order: nextSortOrder,
            is_published: true,
        });
        setIsDialogOpen(true);
    };

    const handleBulkFilesAccepted = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsBulkUploading(true);
        setBulkProgress({ total: files.length, completed: 0, failed: 0 });
        setBulkErrors([]);

        const nextSortOrder = images?.length
            ? Math.max(...images.map(i => i.sort_order)) + 1
            : 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const { url } = await uploadImage(file, "gallery");
                await insertGalleryImage({
                    image_url: url,
                    sort_order: nextSortOrder + i,
                    is_published: true,
                });
                setBulkProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                setBulkErrors(prev => [...prev, `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`]);
                setBulkProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
            }
        }

        queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
        queryClient.invalidateQueries({ queryKey: ["public", "gallery"] });
        setIsBulkUploading(false);

        if (bulkErrors.length === 0) {
            toast({ title: "Success", description: "All images uploaded successfully" });
            setIsBulkUploadOpen(false);
        } else {
            toast({ title: "Completed with errors", description: "Some images failed to upload", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gallery</h2>
                    <p className="text-muted-foreground">Manage school photo gallery.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Bulk Upload
                    </Button>
                    <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
                        <Plus className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <AnimatePresence>
                        {images?.map((image) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                            >
                                <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow group">
                                    <div className="aspect-square relative bg-slate-100">
                                        <img
                                            src={image.image_url}
                                            alt="Gallery"
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8 bg-white/90 hover:bg-white"
                                                onClick={() => handleEdit(image)}
                                            >
                                                <Pencil className="h-4 w-4 text-slate-600" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="h-8 w-8"
                                                onClick={() => setImageToDelete(image)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                                            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                                Order: {image.sort_order}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm ${image.is_published ? "bg-green-500/80 text-white" : "bg-amber-500/80 text-white"
                                                }`}>
                                                {image.is_published ? "Published" : "Draft"}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingImage ? "Edit Image" : "Add Image"}</DialogTitle>
                        <DialogDescription>
                            {editingImage ? "Update image details." : "Add a new photo to the gallery."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="image_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <ImageUpload
                                                    onChange={(url) => field.onChange(url)}
                                                    value={field.value}
                                                    folder="gallery"
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

            <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this image from the gallery.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => imageToDelete && deleteMutation.mutate(imageToDelete.id)}
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

            <Dialog open={isBulkUploadOpen} onOpenChange={(open) => !isBulkUploading && setIsBulkUploadOpen(open)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Bulk Upload Images</DialogTitle>
                        <DialogDescription>
                            Select multiple images to upload to the gallery at once.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {!isBulkUploading ? (
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="bulk-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                        <p className="text-sm text-gray-500">Click to select images</p>
                                    </div>
                                    <input
                                        id="bulk-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleBulkFilesAccepted}
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Uploading...</span>
                                    <span>{bulkProgress.completed}/{bulkProgress.total}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${(bulkProgress.completed / bulkProgress.total) * 100}%` }}
                                    ></div>
                                </div>
                                {bulkErrors.length > 0 && (
                                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md text-sm max-h-32 overflow-y-auto">
                                        <p className="font-medium mb-2">Errors:</p>
                                        <ul className="list-disc list-inside">
                                            {bulkErrors.map((err, i) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
};
