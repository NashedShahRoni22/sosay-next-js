import { useMemo, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import FullscreenGallery from "@/components/shared/FullscreenGallery";

const VideoItem = ({ item, containerClassName, videoClassName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className={`relative flex items-center justify-center bg-black ${containerClassName}`}>
      {!isPlaying && item.thumbnail && (
        <div 
          className="absolute inset-0 z-10 cursor-pointer group"
          onClick={handlePlay}
        >
          <Image 
            src={item.thumbnail} 
            alt="Video thumbnail" 
            fill 
            className="object-contain" 
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors group-hover:bg-black/30">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm transition-transform group-hover:scale-110">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        src={item.file_name}
        poster={item.thumbnail}
        controls={isPlaying || !item.thumbnail}
        className={videoClassName}
        playsInline
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
};


export default function MediaSwiper({ media, postId }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const imageMedia = useMemo(
    () => (Array.isArray(media) ? media.filter((item) => item.file_type === 1) : []),
    [media]
  );

  if (!media || media.length === 0) return null;

  const lightboxSlides = imageMedia.map((img, idx) => ({
    src: img.file_name,
    alt: `Image ${idx + 1}`,
  }));

  const openLightbox = (imageUrl) => {
    const index = imageMedia.findIndex((item) => item.file_name === imageUrl);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  };

  // Single media - no slider needed
  if (media.length === 1) {
    const item = media[0];
    return (
      <>
        <div className="mb-4 -mx-3 sm:mx-0 w-[calc(100%+1.5rem)] sm:w-full">
          {item.file_type === 1 ? (
            <button
              type="button"
              onClick={() => openLightbox(item.file_name)}
              className="relative w-full h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px] overflow-hidden sm:rounded-xl bg-gray-100 cursor-zoom-in"
            >
              <Image
                src={item.file_name}
                alt="Post media"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
                priority
              />
            </button>
          ) : (
            <VideoItem
              item={item}
              containerClassName="w-full sm:rounded-xl overflow-hidden"
              videoClassName="w-full h-auto max-h-[280px] xs:max-h-[320px] sm:max-h-[380px] md:max-h-[450px] lg:max-h-[500px]"
            />
          )}
        </div>

        <FullscreenGallery
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          slides={lightboxSlides}
          initialIndex={lightboxIndex}
        />
      </>
    );
  }

  // Multiple media - use Swiper
  return (
    <div className="relative mb-4 -mx-3 sm:mx-0 w-[calc(100%+1.5rem)] sm:w-full overflow-hidden sm:rounded-xl group bg-gray-100">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: `.swiper-button-next-${postId}`,
          prevEl: `.swiper-button-prev-${postId}`,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        spaceBetween={0}
        className="w-full"
        style={{
          "--swiper-pagination-color": "#5f65de",
          "--swiper-pagination-bullet-inactive-color": "#cbd5e1",
          "--swiper-pagination-bullet-inactive-opacity": "1",
        }}
      >
        {media.map((item, idx) => (
          <SwiperSlide key={idx}>
            {item.file_type === 1 ? (
              <button
                type="button"
                onClick={() => openLightbox(item.file_name)}
                className="relative w-full h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px] overflow-hidden bg-gray-100 flex items-center justify-center cursor-zoom-in"
              >
                <Image
                  src={item.file_name}
                  alt={`Post media ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </button>
            ) : (
              <VideoItem
                item={item}
                containerClassName="w-full h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px]"
                videoClassName="w-full h-full max-h-full object-contain"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons - Hidden on mobile */}
      <button
        className={`cursor-pointer swiper-button-prev-${postId} absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        className={`cursor-pointer swiper-button-next-${postId} absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <FullscreenGallery
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        slides={lightboxSlides}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}