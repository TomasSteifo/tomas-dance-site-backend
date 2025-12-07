import { useState } from 'react';
import { Play, X } from 'lucide-react';

// TODO: Replace these placeholder URLs with actual media
// Images should be 16:9 or similar aspect ratio for consistency
const galleryItems = [
  {
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=450&fit=crop',
    alt: 'Bachata dance performance',
  },
  {
    type: 'video' as const,
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // TODO: Replace with actual video
    alt: 'Dance workshop highlights',
  },
  {
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=450&fit=crop',
    alt: 'Private class session',
  },
  {
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=450&fit=crop',
    alt: 'Dance event performance',
  },
  {
    type: 'video' as const,
    thumbnail: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // TODO: Replace with actual video
    alt: 'Student progress showcase',
  },
  {
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=800&h=450&fit=crop',
    alt: 'Dance social event',
  },
];

export function GallerySection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-background text-sm text-muted-foreground mb-4">
            Gallery
          </span>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Feel the Energy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Glimpses from classes, workshops, and performances. Experience the passion and energy of bachata.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => item.type === 'video' && setActiveVideo(item.videoUrl)}
            >
              <img
                src={item.type === 'image' ? item.src : item.thumbnail}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
              
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-button group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            onClick={() => setActiveVideo(null)}
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
          <div 
            className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={activeVideo}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
