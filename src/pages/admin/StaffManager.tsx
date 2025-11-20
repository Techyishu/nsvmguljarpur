import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, Loader2, User, Briefcase, GraduationCap } from "lucide-react";
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
import { fetchStaff, insertStaffMember, updateStaffMember, deleteStaffMember, type StaffRecord } from "@/services/content";

const staffSchema = z.object({
    full_name: z.string().min(1, "Name is required"),
    designation: z.string().min(1, "Designation is required"),
    qualification: z.string().optional(),
    photo_url: z.string().optional(),
    sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
    is_active: z.boolean(),
});

type StaffFormValues = z.infer<typeof staffSchema>;

export const StaffManager = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffRecord | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<StaffRecord | null>(null);

    const form = useForm<StaffFormValues>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            full_name: "",
            designation: "",
            qualification: "",
            photo_url: "",
            sort_order: 0,
            is_active: true,
        },
    });

    const { data: staffMembers, isLoading } = useQuery({
        queryKey: ["admin", "staff"],
        queryFn: () => fetchStaff(true),
    });

    const createMutation = useMutation({
        mutationFn: insertStaffMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
            toast({ title: "Success", description: "Staff member added successfully" });
            setIsDialogOpen(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, values }: { id: string; values: Partial<StaffRecord> }) =>
            updateStaffMember(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
            toast({ title: "Success", description: "Staff member updated successfully" });
            setIsDialogOpen(false);
            setEditingStaff(null);
            form.reset();
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteStaffMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
            toast({ title: "Success", description: "Staff member deleted successfully" });
            setStaffToDelete(null);
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const onSubmit = (values: StaffFormValues) => {
        if (editingStaff) {
            updateMutation.mutate({ id: editingStaff.id, values: values as any });
        } else {
            createMutation.mutate(values as any);
        }
    };

    const handleEdit = (staff: StaffRecord) => {
        setEditingStaff(staff);
        form.reset({
            full_name: staff.full_name,
            designation: staff.designation,
            qualification: staff.qualification || "",
            photo_url: staff.photo_url || "",
            sort_order: staff.sort_order,
            is_active: staff.is_active,
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingStaff(null);
        const nextSortOrder = staffMembers?.length
            ? Math.max(...staffMembers.map(s => s.sort_order)) + 1
            : 0;

        form.reset({
            full_name: "",
            designation: "",
            qualification: "",
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
                    <h2 className="text-3xl font-bold tracking-tight">Staff Members</h2>
                    <p className="text-muted-foreground">Manage teaching and non-teaching staff profiles.</p>
                </div>
                <Button onClick={handleCreate} className="bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" /> Add Staff
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence>
                        {staffMembers?.map((staff) => (
                            <motion.div
                                key={staff.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                            >
                                <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                                    <div className="aspect-square relative bg-slate-100">
                                        {staff.photo_url ? (
                                            <img
                                                src={staff.photo_url}
                                                alt={staff.full_name}
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
                                                onClick={() => handleEdit(staff)}
                                            >
                                                <Pencil className="h-4 w-4 text-slate-600" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="h-8 w-8"
                                                onClick={() => setStaffToDelete(staff)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 flex-1 flex flex-col gap-2 text-center">
                                        <h3 className="font-bold text-lg leading-tight">{staff.full_name}</h3>
                                        <div className="flex items-center justify-center gap-1 text-sm text-primary font-medium">
                                            <Briefcase className="h-3 w-3" />
                                            {staff.designation}
                                        </div>
                                        {staff.qualification && (
                                            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                                <GraduationCap className="h-3 w-3" />
                                                {staff.qualification}
                                            </div>
                                        )}
                                        <div className="mt-auto pt-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${staff.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                                                }`}>
                                                {staff.is_active ? "Active" : "Inactive"}
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
                        <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
                        <DialogDescription>
                            {editingStaff ? "Update profile details." : "Create a new staff profile."}
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
                                                    folder="staff"
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
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dr. Jane Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="designation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Designation</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Principal" {...field} />
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
                                                <Input placeholder="Ph.D, M.Ed" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8 flex-1">
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

            <AlertDialog open={!!staffToDelete} onOpenChange={(open) => !open && setStaffToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the profile of
                            "{staffToDelete?.full_name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => staffToDelete && deleteMutation.mutate(staffToDelete.id)}
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
