import { motion } from "framer-motion";
import clsx from "clsx";

interface PageHeroProps {
  title: string;
  description?: string;
  eyebrow?: string;
  backgroundImage?: string;
  className?: string;
}

export const PageHero = ({
  title,
  description,
  eyebrow,
  backgroundImage = "/images/school-building.jpg", // Default fallback
  className
}: PageHeroProps) => {
  return (
    <section className={clsx("relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden", className)}>
      {/* Background Image with Parallax-like effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          {eyebrow && (
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary text-xs font-bold uppercase tracking-widest mb-4">
              {eyebrow}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      </div>

      {/* Decorative Bottom Curve */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-background rounded-t-[50%] scale-x-150 translate-y-1/2 z-20" />
    </section>
  );
};
