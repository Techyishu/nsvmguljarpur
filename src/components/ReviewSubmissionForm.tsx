import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertHomepageReview } from "@/services/content";

const reviewSubmissionSchema = z.object({
  author_name: z.string().min(2, "Name must be at least 2 characters"),
  author_role: z.string().optional(),
  content: z.string().min(20, "Review must be at least 20 characters"),
  rating: z.coerce.number().min(1, "Please provide a rating").max(5, "Rating cannot exceed 5"),
});

type ReviewSubmissionValues = z.infer<typeof reviewSubmissionSchema>;

export const ReviewSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ReviewSubmissionValues>({
    resolver: zodResolver(reviewSubmissionSchema),
    defaultValues: {
      author_name: "",
      author_role: "",
      content: "",
      rating: 5,
    },
  });

  const onSubmit = async (values: ReviewSubmissionValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await insertHomepageReview({
        author_name: values.author_name.trim(),
        author_role: values.author_role?.trim() || null,
        content: values.content.trim(),
        rating: Number(values.rating),
        is_featured: false, // Not featured by default - admin must approve
        sort_order: 999, // Low priority until admin reviews
      });

      setSubmitSuccess(true);
      form.reset();
    } catch (error) {
      let errorMessage = "Failed to submit review. Please try again.";
      
      if (error instanceof Error) {
        // Check for specific Supabase errors
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          errorMessage = "Unable to submit review. Please check your Supabase Row Level Security (RLS) policies to allow public inserts on the homepage_reviews table.";
        } else if (error.message.includes("permission denied") || error.message.includes("policy")) {
          errorMessage = "Permission denied. Please ensure your Supabase RLS policies allow public review submissions.";
        } else {
          errorMessage = error.message;
        }
      }
      
      console.error("Review submission error:", error);
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="border-secondary/40 bg-secondary/5">
        <CardContent className="pt-5 md:pt-6 text-center space-y-2.5 md:space-y-3">
          <div className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-1 md:mb-2">
            <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-primary">Thank You!</h3>
          <p className="text-xs md:text-sm text-muted-foreground px-2">
            Your review has been submitted successfully. It will be published after admin approval.
          </p>
          <Button
            variant="outline"
            onClick={() => setSubmitSuccess(false)}
            className="mt-3 md:mt-4 text-xs md:text-sm"
          >
            Submit Another Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 uppercase tracking-wider text-sm md:text-base">
          <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-secondary" />
          Share Your Experience
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Tell us about your experience with Nirakar Jyoti Vidya Mandir
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-3 md:space-y-4"
            noValidate
          >
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="author_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs md:text-sm">Your Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="text-sm md:text-base" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs md:text-sm">Role (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Parent, Alumni"
                        className="text-sm md:text-base"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs md:text-sm">Rating *</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            field.onChange(star);
                          }}
                          disabled={isSubmitting}
                          className="transition-transform hover:scale-110 disabled:opacity-50"
                        >
                          <Star
                            className={`h-6 w-6 md:h-8 md:w-8 ${
                              star <= field.value
                                ? "fill-secondary text-secondary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-1 md:ml-2 text-xs md:text-sm font-semibold text-secondary">
                        {field.value} / 5
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs md:text-sm">Your Review *</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Share your thoughts about the school..."
                      className="text-sm md:text-base"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {submitError && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-2.5 md:p-3 text-xs md:text-sm text-destructive">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold uppercase tracking-wider text-xs md:text-sm py-5 md:py-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>

            <p className="text-[10px] md:text-xs text-muted-foreground text-center">
              Your review will be reviewed by our team before being published.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

