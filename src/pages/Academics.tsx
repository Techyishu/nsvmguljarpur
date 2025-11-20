import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { GraduationCap, BookOpen, Calculator, FlaskConical, Palette, Trophy, Calendar, CheckCircle2, Globe } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

const Academics = () => {
  const levels = [
    {
      title: "Primary School",
      grade: "Nursery - V",
      description: "Foundation years focusing on basic literacy, numeracy, and social skills development.",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Junior School",
      grade: "VI - VIII",
      description: "Building on fundamentals with enhanced curriculum and skill development programs.",
      icon: Calculator,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Middle School",
      grade: "IX - X",
      description: "CBSE board preparation with comprehensive subject knowledge and exam strategies.",
      icon: FlaskConical,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      title: "Senior School",
      grade: "XI - XII",
      description: "Specialized streams (Science, Commerce, Arts) for career-focused education.",
      icon: GraduationCap,
      color: "text-orange-500",
      bg: "bg-orange-50",
    }
  ];

  const features = [
    {
      title: "CBSE Accreditation",
      description: "Recognized by the Central Board of Secondary Education for quality education from Nursery to Class 12.",
      icon: CheckCircle2
    },
    {
      title: "English Medium",
      description: "English is the primary medium of instruction, ensuring students are well-prepared for global opportunities.",
      icon: Globe
    },
    {
      title: "Specialized Streams",
      description: "Senior School offers Science, Commerce, and Arts streams tailored for career success.",
      icon: Palette
    },
    {
      title: "Scholarships",
      description: "Merit-based scholarships and awards to recognize and encourage academic excellence.",
      icon: Trophy
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-secondary/30">
      <Navbar />

      <main className="flex-grow">
        <PageHero
          title="Academics"
          description="Comprehensive education from Nursery to Class XII with accreditation, structured pathways, and quality instruction."
          eyebrow="Learning Pathways"
          backgroundImage="/images/computer-lab.png"
        />

        {/* Academic Levels */}
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-primary mb-3 md:mb-4">Academic Structure</h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                  A progressive curriculum designed to nurture students at every stage.
                </p>
              </motion.div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
              {levels.map((level, index) => {
                const Icon = level.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative overflow-hidden bg-card border border-border/50 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={clsx("absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 rounded-bl-full opacity-10 transition-transform group-hover:scale-150", level.bg.replace('50', '500'))}></div>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className={clsx("w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6", level.bg)}>
                        <Icon className={clsx("h-6 w-6 md:h-7 md:w-7", level.color)} />
                      </div>

                      <div className="mb-3 md:mb-4">
                        <span className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-secondary/10 text-secondary text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2">
                          {level.grade}
                        </span>
                        <h3 className="text-xl md:text-2xl font-heading font-bold text-primary">{level.title}</h3>
                      </div>

                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5 md:mb-6 flex-grow">
                        {level.description}
                      </p>

                      <div className="flex items-center text-primary font-semibold text-sm group/link cursor-pointer">
                        <span>Learn more</span>
                        <svg className="w-4 h-4 ml-2 transform transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Academic Features */}
        <section className="py-12 md:py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto mb-10 md:mb-16 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold mb-4 md:mb-6">Academic Excellence</h2>
              <p className="text-primary-foreground/80 text-sm sm:text-base md:text-lg">
                Committed to world-class education preparing students for tomorrow's challenges.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-5 md:p-8 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="bg-secondary rounded-lg md:rounded-xl p-2.5 md:p-3 shrink-0">
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-xl font-bold mb-1.5 md:mb-2">{feature.title}</h3>
                        <p className="text-primary-foreground/70 text-xs md:text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10 md:mt-16 text-center">
              <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-md border border-secondary/30 rounded-full px-4 py-2 md:px-6 md:py-3 text-secondary text-sm md:text-base font-semibold">
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs sm:text-sm md:text-base">New Academic Session begins April 1st</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Academics;
