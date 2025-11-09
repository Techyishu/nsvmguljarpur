import clsx from "clsx";

type Alignment = "center" | "left";

interface PageHeroProps {
  title: string;
  description: string;
  eyebrow?: string;
  backgroundImage?: string;
  align?: Alignment;
}

export const PageHero = ({
  title,
  description,
  eyebrow,
  backgroundImage,
  align = "center",
}: PageHeroProps) => {
  const alignmentClasses =
    align === "center"
      ? "text-center mx-auto items-center"
      : "text-left ml-0 items-start";

  return (
    <section className="relative overflow-hidden">
      {backgroundImage ? (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-white to-primary/10" />
      )}

      <div className="relative container mx-auto px-4 py-12 md:py-24">
        <div className={clsx("flex flex-col gap-3 max-w-3xl md:gap-4", alignmentClasses)}>
          {eyebrow && (
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-primary md:text-xs md:tracking-[0.35em]">
              {eyebrow}
            </span>
          )}
          <h1 className="text-2xl md:text-5xl font-semibold text-primary">{title}</h1>
          <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

