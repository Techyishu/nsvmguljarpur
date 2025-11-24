import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Palette, Trophy, Calendar, CheckCircle2, Globe } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

const Academics = () => {


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
