import React, { useState, useRef } from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ProfileLifestyle() {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch lifestyle photos
  const { data, isLoading, error } = useQuery({
    queryKey: ["/user/profile/lifestyle/get-photos", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const photos = data?.data || [];

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/user/profile/media/categories", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const categories = categoriesData?.data || [];

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      return postWithToken(
        "/user/profile/lifestyle/photos",
        formData,
        accessToken,
      );
    },
    onSuccess: (res) => {
      if (res.status || res.status_code === 200 || res.status_code === 201) {
        toast.success(res.message || "Photo uploaded successfully!");
        queryClient.invalidateQueries({
          queryKey: ["/user/profile/lifestyle/photos", accessToken],
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
    setCategoryId("");
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    const fd = new FormData();
    fd.append("image", selectedFile);
    fd.append("media_category_id", categoryId);

    uploadMutation.mutate(fd);
  };

  // Create a map for category names to display nicely over photos
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Lifestyle</h2>
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
          <p className="text-gray-800 font-semibold">No lifestyle photos yet</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
            >
              <Image
                src={photo.image_path}
                alt={categoryMap[photo.media_category_id] || "Lifestyle photo"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {photo.media_category_id &&
                categoryMap[photo.media_category_id] && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm line-clamp-2 font-medium">
                      {categoryMap[photo.media_category_id]}
                    </p>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">
                Upload Lifestyle Photo
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={uploadMutation.isPending}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-5 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={uploadMutation.isPending || isLoadingCategories}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white"
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

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
                  disabled={
                    !selectedFile || !categoryId || uploadMutation.isPending
                  }
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
    </div>
  );
}
