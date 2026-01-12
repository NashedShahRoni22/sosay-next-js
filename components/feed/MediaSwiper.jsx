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
      <div className="w-full rounded-xl overflow-hidden mb-4">
        {item.file_type === 1 ? (
          <Image
            src={item.file_name}
            alt="Post media"
            className="w-full h-auto max-h-[500px] object-contain mx-auto"
            height={500}
            width={500}
          />
        ) : (
          <video
            src={item.file_name}
            controls
            className="w-full h-auto max-h-[500px]"
          />
        )}
      </div>
    );
  }

  // Multiple media - use Swiper
  return (
    <div className="relative mb-4 rounded-xl overflow-hidden group">
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
        className="w-full"
        style={{
          "--swiper-pagination-color": "#5f65de",
          "--swiper-pagination-bullet-inactive-color": "#cbd5e1",
          "--swiper-pagination-bullet-inactive-opacity": "1",
        }}
      >
        {media.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full flex items-center justify-center">
              {item.file_type === 1 ? (
                <Image
                  src={item.file_name}
                  alt={`Post media ${idx + 1}`}
                  className="w-full h-auto max-h-[500px] object-contain"
                  height={500}
                  width={500}
                  loading="eager"
                />
              ) : (
                <video
                  src={item.file_name}
                  controls
                  className="w-full h-auto max-h-[500px]"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        className={`cursor-pointer swiper-button-prev-${postId} absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        className={`cursor-pointer swiper-button-next-${postId} absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
