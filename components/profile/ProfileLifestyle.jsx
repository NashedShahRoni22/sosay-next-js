import React, { useState, useRef } from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, X, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import FullscreenGallery from "@/components/shared/FullscreenGallery";

export default function ProfileLifestyle() {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [caption, setCaption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [readMorePhoto, setReadMorePhoto] = useState(null);
  const [accessType, setAccessType] = useState("free");
  const [price, setPrice] = useState("");
  const [editingPhoto, setEditingPhoto] = useState(null);

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
          queryKey: ["/user/profile/lifestyle/get-photos", accessToken],
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

  const updateMutation = useMutation({
    mutationFn: async ({ id, fd }) => {
      return postWithToken(`/user/profile/lifestyle/photos/${id}`, fd, accessToken);
    },
    onSuccess: (res) => {
      if (res.status || res.status_code === 200 || res.status_code === 201) {
        toast.success(res.message || "Photo updated successfully!");
        queryClient.invalidateQueries({
          queryKey: ["/user/profile/lifestyle/get-photos", accessToken],
        });
        handleCloseModal();
      } else {
        toast.error(res.message || "Failed to update photo.");
      }
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update photo.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const fd = new FormData();
      fd.append("_method", "DELETE");
      return postWithToken(`/user/profile/lifestyle/photos/${id}`, fd, accessToken);
    },
    onSuccess: (res) => {
      if (res.status || res.status_code === 200) {
        toast.success(res.message || "Photo deleted successfully!");
        queryClient.invalidateQueries({
          queryKey: ["/user/profile/lifestyle/get-photos", accessToken],
        });
      } else {
        toast.error(res.message || "Failed to delete photo.");
      }
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete photo.");
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
    setCaption("");
    setAccessType("free");
    setPrice("");
    setEditingPhoto(null);
  };

  const handleEditClick = (photo) => {
    setEditingPhoto(photo);
    setCategoryId(photo.media_category_id || "");
    setCaption(photo.caption || "");
    setAccessType(photo.access_type || "free");
    setPrice(photo.price || "");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (accessType === "distinct_paid" && !price) {
      toast.error("Price is required for distinct paid access.");
      return;
    }

    const fd = new FormData();
    if (editingPhoto) {
      fd.append("_method", "PUT");
      fd.append("media_category_id", categoryId);
      if (caption.trim()) {
        fd.append("caption", caption.trim());
      }
      fd.append("access_type", accessType);
      if (accessType === "distinct_paid") {
        fd.append("price", price);
      }
      updateMutation.mutate({ id: editingPhoto.id, fd });
    } else {
      if (!selectedFile) return;
      fd.append("image", selectedFile);
      fd.append("media_category_id", categoryId);
      if (caption.trim()) {
        fd.append("caption", caption.trim());
      }
      
      fd.append("access_type", accessType);
      if (accessType === "distinct_paid") {
        fd.append("price", price);
      }
  
      uploadMutation.mutate(fd);
    }
  };

  // Create a map for category names to display nicely over photos
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  const lightboxSlides = photos.map((photo) => ({
    src: photo.image_path,
    alt:
      photo.caption ||
      categoryMap[photo.media_category_id] ||
      "Lifestyle photo",
  }));

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="mt-4 pb-10">
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
        <div className="grid md:grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative group"
            >
              <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleEditClick(photo)}
                  className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-sm backdrop-blur-sm transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(photo.id)}
                  disabled={deleteMutation.isPending}
                  className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-sm backdrop-blur-sm transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => openLightbox(index)}
                className="group relative aspect-square w-full bg-gray-100 cursor-zoom-in overflow-hidden block"
              >
                <Image
                  src={photo.image_path}
                  alt={
                    categoryMap[photo.media_category_id] || "Lifestyle photo"
                  }
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              {(photo.caption ||
                (photo.media_category_id &&
                  categoryMap[photo.media_category_id])) && (
                <div className="p-3 flex flex-col gap-1">
                  {photo.media_category_id &&
                    categoryMap[photo.media_category_id] && (
                      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                        {categoryMap[photo.media_category_id]}
                      </span>
                    )}
                  {photo.caption && (
                    <p className="text-gray-700 text-sm line-clamp-2 whitespace-pre-wrap">
                      {photo.caption}
                    </p>
                  )}
                  {photo.caption && photo.caption.length > 70 && (
                    <button
                      onClick={() =>
                        setReadMorePhoto({
                          ...photo,
                          categoryName: categoryMap[photo.media_category_id],
                        })
                      }
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800 text-lg">
                {editingPhoto ? "Edit Lifestyle Photo" : "Upload Lifestyle Photo"}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={uploadMutation.isPending || updateMutation.isPending}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleUpload}
              className="p-5 flex flex-col gap-5 overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={uploadMutation.isPending || updateMutation.isPending || isLoadingCategories}
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

              {!editingPhoto && previewUrl && (
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {editingPhoto && editingPhoto.image_path && (
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                  <Image
                    src={editingPhoto.image_path}
                    alt="Current photo"
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
                  placeholder="Write a caption..."
                  rows={3}
                  disabled={uploadMutation.isPending || updateMutation.isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Access Type
                </label>
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value)}
                  disabled={uploadMutation.isPending || updateMutation.isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white"
                >
                  <option value="free">Free</option>
                  <option value="subscriber_only">Subscriber Only</option>
                  <option value="distinct_paid">Distinct Paid</option>
                </select>
              </div>

              {accessType === "distinct_paid" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={uploadMutation.isPending || updateMutation.isPending}
                    placeholder="Enter price"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 bg-white"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={uploadMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    (!editingPhoto && !selectedFile) || !categoryId || uploadMutation.isPending || updateMutation.isPending
                  }
                  className="px-5 py-2.5 text-sm font-medium text-white bg-secondary rounded-xl hover:bg-secondary/90 transition-colors flex items-center gap-2 disabled:opacity-70 shadow-sm"
                >
                  {(uploadMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingPhoto ? "Save Changes" : "Upload"}
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
              <div className="flex flex-col gap-2">
                {readMorePhoto.categoryName && (
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    {readMorePhoto.categoryName}
                  </span>
                )}
                {readMorePhoto.caption && (
                  <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {readMorePhoto.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
