import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function FullscreenGallery({ open, onOpenChange, slides, initialIndex }) {
  const [loadedSlides, setLoadedSlides] = useState({});
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  return (
    <Lightbox
      key={`${open}-${initialIndex}-${slides.length}`}
      open={open}
      close={() => onOpenChange(false)}
      slides={slides}
      index={currentIndex}
      carousel={{ preload: 6 }}
      controller={{ closeOnBackdropClick: true }}
      on={{
        view: ({ index }) => setCurrentIndex(index),
      }}
      render={{
        slide: ({ slide }) => {
          const slideKey = slide.src;
          const isLoaded = loadedSlides[slideKey];

          return (
            <div className="relative h-full w-full flex items-center justify-center bg-black">
              {!isLoaded && <div className="absolute inset-0 animate-pulse bg-white/10" />}
              <div className="relative h-full w-full">
                <Image
                  src={slide.src}
                  alt={slide.alt || "Gallery image"}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                  onLoad={() =>
                    setLoadedSlides((prev) => ({ ...prev, [slideKey]: true }))
                  }
                  onError={() =>
                    setLoadedSlides((prev) => ({ ...prev, [slideKey]: true }))
                  }
                />
              </div>
              {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                  {currentIndex + 1} / {slides.length}
                </div>
              )}
            </div>
          );
        },
      }}
      styles={{
        container: { backgroundColor: "rgba(0,0,0,0.95)" },
      }}
    />
  );
}
