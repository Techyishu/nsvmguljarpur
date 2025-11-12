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
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="border-secondary/40 bg-secondary/5">
        <CardContent className="pt-6 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-2">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-primary">Thank You!</h3>
          <p className="text-sm text-muted-foreground">
            Your review has been submitted successfully. It will be published after admin approval.
          </p>
          <Button
            variant="outline"
            onClick={() => setSubmitSuccess(false)}
            className="mt-4"
          >
            Submit Another Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 uppercase tracking-wider">
          <MessageSquare className="h-5 w-5 text-secondary" />
          Share Your Experience
        </CardTitle>
        <CardDescription>
          Tell us about your experience with Anupam Senior Secondary School
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-4"
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="author_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
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
                    <FormLabel>Role (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Parent, Alumni, Student"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating *</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
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
                            className={`h-8 w-8 ${
                              star <= field.value
                                ? "fill-secondary text-secondary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-semibold text-secondary">
                        {field.value} / 5
                      </span>
                    </div>
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
                  <FormLabel>Your Review *</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Share your thoughts about the school, teachers, facilities, or overall experience..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your review will be reviewed by our team before being published.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

