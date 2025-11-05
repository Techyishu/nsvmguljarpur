import { Navbar } from "@/components/Navbar";
import { HeroSlider } from "@/components/HeroSlider";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Trophy, Building, Music, Bus } from "lucide-react";
import { mockActivities } from "@/data/mockData";

const Index = () => {
  const stats = [
    { number: "65%", text: "Students secured 90% and above" },
    { number: "75%", text: "Average attendance rate" },
    { number: "70%", text: "Focus on self-expression and emotional needs" }
  ];

  const facilities = [
    { icon: BookOpen, title: "Library", description: "Well stocked with over 400 books" },
    { icon: Trophy, title: "Sports Complex", description: "Facilities for athletics, basketball, volleyball" },
    { icon: Building, title: "Science & Math Labs", description: "Well equipped for practical learning" },
    { icon: Music, title: "Music Center", description: "Professional music education" },
    { icon: Users, title: "Medical Clinic", description: "Air conditioned infirmary for first-aid" },
    { icon: Bus, title: "Transportation", description: "GPS enabled bus fleet" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSlider />

      {/* About Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-accent-foreground mb-6">About Shiksha Niketan</h2>
            <p className="text-lg text-accent-foreground/80 leading-relaxed">
              Our aim is to educate the youth of the world to take their productive place as leaders 
              in the global community by offering our pupils a comprehensive education from Nursery to 
              Class 12. We are a caring community where students' needs are a priority and where 
              traditional Indian and modern Western educational values are respected and encouraged to coexist.
            </p>
            <Button className="mt-6" size="lg">Read More</Button>
          </div>
        </div>
      </section>

      {/* Director's Message */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <div>
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop"
                alt="Director"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Director's Message</h2>
              <p className="text-muted-foreground mb-4">
                We are passionate about offering children an exciting, stimulating and rich curriculum, 
                based on real reasons for learning. We hope that you will share with us the belief that 
                every child should have the opportunity to meet their potential and develop the academic, 
                creative, social and spiritual skills that will enable them to fulfill a happy and prosperous life.
              </p>
              <p className="font-semibold">— Director</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <p className="text-lg opacity-90">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">School Facilities</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-secondary mb-4" />
                    <CardTitle>{facility.title}</CardTitle>
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

      {/* Recent Activities */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-accent-foreground">Recent Activities</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {mockActivities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="text-xl">{activity.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-2">{activity.description}</p>
                  <p className="text-xs text-secondary font-semibold">{activity.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Structure */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Academic Structure</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {["Primary School", "Junior School", "Middle School", "Senior School"].map((level, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{level}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-secondary mb-2">{index + 1}</div>
                  <p className="text-sm text-muted-foreground">Excellence in Education</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
