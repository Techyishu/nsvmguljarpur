import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";
import { Award, Users, Heart, Lightbulb, Smile, HandHeart, Palette, Globe } from "lucide-react";
import clsx from "clsx";

const CORE_VALUES = [
  {
    title: "Aspiration",
    description:
      "Our children are driven to fulfill their personal potential and have the confidence to achieve their goals.",
    icon: Lightbulb,
  },
  {
    title: "Collaboration",
    description:
      "We enjoy working together in groups, teams, and as a whole school to achieve greater results.",
    icon: Users,
  },
  {
    title: "Integrity",
    description:
      "We believe in a clear moral framework and conduct ourselves with honesty, politeness, and consideration for others.",
    icon: Award,
  },
  {
    title: "Resilience",
    description:
      "We have the ability and determination to learn from our mistakes and overcome setbacks.",
    icon: Heart,
  },
  {
    title: "Happiness",
    description:
      "We like our learning to be fun and value the strong friendships we form at school.",
    icon: Smile,
  },
  {
    title: "Kindness",
    description:
      "We always try to support the needs of others in our class, our school, and our community.",
    icon: HandHeart,
  },
  {
    title: "Creativity",
    description:
      "We encourage independent thinking and problem solving across the whole curriculum.",
    icon: Palette,
  },
  {
    title: "Respect",
    description:
      "We value our classmates, teachers, parents, the community, our environment, and ourselves.",
    icon: Globe,
  },
];

