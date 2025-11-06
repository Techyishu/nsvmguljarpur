import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="/images/imgi_136_our-gallery-19.jpg" 
              alt="Anupam Shiksha Niketan School Building" 
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Anupam Shiksha Niketan School, kutail aim is to educate the youth of the world to take their productive place as leaders in the global community by offering our pupils a comprehensive education from Nursery to Class 12. We are a caring community where students' needs are a priority and where traditional Indian and modern Western educational values are respected and encouraged to coexist.
            </p>
          </div>
        </section>

        {/* Director's Message */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-3xl text-center mb-6">DIRECTOR'S MESSAGE</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                        We are passionate about offering children an exciting, stimulating and rich curriculum, based on real reasons for learning. We hope that you will share with us the belief that every child should have the opportunity to meet their potential and develop the academic, creative, social and spiritual skills that will enable them to fulfill a happy and prosperous life.
                      </p>
                      <div className="text-center mt-8">
                        <p className="font-bold text-xl mb-2">PAWAN KUMAR</p>
                        <p className="text-muted-foreground">Director</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="order-1 md:order-2">
                  <Card className="overflow-hidden border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl">
                    <img 
                      src="/images/directors-message.jpg" 
                      alt="Director speaking at school event" 
                      className="w-full h-auto object-cover"
                    />
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Belief */}
        <section className="py-16 bg-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-accent-foreground">OUR BELIEF</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Every human being is born with one very unique talent. Our single minded effort is to identify that talent in a child and make him or her aware that there lies his/her future and help them to achieve their full potential in that direction. While concentration is important for students, we take them one level above concentration, which is meditation.
                    </p>
                    <p>
                      It is estimated that a person uses on an average only 4 to 5% of his/her brain capacity. Our endeavour is to enhance it to a higher level. Albert Einstein's usage was estimated to be 7.5%.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Achievements & Recognition */}
        <section className="py-16 bg-accent/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Achievements & Recognition</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
              <Card className="overflow-hidden border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="/images/imgi_101_IMG-20220617-WA0001-1024x682.jpg" 
                  alt="Student receiving certificate from Federation of Private Schools" 
                  className="w-full h-auto object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">Federation of Private Schools Recognition</h3>
                  <p className="text-muted-foreground">
                    Our students have been recognized by the Federation of Private Schools for their outstanding achievements and excellence in education.
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="/images/imgi_97_IMG-20220730-WA0080-1024x768.jpg" 
                  alt="Award ceremony with students receiving certificates" 
                  className="w-full h-auto object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">Student Achievements</h3>
                  <p className="text-muted-foreground">
                    We celebrate our students' achievements through various award ceremonies, recognizing their hard work and dedication.
                  </p>
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
