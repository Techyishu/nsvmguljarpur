import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useActiveStaff } from "@/hooks/useContentQueries";

const Staff = () => {
  const staffQuery = useActiveStaff();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-secondary/30">
      <Navbar />

      <PageHero
        title="Our Faculty"
        description="Meet the dedicated educators and mentors who guide our students with expertise, empathy, and passion."
        eyebrow="Team Nirakar"
        backgroundImage="/images/library.png"
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
            <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {staffQuery.data.map((staff) => (
                <Card
                  key={staff.id}
                  className="border border-border/60 bg-card/90 backdrop-blur shadow-sm transition hover:-translate-y-1 hover:shadow-lg rounded-xl md:rounded-2xl"
                >
                  <CardContent className="p-4 text-center space-y-3 md:p-6 md:space-y-4">
                    {staff.photo_url ? (
                      <img
                        src={staff.photo_url}
                        alt={staff.full_name}
                        className="mx-auto h-20 w-20 rounded-full object-cover md:h-24 md:w-24 border-2 border-primary/10"
                      />
                    ) : (
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-[10px] uppercase tracking-wider text-muted-foreground md:h-24 md:w-24">
                        No Photo
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-primary uppercase tracking-wide md:text-base">
                        {staff.full_name}
                      </p>
                      <p className="text-xs text-secondary font-semibold md:text-sm mt-1">{staff.designation}</p>
                      {staff.qualification ? (
                        <p className="mt-1.5 text-[11px] text-muted-foreground md:mt-2 md:text-xs">
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

