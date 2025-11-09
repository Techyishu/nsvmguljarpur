import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";
import { mockGallery } from "@/data/mockData";

const Gallery = () => {
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
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto md:gap-6">
            {mockGallery.map((item) => (
              <Card key={item.id} className="overflow-hidden group border-border hover:border-secondary transition-all">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 md:p-6">
                    <div className="text-white">
                      <h3 className="font-bold text-base mb-0.5 uppercase tracking-wide md:text-xl md:mb-1 md:tracking-wider">{item.title}</h3>
                      <p className="text-xs text-secondary uppercase tracking-wide md:text-sm md:tracking-wider">{item.category}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
