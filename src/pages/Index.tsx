import { Navbar } from "@/components/Navbar";
import { HeroSlider } from "@/components/HeroSlider";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Trophy, Building, Music, Bus, ChevronDown, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { mockActivities } from "@/data/mockData";
import { useState } from "react";

const Index = () => {
  const [currentProgram, setCurrentProgram] = useState(0);

  const features = [
    { icon: BookOpen, title: "Adoption", description: "Present vestibulum senean noummy endent mauris. Cum socis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus." },
    { icon: Users, title: "Education", description: "Present vestibulum senean noummy endent mauris. Cum socis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus." },
    { icon: Trophy, title: "Help & Support", description: "Present vestibulum senean noummy endent mauris. Cum socis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus." },
    { icon: Music, title: "Volunteering", description: "Present vestibulum senean noummy endent mauris. Cum socis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus." }
  ];

  const programs = [
    { title: "ADOPTION, FOSTERING & CHILDREN IN CARE", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop" },
    { title: "DISADVANTAGED YOUNG PEOPLE", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=400&fit=crop" },
    { title: "MEDIATION & CRISIS SERVICES", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop" },
    { title: "SAFEGUARDING & CONSULTANCY SERVICES", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop" },
    { title: "SAVE THE EARTH PROGRAMS", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <HeroSlider />

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto -mt-32 relative z-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card border-border hover:border-secondary transition-all group">
                  <CardContent className="pt-12 pb-8 px-6 text-center relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border-2 border-border group-hover:border-secondary rounded-full p-6 transition-colors">
                      <Icon className="h-8 w-8 text-foreground" />
                    </div>
                    <h3 className="font-bold text-xl mb-4 mt-4 uppercase tracking-wider">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">{feature.description}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full border border-border hover:border-secondary hover:bg-transparent"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <GraduationCap className="h-16 w-16 text-secondary mx-auto mb-4" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 uppercase tracking-tight">
              LET'S BUILD THE WORLD WITHOUT CHILD ABUSE AND NEGLECT!
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Present vestibulum senean noummy endent mauris. Cum socis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus. Nullam. Fusce fringilla sodales mauris et ipsum pretium pede. Duis ultricies rhoncus magna. Orci odio aliquet et at erat. Lorem ipsum dolor sit amet, consetetur adipiscing elit. Mauris fermentum dictum magna. Sed laoreet aliquam leo. Ut tellus dolor, dapibus.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Carousel */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-12">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentProgram((prev) => (prev - 1 + programs.length) % programs.length)}
                className="hover:bg-muted"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {programs.map((program, index) => {
                  const offset = (index - currentProgram + programs.length) % programs.length;
                  const isCenter = offset === 2 || (offset === 0 && programs.length < 5);
                  
                  return (
                    <div
                      key={index}
                      className={`transition-all duration-300 ${
                        isCenter ? 'scale-110 opacity-100' : 'scale-90 opacity-60'
                      }`}
                    >
                      <div className="relative group cursor-pointer">
                        <img
                          src={program.image}
                          alt={program.title}
                          className="w-32 h-32 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all border-4 border-border"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs font-bold text-center px-2">{program.title}</p>
                        </div>
                      </div>
                      {isCenter && (
                        <p className="text-center text-xs font-bold mt-4 uppercase tracking-wider">{program.title}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentProgram((prev) => (prev + 1) % programs.length)}
                className="hover:bg-muted"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Section */}
      <section className="py-24 bg-gradient-to-r from-card to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1497375573857-5746a3e43e8c?w=1920&h=600&fit=crop" alt="Background" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div>
              <h2 className="text-6xl md:text-7xl font-black mb-8 uppercase tracking-tight leading-tight">
                JOIN OUR CAMPAIGN!
              </h2>
              <div className="mb-8">
                <p className="text-secondary font-bold mb-2 uppercase tracking-wider">DONATION SO FAR:</p>
                <p className="text-6xl font-black text-secondary">$450,000</p>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-wider mb-6">
                <span className="text-foreground">LAST YEAR </span>
                <span className="font-black">SHIKSHA NIKETAN</span>
                <span className="text-foreground"> SUPPORTED PROGRAMS THAT SERVED OVER </span>
                <span className="font-black">700,000</span>
                <span className="text-foreground"> CHILDREN IN </span>
                <span className="font-black">23</span>
                <span className="text-foreground"> COUNTRIES.</span>
              </p>
              <div className="flex flex-col space-y-4">
                <Button 
                  variant="outline" 
                  className="border-2 border-border hover:border-secondary hover:bg-transparent font-bold uppercase tracking-wider py-6"
                >
                  <ChevronDown className="mr-2 h-5 w-5" />
                  VIEW OUR REPORT
                </Button>
                <Button 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider py-6"
                >
                  <ChevronDown className="mr-2 h-5 w-5" />
                  JOIN OUR CAMPAIGN
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section className="py-24 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight">DONATE NOW!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Help us continue our mission to provide quality education to every child</p>
          <Button 
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 font-bold uppercase tracking-wider px-12 py-6 text-lg"
          >
            MAKE A DONATION
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
