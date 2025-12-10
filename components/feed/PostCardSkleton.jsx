import { Heart, MessageCircle, Share2 } from "lucide-react";

export default function PostCardSkleton() {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Post Content */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-gray-200 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
      </div>

      {/* Media (image/video placeholder) */}
      <div className="w-full h-56 bg-gray-300 rounded-xl mb-4"></div>

      {/* Actions */}
      <div className="flex justify-between text-gray-400">
        <div className="flex items-center gap-6">
          <Heart size={20} />
          <MessageCircle size={20} />
          <Share2 size={20} />
        </div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
