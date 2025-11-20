import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { usePublishedGallery } from "@/hooks/useContentQueries";
import { Loader2, ImageOff, X, ZoomIn } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const Gallery = () => {
  const galleryQuery = usePublishedGallery();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Add cache-busting to image URLs
  const getImageUrl = (url: string) => {
    const separator = url.includes('?') ? '&' : '?';
    const metadataFixVersion = 'v2';
    return `${url}${separator}v=${metadataFixVersion}`;
  };

  const handleImageError = (imageUrl: string, event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    console.error('🖼️ Image failed to load:', { url: imageUrl });

    if (!failedImages.has(imageUrl)) {
      setFailedImages(prev => new Set(prev).add(imageUrl));
      // Retry with cache-busting parameter
      const separator = imageUrl.includes('?') ? '&' : '?';
      img.src = `${imageUrl}${separator}t=${Date.now()}&nocache=1`;
    }
  };

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-secondary/30">
      <Navbar />

      <main className="flex-grow">
        <PageHero
          title="Gallery"
          description="A glimpse into the vibrant life of Nirakar Jyoti Vidya Mandir Gullarpur — campus, classrooms, celebrations, and achievements."
          eyebrow="Memories & Moments"
          backgroundImage="/images/Gemini_Generated_Image_u9zorwu9zorwu9zo.png"
        />

        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            {galleryQuery.isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium uppercase tracking-widest">Loading gallery...</p>
              </div>
            ) : galleryQuery.isError ? (
              <div className="max-w-2xl mx-auto rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
                <p className="font-medium">Unable to load gallery images.</p>
                <p className="text-sm opacity-80 mt-1">Please check your connection and try again.</p>
              </div>
            ) : !galleryQuery.data?.length ? (
              <div className="max-w-2xl mx-auto rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
                <p className="text-lg">No gallery images available yet.</p>
                <p className="text-sm mt-2">Check back soon for updates!</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {galleryQuery.data.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="break-inside-avoid"
                  >
                    <div
                      className="group relative overflow-hidden rounded-xl bg-muted cursor-zoom-in"
                      onClick={() => setSelectedImage(item.image_url)}
                    >
                      {failedImages.has(item.image_url) ? (
                        <div className="w-full aspect-[4/3] flex items-center justify-center bg-muted text-muted-foreground">
                          <ImageOff className="h-8 w-8" />
                        </div>
                      ) : (
                        <>
                          <img
                            src={getImageUrl(item.image_url)}
                            alt="Gallery image"
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => handleImageError(item.image_url, e)}
                            loading="lazy"
                            crossOrigin="anonymous"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                              <ZoomIn className="w-6 h-6" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={getImageUrl(selectedImage)}
                alt="Gallery Preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
