import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";
import { BookOpen, Trophy, Building, Music, Users, Bus, Stethoscope, Laptop } from "lucide-react";

const Facilities = () => {
  const facilities = [
    {
      icon: BookOpen,
      title: "Library",
      description: "The school library is housed in a spacious hall with a well selected large collection of more than 400 books."
    },
    {
      icon: Trophy,
      title: "Sports Complex",
      description: "The School's Sports Complex has facilities for athletics, basketball, volleyball, badminton etc."
    },
    {
      icon: Building,
      title: "Science & Maths Labs",
      description: "Well equipped Science labs (Physics, Chemistry, Biology, Maths) for wonderful learning experiences."
    },
    {
      icon: Music,
      title: "Music Center",
      description: "Along with the curriculum, the School has a well equipped Music Centre."
    },
    {
      icon: Stethoscope,
      title: "Medical Clinic",
      description: "An air conditioned Infirmary is available for the students' first-aid."
    },
    {
      icon: Bus,
      title: "Transportation",
      description: "The School maintains a fleet of GPS enabled buses for transporting students."
    },
    {
      icon: Laptop,
      title: "Computer Lab",
      description: "Modern computer laboratory with latest technology to enhance digital literacy and technical skills."
    },
    {
      icon: Users,
      title: "Activity Hall",
      description: "Multipurpose hall for assemblies, cultural programs, and various school activities."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <PageHero
          title="Our Facilities"
          description="State-of-the-art infrastructure curated to support academic excellence, wellbeing, and co-curricular pursuits."
          eyebrow="Campus Highlights"
        />

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto md:gap-6">
              {facilities.map((facility, index) => {
                const Icon = facility.icon;
                return (
                  <Card key={index} className="hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-4 md:pb-6">
                      <Icon className="h-10 w-10 text-secondary mb-3 md:h-12 md:w-12 md:mb-4" />
                      <CardTitle className="text-base md:text-xl">{facility.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-xs md:text-base">{facility.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Facilities;
