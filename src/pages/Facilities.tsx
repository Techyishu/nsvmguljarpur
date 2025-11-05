import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Building, Music, Users, Bus, Stethoscope, Laptop } from "lucide-react";

const Facilities = () => {
  const facilities = [
    {
      icon: BookOpen,
      title: "Library",
      description: "The school library is housed in a spacious hall with a well-selected large collection of more than 400 books covering various subjects and genres."
    },
    {
      icon: Trophy,
      title: "Sports Complex",
      description: "Our sports complex has facilities for athletics, basketball, volleyball, badminton, and other sports to promote physical fitness and teamwork."
    },
    {
      icon: Building,
      title: "Science & Math Labs",
      description: "Well-equipped laboratories for Physics, Chemistry, Biology, and Mathematics provide hands-on learning experiences."
    },
    {
      icon: Music,
      title: "Music Center",
      description: "Along with the curriculum, the school has a well-equipped Music Centre for students to explore their artistic talents."
    },
    {
      icon: Stethoscope,
      title: "Medical Clinic",
      description: "An air-conditioned infirmary is available for students' first-aid and medical emergencies."
    },
    {
      icon: Bus,
      title: "Transportation",
      description: "The school maintains a fleet of GPS-enabled buses for safe and convenient transportation of students."
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
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Our Facilities</h1>
            <p className="text-xl max-w-3xl mx-auto">
              State-of-the-art infrastructure for holistic development
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {facilities.map((facility, index) => {
                const Icon = facility.icon;
                return (
                  <Card key={index} className="hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <Icon className="h-12 w-12 text-secondary mb-4" />
                      <CardTitle className="text-xl">{facility.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{facility.description}</p>
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
