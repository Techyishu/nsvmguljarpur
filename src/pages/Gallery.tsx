import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";
import { usePublishedGallery } from "@/hooks/useContentQueries";
import { Loader2 } from "lucide-react";

const Gallery = () => {
  const galleryQuery = usePublishedGallery();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <PageHero
        title="Gallery"
        description="A glimpse into the vibrant life of Anupam Shiksha Niketan — campus, classrooms, celebrations, and achievements."
        eyebrow="Memories & Moments"
      />

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4">
          {galleryQuery.isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-xs uppercase tracking-[0.3em]">Loading gallery</p>
            </div>
          ) : galleryQuery.isError ? (
            <div className="max-w-2xl mx-auto rounded-lg border border-destructive/40 bg-destructive/10 p-8 text-center text-destructive">
              Unable to load gallery images. Please try again later.
            </div>
          ) : !galleryQuery.data?.length ? (
            <div className="max-w-2xl mx-auto rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
              No gallery images available yet. Check back soon!
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto md:gap-6">
              {galleryQuery.data.map((item) => (
                <Card key={item.id} className="overflow-hidden group border-border hover:border-secondary transition-all">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={item.image_url}
                      alt="Gallery image"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
