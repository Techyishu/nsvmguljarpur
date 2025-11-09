import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { mockActivities } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

const Activities = () => {
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
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {mockActivities.map((activity) => (
              <Card
                key={activity.id}
                className="overflow-hidden border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="h-40 w-full object-cover md:h-48"
                />
                <CardContent className="space-y-3 p-4 md:space-y-4 md:p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground md:text-sm">
                    <CalendarDays className="h-3.5 w-3.5 text-secondary md:h-4 md:w-4" />
                    <span>{new Date(activity.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <h3 className="text-base font-semibold text-primary md:text-lg">{activity.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed md:text-sm">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Activities;

