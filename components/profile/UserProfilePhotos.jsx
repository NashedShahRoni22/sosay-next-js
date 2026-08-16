import React from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import { ImagePlus, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import FullscreenGallery from "@/components/shared/FullscreenGallery";
import MediaPaymentModal from "./MediaPaymentModal";

export default function UserProfilePhotos({ id }) {
  const { accessToken } = useAppContext();
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const [readMorePhoto, setReadMorePhoto] = React.useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const [selectedMediaId, setSelectedMediaId] = React.useState(null);

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
    <div className="mt-4 pb-10">
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
        <div className="grid md:grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
            >
              <button
                type="button"
                onClick={() => {
                  if (
                    photo.is_locked &&
                    photo.access_type === "distinct_paid"
                  ) {
                    setSelectedMediaId(photo.id);
                    setPaymentModalOpen(true);
                  } else if (!photo.is_locked) {
                    openLightbox(index);
                  }
                }}
                className={`group relative aspect-square w-full bg-gray-100 overflow-hidden block ${photo.is_locked ? "cursor-not-allowed" : "cursor-zoom-in"}`}
              >
                {photo.is_locked ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white transition-all duration-300 group-hover:from-gray-700 group-hover:to-gray-800">
                    <div className="bg-white/10 p-4 rounded-full mb-4 backdrop-blur-md border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Lock className="w-7 h-7 text-yellow-400" />
                    </div>
                    {photo.access_type === "distinct_paid" ? (
                      <span className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400/30 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] transition-all">
                        Unlock for ${photo.price || "0.00"}
                      </span>
                    ) : (
                      <span className="px-5 py-2 bg-white/5 text-gray-300 text-sm font-semibold rounded-full border border-white/10 backdrop-blur-sm">
                        Subscriber Only
                      </span>
                    )}
                  </div>
                ) : (
                  <Image
                    src={photo.image_path}
                    alt={photo.caption || "User photo"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </button>
              {photo.caption && (
                <div className="p-3 flex flex-col gap-1">
                  <p className="text-gray-700 text-sm line-clamp-2 whitespace-pre-wrap">
                    {photo.caption}
                  </p>
                  {photo.caption.length > 70 && (
                    <button
                      onClick={() => setReadMorePhoto(photo)}
                      className="text-xs text-secondary font-medium text-left hover:underline mt-1"
                    >
                      Read more
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <FullscreenGallery
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        slides={lightboxSlides}
        initialIndex={lightboxIndex}
      />

      <MediaPaymentModal
        mediaId={selectedMediaId}
        mediaType="photo"
        accessToken={accessToken}
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccessCallback={() => setPaymentModalOpen(false)}
      />

      {/* Read More Modal */}
      {readMorePhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800 text-lg">Photo Details</h3>
              <button
                type="button"
                onClick={() => setReadMorePhoto(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-5 flex flex-col gap-4">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={readMorePhoto.image_path}
                  alt={readMorePhoto.caption || "Photo"}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {readMorePhoto.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
