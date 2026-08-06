import React from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import FullscreenGallery from "@/components/shared/FullscreenGallery";

export default function UserProfilePhotos({ id }) {
  const { accessToken } = useAppContext();
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  // Fetch user photos
  const { data, isLoading, error } = useQuery({
    queryKey: [`/user/profile/${id}/photos`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken && !!id,
  });

  const photos = data?.data || [];

  const lightboxSlides = photos.map((photo) => ({
    src: photo.image_path,
    alt: photo.caption || "Photo",
  }));

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Photos</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      ) : error ? (
        <p className="text-red-400 text-center mt-10">Failed to load photos</p>
      ) : photos.length === 0 ? (
        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 px-5 py-12 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <ImagePlus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-800 font-semibold">No photos yet</p>
          <p className="text-sm text-gray-500 mt-1 max-w-sm text-center mb-4">
            This user hasn't uploaded any photos yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm cursor-zoom-in text-left"
            >
              <Image
                src={photo.image_path}
                alt={photo.caption || "User photo"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm line-clamp-2 font-medium">
                    {photo.caption}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <FullscreenGallery
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        slides={lightboxSlides}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}
