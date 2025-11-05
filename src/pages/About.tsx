import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Building tomorrow's leaders through excellence in education
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <Target className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To educate the youth of the world to take their productive place as leaders 
                    in the global community by offering comprehensive education from Nursery to 
                    Class 12, where traditional Indian and modern Western educational values coexist.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Eye className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To be a caring community where students' needs are a priority, fostering 
                    academic excellence, creativity, social responsibility, and spiritual growth 
                    in every child.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Belief */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-accent-foreground">Our Belief</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Every human being is born with one very unique talent. Our single-minded effort 
                      is to identify that talent in a child and make them aware that there lies their 
                      future, helping them achieve their full potential in that direction.
                    </p>
                    <p>
                      While concentration is important for students, we take them one level above 
                      concentration, which is meditation. It is estimated that a person uses on average 
                      only 4 to 5% of their brain capacity. Our endeavour is to enhance it to a higher 
                      level.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 text-secondary mb-2" />
                  <CardTitle>Qualified Faculty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Experienced and dedicated teachers committed to student success
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 text-secondary mb-2" />
                  <CardTitle>Modern Infrastructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    State-of-the-art facilities including labs, library, and sports complex
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 text-secondary mb-2" />
                  <CardTitle>Holistic Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Focus on academic, physical, emotional, and spiritual growth
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

export default About;
