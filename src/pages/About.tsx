import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";
import { Award } from "lucide-react";

const CORE_VALUES = [
  {
    title: "Aspiration",
    description:
      "Our children are driven to fulfill their personal potential and have the confidence to achieve their goals.",
  },
  {
    title: "Collaboration",
    description:
      "We enjoy working together in groups, teams, and as a whole school to achieve greater results.",
  },
  {
    title: "Integrity",
    description:
      "We believe in a clear moral framework and conduct ourselves with honesty, politeness, and consideration for others.",
  },
  {
    title: "Resilience",
    description:
      "We have the ability and determination to learn from our mistakes and overcome setbacks.",
  },
  {
    title: "Happiness",
    description:
      "We like our learning to be fun and value the strong friendships we form at school.",
  },
  {
    title: "Kindness",
    description:
      "We always try to support the needs of others in our class, our school, and our community.",
  },
  {
    title: "Creativity",
    description:
      "We encourage independent thinking and problem solving across the whole curriculum.",
  },
  {
    title: "Respect",
    description:
      "We value our classmates, teachers, parents, the community, our environment, and ourselves.",
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <PageHero
          title="About Us"
          description="Anupam Shiksha Niketan Sr. Sec. School educates children from Nursery to Class 12 with a commitment to nurturing global citizens. We blend traditional Indian values with contemporary pedagogy so every learner gains knowledge, useful skills, and critical thinking to lead in the wider world."
          backgroundImage="/images/imgi_136_our-gallery-19.jpg"
          eyebrow="Know Our Story"
        />

        {/* School Philosophy */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-4 text-muted-foreground text-sm md:text-lg leading-relaxed md:space-y-6">
              <p>
                We are a caring community where every student is recognized as unique and capable of growth. Our educators take responsibility for nurturing each child to reach their maximum potential while inspiring them to appreciate our diverse community, care for others, and become active stewards of the environment.
              </p>
              <p>
                The school reflects a vibrant kaleidoscope of learning, adventure, creativity, and positive thinking. We see every new session as a stepping stone toward future milestones, empowering young minds to explore new realms of wisdom and transform their collective future.
              </p>
              <p>
                As future leaders, students are encouraged to embrace healthy competition, pursue their dreams, and develop a deep sense of social responsibility. Together, we help every child unleash their innovative ideas in a nurturing environment where quality truly matters.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-12 bg-accent md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl md:text-3xl font-bold mb-5 text-accent-foreground md:mb-6">Our Vision</h2>
              <Card>
                <CardContent className="pt-8 pb-10 px-5 md:pt-10 md:pb-12 md:px-8">
                  <p className="text-base md:text-xl italic text-muted-foreground leading-relaxed">
                    "Together we will inspire a love of learning and help all children to achieve their personal goals, now and in the future."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-8 md:mb-12">Our Values</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {CORE_VALUES.map((value) => (
                <Card key={value.title} className="h-full">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-base md:text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* History & Profile */}
        <section className="py-12 bg-accent/10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 max-w-6xl mx-auto md:gap-10 md:grid-cols-2">
              <Card className="h-full">
                <CardHeader className="pb-4 md:pb-6">
                  <CardTitle className="text-xl md:text-3xl">History &amp; Origin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground text-sm md:space-y-4 md:text-lg leading-relaxed">
                  <p>
                    A decade ago, a dream took root in Kutail, Haryana. In 2001 that dream became reality with the founding of Anupam Shiksha Niketan Sr. Sec. School as a privately managed institution dedicated to excellence.
                  </p>
                  <p>
                    Today we honour that legacy by creating a future-focused environment where memories and dreams shape the next generation of innovators, thinkers, and leaders.
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardHeader className="pb-4 md:pb-6">
                  <CardTitle className="text-xl md:text-3xl">School Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground text-sm md:space-y-4 md:text-lg leading-relaxed">
                  <p>
                    The school is recognized by the Central Board of Secondary Education (CBSE) and operates as a progressive co-educational institution offering a comprehensive curriculum from the foundational years through senior secondary.
                  </p>
                  <p>
                    Our management team oversees academics, discipline, staff development, punctuality, fee collection, and campus maintenance to ensure every aspect of school life supports student success.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Scope & Reach */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-8 md:mb-12">Scope &amp; Reach</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto md:gap-6">
              {SCOPE_STATS.map((stat) => (
                <Card key={stat.value} className="text-center">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-xl md:text-4xl text-secondary">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground uppercase tracking-wide text-[0.65rem] md:text-sm">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Director's Message */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6 items-center md:gap-8">
                <div className="order-2 md:order-1">
                  <Card>
                    <CardHeader className="pb-4 md:pb-6">
                      <CardTitle className="text-lg md:text-3xl text-center mb-4 md:mb-6">DIRECTOR'S MESSAGE</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm md:text-lg leading-relaxed mb-5 md:mb-6">
                        We are passionate about offering children an exciting, stimulating and rich curriculum, based on real reasons for learning. We hope that you will share with us the belief that every child should have the opportunity to meet their potential and develop the academic, creative, social and spiritual skills that will enable them to fulfill a happy and prosperous life.
                      </p>
                      <div className="text-center mt-6 md:mt-8">
                        <p className="font-bold text-base md:text-xl mb-1 md:mb-2">PAWAN KUMAR</p>
                        <p className="text-muted-foreground text-xs md:text-base">Director</p>
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
        <section className="py-12 bg-accent md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-3xl font-bold text-center mb-6 text-accent-foreground md:mb-8">OUR BELIEF</h2>
              <Card>
                <CardContent className="pt-5 md:pt-6">
                  <div className="space-y-3 text-muted-foreground text-sm md:space-y-4 md:text-lg leading-relaxed">
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
        <section className="py-12 bg-accent/10 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-8 md:mb-12">Achievements & Recognition</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-10 md:gap-8 md:mb-12">
              <Card className="overflow-hidden border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl">
                <img 
                  src="/images/imgi_101_IMG-20220617-WA0001-1024x682.jpg" 
                  alt="Student receiving certificate from Federation of Private Schools" 
                  className="w-full h-auto object-cover"
                />
                <CardContent className="p-4 md:p-6">
                  <h3 className="font-bold text-base md:text-xl mb-1.5 md:mb-2">Federation of Private Schools Recognition</h3>
                  <p className="text-muted-foreground text-xs md:text-base leading-relaxed">
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
                <CardContent className="p-4 md:p-6">
                  <h3 className="font-bold text-base md:text-xl mb-1.5 md:mb-2">Student Achievements</h3>
                  <p className="text-muted-foreground text-xs md:text-base leading-relaxed">
                    We celebrate our students' achievements through various award ceremonies, recognizing their hard work and dedication.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-8 md:mb-12">Why Choose Us</h2>
            <div className="grid sm:grid-cols-3 gap-4 max-w-6xl mx-auto md:gap-6">
              <Card>
                <CardHeader className="pb-3 md:pb-6">
                  <Award className="h-7 w-7 md:h-10 md:w-10 text-secondary mb-1.5 md:mb-2" />
                  <CardTitle className="text-base md:text-xl">Qualified Faculty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs md:text-base leading-relaxed">
                    Experienced and dedicated teachers committed to student success
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 md:pb-6">
                  <Award className="h-7 w-7 md:h-10 md:w-10 text-secondary mb-1.5 md:mb-2" />
                  <CardTitle className="text-base md:text-xl">Modern Infrastructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs md:text-base leading-relaxed">
                    State-of-the-art facilities including labs, library, and sports complex
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 md:pb-6">
                  <Award className="h-7 w-7 md:h-10 md:w-10 text-secondary mb-1.5 md:mb-2" />
                  <CardTitle className="text-base md:text-xl">Holistic Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs md:text-base leading-relaxed">
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
