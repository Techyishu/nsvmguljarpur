import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";
import { GraduationCap } from "lucide-react";

const Academics = () => {
  const levels = [
    {
      title: "Primary School",
      description: "Classes Nursery to V",
      details: "Foundation years focusing on basic literacy, numeracy, and social skills development."
    },
    {
      title: "Junior School",
      description: "Classes VI to VIII",
      details: "Building on fundamentals with enhanced curriculum and skill development programs."
    },
    {
      title: "Middle School",
      description: "Classes IX to X",
      details: "CBSE board preparation with comprehensive subject knowledge and exam strategies."
    },
    {
      title: "Senior School",
      description: "Classes XI to XII",
      details: "Specialized streams (Science, Commerce, Arts) for career-focused education."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <PageHero
          title="Academics"
          description="Comprehensive education from Nursery to Class XII with accreditation, structured pathways, and quality instruction."
          eyebrow="Learning Pathways"
        />

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto md:gap-8">
              {levels.map((level, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-4 md:pb-6">
                    <GraduationCap className="h-10 w-10 text-secondary mb-3 md:h-12 md:w-12 md:mb-4" />
                    <CardTitle className="text-xl md:text-2xl">{level.title}</CardTitle>
                    <p className="text-secondary font-semibold text-sm md:text-base">{level.description}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-xs md:text-base">{level.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-accent md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-center mb-6 text-accent-foreground md:text-3xl md:mb-8">
                Academic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <Card>
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-base md:text-xl">Accreditation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-xs md:text-base">
                      The school is accredited and recognized for providing quality education from Nursery to Class 12.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-base md:text-xl">Medium of Instruction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-xs md:text-base">
                      English is the primary medium of instruction, ensuring students are well-prepared for global opportunities.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-base md:text-xl">Streams Offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-xs md:text-base">
                      Senior School offers specialized streams including Science, Commerce, and Arts for career-focused education.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-base md:text-xl">Scholarships & Awards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-xs md:text-base">
                      The school recognizes and rewards academic excellence through various scholarships and awards programs.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <p className="text-center text-lg font-semibold">
                    The new academic session starts from 1st April each year.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Academics;
