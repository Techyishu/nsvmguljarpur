import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useActiveStaff } from "@/hooks/useContentQueries";

const Staff = () => {
  const staffQuery = useActiveStaff();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <PageHero
        title="Our Faculty"
        description="Meet the dedicated educators and mentors who guide our students with expertise, empathy, and passion."
        eyebrow="Team Anupam"
      />

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4">
          {staffQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-xs uppercase tracking-[0.3em]">Loading faculty</p>
            </div>
          ) : staffQuery.isError ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive">
              Unable to load staff profiles. Please try again later.
            </div>
          ) : !staffQuery.data?.length ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
              Our faculty profiles are being updated. Visit again soon!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {staffQuery.data.map((staff) => (
                <Card
                  key={staff.id}
                  className="border border-border/60 bg-card/90 backdrop-blur shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardContent className="p-5 text-center space-y-3 md:p-6 md:space-y-4">
                    {staff.photo_url ? (
                      <img
                        src={staff.photo_url}
                        alt={staff.full_name}
                        className="mx-auto h-24 w-24 rounded-full object-cover md:h-28 md:w-28"
                      />
                    ) : (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted text-xs uppercase tracking-wider text-muted-foreground md:h-28 md:w-28">
                        No Photo
                      </div>
                    )}
                    <div>
                      <p className="text-base font-semibold text-primary uppercase tracking-wide md:text-lg">
                        {staff.full_name}
                      </p>
                      <p className="text-xs text-secondary font-semibold md:text-sm">{staff.designation}</p>
                      {staff.qualification ? (
                        <p className="mt-1.5 text-xs text-muted-foreground md:mt-2 md:text-sm">
                          {staff.qualification}
                        </p>
                      ) : null}
                    </div>
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

export default Staff;

