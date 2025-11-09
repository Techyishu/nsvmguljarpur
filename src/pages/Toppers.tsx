import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { mockToppers } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const Toppers = () => {
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
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {mockToppers.map((topper) => (
              <Card
                key={topper.id}
                className="border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-5 text-center space-y-3 md:p-6 md:space-y-4">
                  <img
                    src={topper.image}
                    alt={topper.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover md:h-28 md:w-28"
                  />
                  <div>
                    <p className="text-base font-semibold text-primary uppercase tracking-wide md:text-lg">
                      {topper.name}
                    </p>
                    <p className="text-xs text-secondary font-semibold md:text-sm">
                      {topper.class}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-secondary md:mt-3 md:gap-2 md:px-4 md:py-2">
                      <GraduationCap className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span className="text-xs font-semibold md:text-sm">{topper.percentage}</span>
                    </div>
                  </div>
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

export default Toppers;

