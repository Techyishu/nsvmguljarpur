import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";

export const HeroSlider = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Gemini_Generated_Image_c17bkmc17bkmc17b.png"
          alt="School Campus"
          className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Animated Shapes */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10 px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-secondary animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Admissions Open for 2025-26</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight">
            <span className="block text-white mb-2">Nurturing Minds,</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-white to-secondary animate-gradient bg-300%">
              Building Futures
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
            Experience education that goes beyond textbooks. We foster creativity, confidence, and character in every student.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-lg rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/25 transition-all duration-300 hover:-translate-y-1"
            >
              <Link to="/contact">
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
            >
              <Link to="/about">Discover More</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 md:pt-20 border-t border-white/10 mt-12">
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-bold text-white">1000+</div>
              <div className="text-sm text-white/60 font-medium uppercase tracking-wider">Happy Students</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
              <div className="text-sm text-white/60 font-medium uppercase tracking-wider">Expert Faculty</div>
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
              <div className="text-sm text-white/60 font-medium uppercase tracking-wider">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-0.5 h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
};
