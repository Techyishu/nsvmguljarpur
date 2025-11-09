import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const StaticHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-white to-primary/10">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-xl">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-primary md:text-xs md:tracking-[0.35em]">
              Anupam Shiksha Niketan Sr. Sec. School
            </span>
            <h1 className="mt-4 text-2xl font-semibold text-primary md:mt-6 md:text-5xl">
              Nurturing confident, compassionate learners since 2001.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:mt-6 md:text-lg">
              From Nursery to Class XII, we deliver a balanced education that blends values,
              academics, and enrichment programmes. Our commitment is to help every learner discover
              their strengths and lead with integrity.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3 md:mt-8">
              <Button
                asChild
                className="bg-primary px-5 py-4 text-xs font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 md:px-6 md:py-5 md:text-sm"
              >
                <Link to="/about">Explore Our Story</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary/40 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-primary/10 md:px-6 md:py-5 md:text-sm"
              >
                <Link to="/contact">Plan a Visit</Link>
              </Button>
            </div>
          </div>

          <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-xl lg:mt-0">
            <img
              src="/images/imgi_136_our-gallery-19.jpg"
              alt="Anupam Shiksha Niketan campus"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

