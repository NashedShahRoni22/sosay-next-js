import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function MediaSwiper({ media, postId }) {
  if (!media || media.length === 0) return null; 

  // Single media - no slider needed
  if (media.length === 1) {
    const item = media[0];
    return (
      <div className="w-full mb-4 -mx-3 sm:mx-0">
        {item.file_type === 1 ? (
          <div className="relative w-full h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px] overflow-hidden sm:rounded-xl bg-gray-100">
            <Image
              src={item.file_name}
              alt="Post media"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
              priority
            />
          </div>
        ) : (
          <video
            src={item.file_name}
            controls
            className="w-full h-auto max-h-[280px] xs:max-h-[320px] sm:max-h-[380px] md:max-h-[450px] lg:max-h-[500px] sm:rounded-xl bg-black"
            playsInline
          />
        )}
      </div>
    );
  }

  // Multiple media - use Swiper
  return (
    <div className="relative mb-4 -mx-3 sm:mx-0 overflow-hidden sm:rounded-xl group bg-gray-100">
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
              <div className="relative w-full h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px] overflow-hidden bg-gray-100 flex items-center justify-center">
                <Image
                  src={item.file_name}
                  alt={`Post media ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ) : (
              <div className="w-full h-[280px] xs:h-[320px] sm:h-[380px] md:h-[450px] lg:h-[500px] flex items-center justify-center bg-black">
                <video
                  src={item.file_name}
                  controls
                  className="w-full h-full max-h-full object-contain"
                  playsInline
                />
              </div>
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
    </div>
  );
}