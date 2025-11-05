import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Academics</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Comprehensive education from Nursery to Class XII
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {levels.map((level, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <GraduationCap className="h-12 w-12 text-secondary mb-4" />
                    <CardTitle className="text-2xl">{level.title}</CardTitle>
                    <p className="text-secondary font-semibold">{level.description}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{level.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-accent-foreground">
                Academic Year
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-lg">
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
