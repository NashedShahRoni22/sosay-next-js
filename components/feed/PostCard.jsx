import { Edit, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostComments from "./PostComments";
import MediaSwiper from "./MediaSwiper";
import ReactionButton from "./ReactionButton";
import PostContent from "./PostContent";

export default function PostCard({ post }) {
  const location = usePathname();
  const images = post?.post_files?.filter((file) => file.file_type === 1) || [];
  const videos = post?.post_files?.filter((file) => file.file_type === 2) || [];
  const allMedia = [...images, ...videos].sort((a, b) => a.id - b.id);

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

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

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/app/profile/${post?.user?.id}`}>
          <Avatar className="h-11 w-11 cursor-pointer ring-2 ring-gray-100 hover:ring-secondary transition-all">
            <AvatarImage src={post?.user?.profile_picture} />
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link href={`/app/profile/${post?.user?.id}`}>
            <p className="font-semibold text-gray-900 hover:text-secondary transition-colors cursor-pointer">
              {post?.user?.name}
            </p>
          </Link>
          <p className="text-xs text-gray-500">
            {formatDate(post?.created_at)}
          </p>
        </div>
        {location === "/app/profile" && (
          <Link href={`/app/post/${post?.id}`}>
            <Edit className="size-4 text-gray-600 hover:text-secondary transition-colors" />
          </Link>
        )}
      </div>

      {/* Post Content */}
      <PostContent description={post?.description} />

      {/* Media (Images & Videos) */}
      <MediaSwiper media={allMedia} postId={post.id} />

      {/* Reactions Summary */}
      {post?.reactions_count > 0 && (
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
          {post?.reaction_counts && (
            <div className="flex items-center gap-1">
              {Object.entries(post.reaction_counts).map(([type, count]) => (
                <span key={type} className="flex items-center gap-1">
                  <span className="capitalize">{type}</span>
                  <span className="text-gray-400">({count})</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <Dialog>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-6">
            {/* Reaction button */}
            <ReactionButton post={post} />

            {/* Comment button */}
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors cursor-pointer">
                <MessageCircle size={20} />
                <span className="text-sm hidden md:block">Comment</span>
              </button>
            </DialogTrigger>

            {/* Share button */}
            <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors">
              <Share2 size={20} />
              <span className="text-sm hidden md:block">Share</span>
            </button>
          </div>

          <DialogTrigger asChild>
            <button className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-colors font-medium">
              {post?.comments?.length || 0} comments
            </button>
          </DialogTrigger>
        </div>

        <DialogContent className="sm:max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post?.user?.profile_picture} />
              </Avatar>
              <span>{post?.user?.name}'s Post</span>
            </DialogTitle>
            <DialogDescription>
              {formatDate(post?.created_at)}
            </DialogDescription>
          </DialogHeader>

          <PostComments post={post} allMedia={allMedia} />
        </DialogContent>
      </Dialog>
    </div>
  );
}