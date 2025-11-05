import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { mockGallery } from "@/data/mockData";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Gallery = () => {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Events", "Facilities"];

  const filteredImages = filter === "All" 
    ? mockGallery 
    : mockGallery.filter(img => img.category === filter);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-6 uppercase tracking-tight">NEWS & EVENTS</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our vibrant community through these captured moments
          </p>
        </div>
      </section>

      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setFilter(category)}
                variant={filter === category ? "default" : "outline"}
                className={`font-bold uppercase tracking-wider ${
                  filter === category
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "border-2 border-border hover:border-secondary hover:bg-transparent"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredImages.map((item) => (
              <Card key={item.id} className="overflow-hidden group border-border hover:border-secondary transition-all">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="text-white">
                      <h3 className="font-bold text-xl mb-1 uppercase tracking-wider">{item.title}</h3>
                      <p className="text-sm text-secondary uppercase tracking-wider">{item.category}</p>
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
