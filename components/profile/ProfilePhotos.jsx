import React, { useState, useRef } from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import FullscreenGallery from "@/components/shared/FullscreenGallery";

export default function ProfilePhotos() {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [readMorePhoto, setReadMorePhoto] = useState(null);

  // Fetch photos
  const { data, isLoading, error } = useQuery({
    queryKey: ["/user/profile/photos", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const photos = data?.data || [];

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      return postWithToken("/user/profile/photos", formData, accessToken);
    },
    onSuccess: (res) => {
      if (res.status || res.status_code === 200 || res.status_code === 201) {
        toast.success(res.message || "Photo uploaded successfully!");
        queryClient.invalidateQueries({
          queryKey: ["/user/profile/photos", accessToken],
        });
        handleCloseModal();
      } else {
        toast.error(res.message || "Failed to upload photo.");
      }
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to upload photo.");
    },
  });

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCaption("");
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const fd = new FormData();
    fd.append("image", selectedFile);
    if (caption.trim()) {
      fd.append("caption", caption.trim());
    }
    uploadMutation.mutate(fd);
  };

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
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary/90 transition shadow-sm"
        >
          <ImagePlus className="w-4 h-4" />
          Add Photo
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
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
            Share your best moments with your friends by uploading your first
            photo.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-secondary/90 transition shadow-md"
          >
            Upload a Photo
          </button>
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
                onClick={() => openLightbox(index)}
                className="group relative aspect-square w-full bg-gray-100 cursor-zoom-in overflow-hidden block"
              >
                <Image
                  src={photo.image_path}
                  alt={photo.caption || "User photo"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              {photo.caption && (
                <div className="p-3 flex flex-col gap-1">
                  <p className="text-gray-700 text-sm line-clamp-2 whitespace-pre-wrap">
                    {photo.caption}
                  </p>
                  {photo.caption.length > 70 && (
                    <button
                      onClick={() => setReadMorePhoto(photo)}
                      className="text-xs text-secondary font-medium text-left hover:underline"
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800 text-lg">Upload Photo</h3>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={uploadMutation.isPending}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleUpload}
              className="p-5 flex flex-col gap-5 overflow-y-auto"
            >
              {previewUrl && (
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Caption (Optional)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption for your photo..."
                  rows={3}
                  disabled={uploadMutation.isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none transition-shadow"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={uploadMutation.isPending}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || uploadMutation.isPending}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-secondary rounded-xl hover:bg-secondary/90 transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm"
                >
                  {uploadMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FullscreenGallery
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        slides={lightboxSlides}
        initialIndex={lightboxIndex}
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
                <X className="w-5 h-5" />
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
