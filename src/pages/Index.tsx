import { Navbar } from "@/components/Navbar";
import { HeroSlider } from "@/components/HeroSlider";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Trophy, Music, ChevronDown, ChevronLeft, ChevronRight, GraduationCap, Award, Star, CheckCircle2, Sparkles, Heart, Brain, Target, ArrowRight, Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";
import { mockActivities } from "@/data/mockData";
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [currentProgram, setCurrentProgram] = useState(0);

  const features = [
    { icon: BookOpen, title: "Library", description: "The school library is housed in a spacious hall with a well selected large collection of more than 400 books.", color: "from-blue-500 to-cyan-500" },
    { icon: Users, title: "Academics", description: "Comprehensive education from Nursery to Class 12 with traditional Indian and modern Western educational values.", color: "from-indigo-500 to-blue-500" },
    { icon: Trophy, title: "Sports Complex", description: "The School's Sports Complex has facilities for athletics, basketball, volleyball, badminton etc.", color: "from-blue-600 to-cyan-600" },
    { icon: Music, title: "Music Center", description: "Along with the curriculum, the School has a well equipped Music Centre.", color: "from-cyan-500 to-teal-500" }
  ];

  const whyChooseUs = [
    { icon: Award, title: "65% of students secured 90%", description: "and above average marks", gradient: "from-blue-400 to-cyan-500" },
    { icon: Clock, title: "75% attendance policy", description: "If a child's attendance falls below, parents will be contacted", gradient: "from-indigo-400 to-blue-500" },
    { icon: Heart, title: "70% focus on expression", description: "School gives importance to inherent urges of self expression and takes special care of psychological and emotional needs", gradient: "from-cyan-400 to-teal-500" },
    { icon: Brain, title: "Enhanced brain capacity", description: "Our endeavour is to enhance brain usage beyond 4-5% through meditation and concentration", gradient: "from-blue-500 to-indigo-500" }
  ];

  const facilities = [
    { icon: BookOpen, title: "Library", description: "400+ books collection", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop" },
    { icon: Trophy, title: "Sports Complex", description: "Athletics, basketball, volleyball, badminton", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop" },
    { icon: GraduationCap, title: "Science & Maths Labs", description: "Well equipped labs for wonderful learning", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop" },
    { icon: Music, title: "Music Center", description: "Well equipped Music Centre", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop" }
  ];

  const programs = [
    { title: "PRIMARY SCHOOL", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop" },
    { title: "JUNIOR SCHOOL", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=400&fit=crop" },
    { title: "MIDDLE SCHOOL", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop" },
    { title: "SENIOR SCHOOL", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-background overflow-visible">
      <Navbar />
      <div className="overflow-visible">
        <HeroSlider />
      </div>

      {/* Features Section with Gradient Cards */}
      <section className="relative z-50 pt-8 pb-16 md:pb-24 overflow-visible" style={{ marginTop: '-160px' }}>
        <div className="container mx-auto px-4 overflow-visible">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto overflow-visible">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="overflow-visible">
                  <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 hover:border-secondary/50 transition-all duration-300 group hover:shadow-2xl hover:scale-105 overflow-visible shadow-xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <CardContent className="pt-12 pb-8 px-6 text-center relative overflow-visible">
                      <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-br ${feature.color} rounded-full p-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg z-10`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg md:text-xl mb-3 mt-4 uppercase tracking-wider text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-4">{feature.description}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full border border-border/50 hover:border-secondary hover:bg-secondary/10 transition-all"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section with Gradient Background */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-6 md:mb-8 inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent blur-2xl opacity-30"></div>
                <GraduationCap className="h-12 w-12 md:h-16 md:w-16 text-secondary mx-auto mb-4 relative z-10" />
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 md:mb-8 uppercase tracking-tight bg-gradient-to-r from-foreground via-secondary to-foreground bg-clip-text text-transparent">
              ANUPAM SHIKSHA NIKETAN
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-4xl mx-auto text-base md:text-lg px-4">
              Anupam Shiksha Niketan School, kutail aim is to educate the youth of the world to take their productive place as leaders in the global community by offering our pupils a comprehensive education from Nursery to Class 12. We are a caring community where students' needs are a priority and where traditional Indian and modern Western educational values are respected and encouraged to coexist.
            </p>
            <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-secondary-foreground font-bold px-8 py-6">
                <Link to="/about">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-secondary/50 hover:border-secondary hover:bg-secondary/10 px-8 py-6">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent">
              Why Choose Us
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Excellence in education with proven results and holistic development
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="bg-gradient-to-br from-card to-card/80 border-border/50 hover:border-secondary/50 transition-all duration-300 group hover:shadow-xl overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <CardContent className="p-6 text-center relative">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${item.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg md:text-xl mb-2 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic Programs Section */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-accent/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">Academic Programs</h2>
            <p className="text-muted-foreground text-base md:text-lg">Comprehensive education from Nursery to Class 12</p>
          </div>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-8 md:mb-12">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentProgram((prev) => (prev - 1 + programs.length) % programs.length)}
                className="hover:bg-secondary/10 border border-border/50"
              >
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
              </Button>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 flex-1">
                {programs.map((program, index) => {
                  const offset = (index - currentProgram + programs.length) % programs.length;
                  const isCenter = offset === 0;
                  
                  return (
                    <div
                      key={index}
                      className={`transition-all duration-300 ${
                        isCenter ? 'scale-105 opacity-100 z-10' : 'scale-95 opacity-70'
                      }`}
                    >
                      <div className="relative group cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={program.image}
                            alt={program.title}
                            className="w-full h-32 md:h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-300 border-2 border-border/50 group-hover:border-secondary"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <p className="text-white text-xs md:text-sm font-bold text-center w-full">{program.title}</p>
                          </div>
                        </div>
                        {isCenter && (
                          <p className="text-center text-xs md:text-sm font-bold mt-2 md:mt-4 uppercase tracking-wider">{program.title}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentProgram((prev) => (prev + 1) % programs.length)}
                className="hover:bg-secondary/10 border border-border/50"
              >
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section with Animated Numbers */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">Our Reach & Impact</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-card/80 to-card/50 border-secondary/30 hover:border-secondary transition-all duration-300 hover:scale-105 hover:shadow-xl text-center p-6 md:p-8">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">2.5</div>
              <p className="text-sm md:text-lg font-bold uppercase tracking-wider text-muted-foreground">Acres Area</p>
            </Card>
            <Card className="bg-gradient-to-br from-card/80 to-card/50 border-secondary/30 hover:border-secondary transition-all duration-300 hover:scale-105 hover:shadow-xl text-center p-6 md:p-8">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">1000+</div>
              <p className="text-sm md:text-lg font-bold uppercase tracking-wider text-muted-foreground">Students</p>
            </Card>
            <Card className="bg-gradient-to-br from-card/80 to-card/50 border-secondary/30 hover:border-secondary transition-all duration-300 hover:scale-105 hover:shadow-xl text-center p-6 md:p-8">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">50+</div>
              <p className="text-sm md:text-lg font-bold uppercase tracking-wider text-muted-foreground">Teachers</p>
            </Card>
            <Card className="bg-gradient-to-br from-card/80 to-card/50 border-secondary/30 hover:border-secondary transition-all duration-300 hover:scale-105 hover:shadow-xl text-center p-6 md:p-8">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">100+</div>
              <p className="text-sm md:text-lg font-bold uppercase tracking-wider text-muted-foreground">Activities</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Facilities Preview Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight bg-gradient-to-r from-foreground via-secondary to-foreground bg-clip-text text-transparent">
              Our Facilities
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              State-of-the-art infrastructure for holistic development
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <Card key={index} className="group overflow-hidden border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <Icon className="h-8 w-8 text-white mb-2" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg md:text-xl mb-2 text-foreground">{facility.title}</h3>
                    <p className="text-muted-foreground text-sm">{facility.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-10 md:mt-12">
            <Button asChild variant="outline" className="border-2 border-secondary/50 hover:border-secondary hover:bg-secondary/10 px-8 py-6">
              <Link to="/facilities">View All Facilities <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent News & Events Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">News & Events</h2>
            <p className="text-muted-foreground text-base md:text-lg">Stay updated with our latest happenings</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto mb-10 md:mb-12">
            {mockActivities.slice(0, 3).map((activity) => (
              <Card key={activity.id} className="group overflow-hidden border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-secondary/90 text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-2">{activity.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{activity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline" className="border-2 border-secondary/50 hover:border-secondary hover:bg-secondary/10 px-8 py-6">
              <Link to="/gallery">View All Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Academic Structure Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary via-secondary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 uppercase tracking-tight text-secondary-foreground">
            ACADEMIC STRUCTURE
          </h2>
          <p className="text-base md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto text-secondary-foreground/90">
            The new academic session starts from 1st April each year.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mt-8 md:mt-12">
            {["Primary School", "Junior School", "Middle School", "Senior School"].map((level, index) => (
              <Card key={index} className="bg-background/10 backdrop-blur-sm border-background/20 hover:bg-background/20 transition-all duration-300 hover:scale-105 p-6 md:p-8">
                <GraduationCap className="h-8 w-8 md:h-12 md:w-12 text-secondary-foreground mx-auto mb-4" />
                <h3 className="text-lg md:text-2xl font-bold text-secondary-foreground">{level}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,165,0,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Card className="bg-gradient-to-br from-card via-card/90 to-card border-secondary/30 max-w-4xl mx-auto overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-accent/10 to-secondary/10"></div>
            <CardContent className="p-8 md:p-12 text-center relative">
              <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-secondary mx-auto mb-6" />
              <h2 className="text-2xl md:text-4xl font-black mb-4 md:mb-6 uppercase tracking-tight">
                Ready to Join Our Community?
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">
                Registration for new admissions is open for Classes Nursery to XII for the session 2024-2025. Contact us today to learn more about our programs and facilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-secondary-foreground font-bold px-8 py-6">
                  <Link to="/contact">Contact Us <Phone className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="border-2 border-secondary/50 hover:border-secondary hover:bg-secondary/10 px-8 py-6">
                  <Link to="/academics">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
