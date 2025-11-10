import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Loader2 } from "lucide-react";
import { useActiveToppers } from "@/hooks/useContentQueries";

const Toppers = () => {
  const toppersQuery = useActiveToppers();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <PageHero
        title="Academic Toppers"
        description="Celebrating the hard work, discipline, and outstanding board results of our meritorious students."
        eyebrow="Hall of Fame"
      />

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4">
          {toppersQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-xs uppercase tracking-[0.3em]">Loading toppers</p>
            </div>
          ) : toppersQuery.isError ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive">
              Unable to load toppers right now. Please try again later.
            </div>
          ) : !toppersQuery.data?.length ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
              Academic excellence stories will appear here soon.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {toppersQuery.data.map((topper) => (
                <Card
                  key={topper.id}
                  className="border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardContent className="p-5 text-center space-y-3 md:p-6 md:space-y-4">
                    {topper.photo_url ? (
                      <img
                        src={topper.photo_url}
                        alt={topper.student_name}
                        className="mx-auto h-24 w-24 rounded-full object-cover md:h-28 md:w-28"
                      />
                    ) : (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted text-xs uppercase tracking-wider text-muted-foreground md:h-28 md:w-28">
                        No Photo
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-primary uppercase tracking-wide md:text-lg">
                        {topper.student_name}
                      </p>
                      <p className="text-xs text-secondary font-semibold md:text-sm">{topper.class_name}</p>
                      {topper.exam_year ? (
                        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
                          Batch {topper.exam_year}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-secondary md:mt-3 md:gap-2 md:px-4 md:py-2">
                      <GraduationCap className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span className="text-xs font-semibold md:text-sm">{topper.percentage.toFixed(2)}%</span>
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

export default Toppers;

