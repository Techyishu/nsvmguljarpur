import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { mockStaff } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";

const Staff = () => {
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
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {mockStaff.map((staff) => (
              <Card
                key={staff.id}
                className="border border-border/60 bg-card/90 backdrop-blur shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-5 text-center space-y-3 md:p-6 md:space-y-4">
                  <img
                    src={staff.image}
                    alt={staff.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover md:h-28 md:w-28"
                  />
                  <div>
                    <p className="text-base font-semibold text-primary uppercase tracking-wide md:text-lg">
                      {staff.name}
                    </p>
                    <p className="text-xs text-secondary font-semibold md:text-sm">
                      {staff.designation}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground md:mt-2 md:text-sm">
                      {staff.qualification}
                    </p>
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

export default Staff;

