import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useAppContext } from "@/context/context";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import toast from "react-hot-toast";

export default function PreferenceModal({ isOpen, onClose }) {
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch available tags
  const { data: availableTagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ["/feed_management/preferences/tags", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken && isOpen,
  });

  // Fetch user preference tags
  const { data: userTagsData, isLoading: isLoadingUserTags } = useQuery({
    queryKey: ["/feed_management/preferences/me", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken && isOpen,
  });

  useEffect(() => {
    if (userTagsData?.data) {
      setSelectedTags(userTagsData.data.map((tag) => tag.id));
    }
  }, [userTagsData]);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const updateMutation = useMutation({
    mutationFn: async (tags) => {
      const formData = new FormData();
      tags.forEach((tagId, index) => {
        formData.append(`tag_ids[${index}]`, tagId);
      });
      return postWithToken(
        "/feed_management/preferences/update",
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Preferences updated successfully!");
        queryClient.invalidateQueries([
          "/feed_management/preferences/me",
          accessToken,
        ]);
        onClose();
      } else {
        toast.error(data.message || "Failed to update preferences");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "An error occurred");
    },
  });

  const handleSave = () => {
    updateMutation.mutate(selectedTags);
  };

  if (!isOpen) return null;

  const tags = availableTagsData?.data || [];
  const isLoading = isLoadingTags || isLoadingUserTags;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Your Preferences</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-gray-600 mb-6">
            Select the topics you are interested in to personalize your feed.
          </p>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={clsx(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                      isSelected
                        ? "bg-secondary text-secondary-foreground border-secondary shadow-md transform scale-105"
                        : "bg-white text-gray-600 border-gray-200 hover:border-secondary hover:text-secondary",
                    )}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending || isLoading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-secondary rounded-xl hover:bg-secondary/90 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {updateMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
