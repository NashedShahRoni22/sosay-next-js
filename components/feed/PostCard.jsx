import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";

export default function PostCard({ post }) {
  const images = post?.post_files?.filter((file) => file.file_type === 1) || [];
  const videos = post?.post_files?.filter((file) => file.file_type === 2) || [];
console.log(images);

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // difference in seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Render images based on count
  const renderImages = () => {
    if (images.length === 0) return null;

    // Single image - full width
    if (images.length === 1) {
      return (
        <div className="w-full rounded-xl overflow-hidden mb-4">
          <img
            src={images[0].file_name}
            alt="Post image"
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      );
    }

    // Two images - side by side
    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden mb-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative h-[300px]">
              <img
                src={img.file_name}
                alt={`Post image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      );
    }

    // Three images - one large on left, two stacked on right
    if (images.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden mb-4">
          <div className="relative row-span-2 h-[400px]">
            <img
              src={images[0].file_name}
              alt="Post image 1"
              className="w-full h-full object-cover"
            />
          </div>
          {images.slice(1).map((img, idx) => (
            <div key={idx} className="relative h-[199px]">
              <img
                src={img.file_name}
                alt={`Post image ${idx + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      );
    }

    // Four images - 2x2 grid
    if (images.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden mb-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative h-[250px]">
              <img
                src={img.file_name}
                alt={`Post image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      );
    }

    // Five or more images - 2x2 grid with "+N more" overlay on last image
    if (images.length >= 5) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden mb-4">
          {images.slice(0, 4).map((img, idx) => (
            <div key={idx} className="relative h-[250px]">
              <img
                src={img.file_name}
                alt={`Post image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Show overlay on 4th image if there are more */}
              {idx === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-3xl font-semibold">
                    +{images.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          {post?.user?.profile_image ? (
            <img
              src={post.user.profile_image}
              alt={post.user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
              {post?.user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{post?.user?.name}</p>
          <p className="text-sm text-gray-500">
            {formatDate(post?.created_at)}
          </p>
        </div>
      </div>

      {/* Post Content */}
      {post?.description && (
        <div className="mb-4">
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post?.description }}
          />
        </div>
      )}

      {/* Images */}
      {renderImages()}

      {/* Videos - if you want to show videos too */}
      {videos.length > 0 && (
        <div className="mb-4 space-y-2">
          {videos.map((video, idx) => (
            <video
              key={idx}
              src={video.file_name}
              controls
              className="w-full rounded-xl"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition">
            <Heart size={20} />
            <span className="text-sm">Like</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition">
            <MessageCircle size={20} />
            <span className="text-sm">Comment</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition">
            <Share2 size={20} />
            <span className="text-sm">Share</span>
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {post?.comments?.length || 0} comments
        </div>
      </div>
    </div>
  );
}