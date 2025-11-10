import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Loader2 } from "lucide-react";
import { usePublishedActivities } from "@/hooks/useContentQueries";

const Activities = () => {
  const activitiesQuery = usePublishedActivities();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <PageHero
        title="Student Activities"
        description="Discover the events, programmes, and co-curricular experiences that make student life energetic and inspiring."
        eyebrow="Campus Life"
      />

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4">
          {activitiesQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-xs uppercase tracking-[0.3em]">Loading activities</p>
            </div>
          ) : activitiesQuery.isError ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive">
              Unable to load activities at the moment. Please try again later.
            </div>
          ) : !activitiesQuery.data?.length ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
              Stay tuned! Upcoming activities will appear here.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {activitiesQuery.data.map((activity) => (
                <Card
                  key={activity.id}
                  className="overflow-hidden border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {activity.image_url ? (
                    <img
                      src={activity.image_url}
                      alt={activity.title}
                      className="h-40 w-full object-cover md:h-48"
                    />
                  ) : null}
                  <CardContent className="space-y-3 p-4 md:space-y-4 md:p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground md:text-sm">
                      <CalendarDays className="h-3.5 w-3.5 text-secondary md:h-4 md:w-4" />
                      <span>
                        {new Date(activity.activity_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-primary md:text-lg">{activity.title}</h3>
                    {activity.description ? (
                      <p className="text-xs text-muted-foreground leading-relaxed md:text-sm">
                        {activity.description}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Activities;

