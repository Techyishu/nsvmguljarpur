import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { BookOpen, Trophy, Building, Music, Bus, Laptop, Wifi, Coffee, ShieldCheck, Trees } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

const Facilities = () => {
  const facilities = [
    {
      icon: BookOpen,
      title: "Library",
      description: "A knowledge hub with over 4000 books, digital resources, and quiet reading zones.",
      image: "/images/library.png"
    },
    {
      icon: Laptop,
      title: "Computer Lab",
      description: "Advanced computer laboratory equipped with latest hardware and high-speed internet.",
      image: "/images/computer-lab.png"
    },
    {
      icon: Building,
      title: "Science Labs",
      description: "State-of-the-art Physics, Chemistry, and Biology labs for practical learning.",
      image: "/images/lab.png"
    },
    {
      icon: Trophy,
      title: "Sports Complex",
      description: "Comprehensive facilities for athletics, basketball, volleyball, and indoor games.",
      image: "/images/sports-complex.png"
    },
    {
      icon: Music,
      title: "Music & Arts",
      description: "Dedicated studios for music, dance, and fine arts to nurture creativity.",
      image: "/images/music and arts.png"
    },
    {
      icon: Bus,
      title: "Transport",
      description: "Safe and reliable GPS-enabled bus fleet covering all major routes.",
      image: "/images/transport-facility.png"
    }
  ];

  const amenities = [
    { icon: Wifi, label: "Wi-Fi Campus" },
    { icon: ShieldCheck, label: "24/7 Security" },
    { icon: Coffee, label: "Cafeteria" },
    { icon: Trees, label: "Green Campus" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-secondary/30">
      <Navbar />

      <main className="flex-grow">
        <PageHero
          title="Our Facilities"
          description="State-of-the-art infrastructure curated to support academic excellence, wellbeing, and co-curricular pursuits."
          eyebrow="Campus Highlights"
          backgroundImage="/images/Gemini_Generated_Image_c17bkmc17bkmc17b.png"
        />

        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-primary mb-3 md:mb-4">World-Class Infrastructure</h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                  Designed to provide an optimal environment for learning and growth.
                </p>
              </motion.div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto">
              {facilities.map((facility, index) => {
                const Icon = facility.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-card rounded-2xl md:rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="h-40 md:h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors z-10"></div>
                      <img
                        src={facility.image}
                        alt={facility.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 bg-white/90 backdrop-blur-sm p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-sm">
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="text-base md:text-xl font-heading font-bold text-primary mb-1.5 md:mb-2">{facility.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {facility.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Amenities */}
        <section className="py-12 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto text-center">
              {amenities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex flex-col items-center gap-3 md:gap-4 group"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                      <Icon className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <span className="font-heading font-bold text-sm md:text-base lg:text-lg">{item.label}</span>
                  </motion.div>
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