const SCOPE_STATS = [
  { value: "2.5 Acres", label: "Campus area" },
  { value: "1000+", label: "Students" },
  { value: "50+", label: "Teachers" },
  { value: "100+", label: "Activities" },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-secondary/30">
      <Navbar />

      <main className="flex-grow">
        <PageHero
          title="About Us"
          description="Nirakar Jyoti Vidya Mandir Gullarpur educates children from Nursery to Class 12 with a commitment to nurturing global citizens. We blend traditional Indian values with contemporary pedagogy so every learner gains knowledge, useful skills, and critical thinking to lead in the wider world."
          backgroundImage="/images/Gemini_Generated_Image_n4c8oln4c8oln4c8.png"
          eyebrow="Know Our Story"
        />

        {/* School Philosophy */}
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-5 md:space-y-8 text-base md:text-lg leading-relaxed text-muted-foreground">
              <p className="first-letter:text-4xl md:first-letter:text-7xl first-letter:font-heading first-letter:font-bold first-letter:text-primary first-letter:mr-2 md:first-letter:mr-3 first-letter:float-left">
                We are a caring community where every student is recognized as unique and capable of growth. Our educators nurture each child to reach their maximum potential.
              </p>
              <p className="text-sm md:text-base lg:text-lg">
                The school reflects a vibrant kaleidoscope of learning, adventure, creativity, and positive thinking.
              </p>
              <p className="text-sm md:text-base lg:text-lg">
                Students are encouraged to embrace healthy competition, pursue their dreams, and develop a deep sense of social responsibility.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-12 md:py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/10 text-secondary text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
                Our Vision
              </span>
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 md:mb-8 leading-tight px-4">
                "Together we inspire a love of learning and help all children achieve their personal goals."
              </h2>
              <div className="w-16 md:w-24 h-0.5 md:h-1 bg-secondary mx-auto rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-primary mb-3 md:mb-4">Our Core Values</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Guiding principles that shape our community and culture.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
              {CORE_VALUES.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="bg-card border border-border/50 rounded-xl md:rounded-2xl p-5 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-primary/5 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                    </div>
                    <h3 className="text-base md:text-xl font-heading font-bold text-primary mb-2 md:mb-3">{value.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* History & Profile */}
        <section className="py-12 md:py-24 bg-accent/20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 lg:grid-cols-2 md:gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-sm border border-border/50">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-primary mb-4 md:mb-6">History & Origin</h3>
                <div className="space-y-3 md:space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                  <p>
                    Over two decades ago, a dream took root in Gullarpur. In 2001, that dream became reality with the founding of Nirakar Jyoti Vidya Mandir.
                  </p>
                  <p>
                    Today we honour that legacy by creating a future-focused environment shaping the next generation.
                  </p>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-secondary/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-4 md:mb-6">School Profile</h3>
                  <div className="space-y-3 md:space-y-4 text-sm md:text-base text-primary-foreground/80 leading-relaxed">
                    <p>
                      Recognized by CBSE, we operate as a progressive co-educational institution offering comprehensive curriculum from foundational years through senior secondary.
                    </p>
                    <p>
                      Our management team oversees academics, discipline, staff development, and campus maintenance to ensure student success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scope & Reach */}
        <section className="py-12 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto text-center">
              {SCOPE_STATS.map((stat) => (
                <div key={stat.value} className="space-y-1.5 md:space-y-2">
                  <p className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-secondary">{stat.value}</p>
                  <p className="text-xs md:text-sm uppercase tracking-wider md:tracking-widest font-semibold opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Director's Message */}
        <section className="py-12 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 md:order-1">
                  <span className="text-secondary font-bold tracking-widest uppercase text-[10px] md:text-xs">Leadership</span>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-primary mt-2 mb-6 md:mb-8">Director's Message</h2>
                  <div className="prose prose-lg text-muted-foreground">
                    <p className="italic text-base sm:text-lg md:text-xl mb-4 md:mb-6 border-l-4 border-secondary pl-4 md:pl-6">
                      "We are passionate about offering children an exciting, stimulating curriculum based on real reasons for learning."
                    </p>
                    <p className="text-sm md:text-base">
                      We hope you share our belief that every child should have the opportunity to meet their potential and develop skills for a happy, prosperous life.
                    </p>
                  </div>
                  <div className="mt-6 md:mt-8">
                    <p className="font-heading font-bold text-xl md:text-2xl text-primary">Vinod Kumar</p>
                    <p className="text-xs md:text-sm font-semibold text-secondary uppercase tracking-wider">Director</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">Village - Gullarpur, P.O - Peont, Distt - Karnal</p>
                  </div>
                </div>
                <div className="order-1 md:order-2 relative max-w-md mx-auto w-full">
                  <div className="absolute inset-0 bg-secondary/20 rounded-2xl md:rounded-3xl transform rotate-3"></div>
                  <img
                    src="/images/director-vinod-kumar.jpg"
                    alt="Director Vinod Kumar"
                    className="relative rounded-2xl md:rounded-3xl shadow-2xl w-full h-auto object-cover transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Belief */}
        <section className="py-12 md:py-20 bg-accent/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-heading font-bold text-primary mb-6 md:mb-8">Our Belief</h2>
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-lg border border-border/50">
                <div className="space-y-4 md:space-y-6 text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Every human being is born with unique talent. We identify that talent and help students achieve their full potential through focused learning and meditation.
                  </p>
                  <p>
                    Most people use only 4-5% of their brain capacity. Our endeavour is to enhance it to higher levels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements & Recognition */}
        <section className="py-12 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-primary mb-3 md:mb-4">Achievements & Recognition</h2>
              <p className="text-sm md:text-base text-muted-foreground">Celebrating excellence in every endeavor.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              <div className="group bg-card rounded-2xl md:rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="h-48 md:h-64 overflow-hidden">
                  <img
                    src="/images/sports-complex.png"
                    alt="Federation of Private Schools Recognition"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 md:p-8">
                  <h3 className="text-base md:text-xl font-heading font-bold text-primary mb-2 md:mb-3">Federation Recognition</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Our students recognized by the Federation of Private Schools for outstanding achievements.
                  </p>
                </div>
              </div>

              <div className="group bg-card rounded-2xl md:rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="h-48 md:h-64 overflow-hidden">
                  <img
                    src="/images/music and arts.png"
                    alt="Student Achievements"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 md:p-8">
                  <h3 className="text-base md:text-xl font-heading font-bold text-primary mb-2 md:mb-3">Student Achievements</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    We celebrate students' achievements through award ceremonies recognizing hard work and dedication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold mb-4 md:mb-6">Why Choose Us</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 text-center border border-white/10 hover:bg-white/20 transition-colors">
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4 md:mb-6 text-primary-foreground">
                  <Users className="h-7 w-7 md:h-8 md:w-8" />
                </div>
                <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3">Qualified Faculty</h3>
                <p className="text-primary-foreground/80 text-xs md:text-sm leading-relaxed">
                  Experienced teachers committed to student success
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 text-center border border-white/10 hover:bg-white/20 transition-colors">
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4 md:mb-6 text-primary-foreground">
                  <Lightbulb className="h-7 w-7 md:h-8 md:w-8" />
                </div>
                <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3">Modern Infrastructure</h3>
                <p className="text-primary-foreground/80 text-xs md:text-sm leading-relaxed">
                  State-of-the-art facilities including labs and sports
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 text-center border border-white/10 hover:bg-white/20 transition-colors">
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4 md:mb-6 text-primary-foreground">
                  <Heart className="h-7 w-7 md:h-8 md:w-8" />
                </div>
                <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3">Holistic Development</h3>
                <p className="text-primary-foreground/80 text-xs md:text-sm leading-relaxed">
                  Focus on academic, physical, and emotional growth
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
