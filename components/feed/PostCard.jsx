import {
  Edit,
  EllipsisVertical,
  MessageCircle,
  Trash2,
  Repeat,
  BarChart2,
  Share,
} from "lucide-react";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Flag } from "lucide-react";
import { Textarea } from "../ui/textarea";

import PostComments from "./PostComments";

import MediaSwiper from "./MediaSwiper";

import ReactionButton from "./ReactionButton";

import PostContent from "./PostContent";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppContext } from "@/context/context";

import { postWithToken } from "@/helpers/api";

import { toast } from "react-hot-toast";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function PostCard({ post }) {
  const queryClient = useQueryClient();

  const { accessToken, userInfo } = useAppContext();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const images = post?.post_files?.filter((file) => file.file_type === 1) || [];

  const videos = post?.post_files?.filter((file) => file.file_type === 2) || [];

  const allMedia = [...images, ...videos].sort((a, b) => a.id - b.id);

  // --- NEW: Ad Impression Tracking Logic ---

  const postRef = useRef(null);

  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    // 1. Only observe if it's a sponsored post and hasn't been tracked yet

    if (!post?.is_sponsored || !post?.campaign_id || hasTracked) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // 2. If the ad is at least 50% visible on the user's screen

        if (entry.isIntersecting) {
          fireSilentImpression(post.campaign_id);

          setHasTracked(true); // Mark as tracked

          observer.disconnect(); // Stop observing
        }
      },

      { threshold: 0.5 },
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => observer.disconnect();
  }, [hasTracked, post?.is_sponsored, post?.campaign_id]);

  const fireSilentImpression = (campaignId) => {
    // Using native fetch to utilize the keepalive flag.

    // Note: Replace the base URL if your environment variable differs

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "https://api.sosay.org/api/v1";

    fetch(`${API_BASE_URL}/ads/impressions`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Accept: "application/json",

        Authorization: `Bearer ${accessToken}`, // Pulled from your context
      },

      body: JSON.stringify({ campaign_id: campaignId }),

      keepalive: true, // Crucial for silent background completion
    }).catch(() => {
      // Fail silently for analytics
    });
  };

  // --- END NEW LOGIC ---

  // Delete post mutation

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const formData = new FormData();

      formData.append("_method", "DELETE");

      return await postWithToken(
        `/feed_management/private/posts/${postId}`,

        formData,

        accessToken,
      );
    },

    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Post deleted successfully");

        queryClient.invalidateQueries({
          queryKey: [`/feed_management/private/feeds/all/post/${userInfo.id}`],
        });

        queryClient.invalidateQueries({
          queryKey: ["/feed_management/public/feed/all/post"],
        });
      } else {
        toast.error(data.message || "Failed to delete post");
      }
    },

    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const handleDeletePost = (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(postId);
    }
  };

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

  const isOwner = userInfo?.id === post?.user?.id;

  const savePostMutation = useMutation({
    mutationFn: async (postId) => {
      return await postWithToken(
        `/feed_management/public/feed/${postId}/save`,
        new FormData(),
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(
          post?.is_saved ? "Post removed from saved" : "Post saved",
        );
        queryClient.invalidateQueries({
          queryKey: ["/feed_management/public/feed/all/post"],
        });
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/public/feed/saved/posts`, accessToken],
        });
      } else {
        toast.error(data.message || "Failed to save post");
      }
    },
    onError: () => {
      toast.error("Failed to save post");
    },
  });

  const handleSavePost = () => {
    savePostMutation.mutate(post.id);
  };

  const reportPostMutation = useMutation({
    mutationFn: async ({ postId, reason }) => {
      const formData = new FormData();
      formData.append("reason", reason);

      return await postWithToken(
        `/feed_management/public/feed/${postId}/report`,
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message || "Post reported successfully");
        setReportOpen(false);
        setReportReason("");
        queryClient.invalidateQueries({
          queryKey: ["/feed_management/public/feed/all/post"],
        });
      } else {
        toast.error(data.message || "Failed to report post");
      }
    },
    onError: () => {
      toast.error("Failed to report post");
    },
  });

  const handleReportPost = () => {
    if (!reportReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    reportPostMutation.mutate({ postId: post.id, reason: reportReason });
  };

  return (
    <div
      ref={postRef}
      className={`w-full bg-white border ${post?.is_sponsored ? "border-blue-300" : "border-gray-200"} rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Link href={`/app/profile/${post?.user?.id}`}>
          <Avatar className="h-9 w-9 sm:h-11 sm:w-11 cursor-pointer ring-2 ring-gray-100 hover:ring-secondary transition-all">
            <AvatarImage src={post?.user?.profile_picture} />
            <AvatarFallback className="bg-linear-to-br from-secondary to-purple-600 text-white text-sm font-semibold capitalize">
              {post?.user?.name?.[0]}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/app/profile/${post?.user?.id}`}>
            <p className="font-semibold text-sm sm:text-base text-gray-900 hover:text-secondary transition-colors cursor-pointer truncate">
              {post?.user?.name}
            </p>
          </Link>

          {/* Added Sponsored Badge Area */}
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">
              {formatDate(post?.created_at)}
            </p>

            {post?.is_sponsored === 1 && (
              <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 font-semibold px-1.5 py-0.5 rounded-sm">
                Sponsored
              </span>
            )}
          </div>
        </div>

        {isOwner && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Post actions"
              >
                <EllipsisVertical className="size-4 text-gray-600" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-1.5">
              <Link href={`/app/post/${post?.id}`}>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-left hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Edit className="size-4" />
                  <span>Edit post</span>
                </button>
              </Link>
              <button
                type="button"
                onClick={() => handleDeletePost(post.id)}
                disabled={deletePostMutation.isPending}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-left text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletePostMutation.isPending ? (
                  <div className="size-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                <span>Delete post</span>
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Post Content */}
      <PostContent description={post?.description} />

      {/* Media (Images & Videos) */}
      <MediaSwiper media={allMedia} postId={post.id} />

      {/* Actions */}
      <Dialog>
        <div className="flex justify-between items-center pt-2 sm:pt-3 mt-2 border-t border-gray-100">
          {/* Left Group */}
          <div className="flex items-center justify-between flex-1 max-w-[80%] sm:max-w-[70%]">
            {/* Comment button */}
            <DialogTrigger asChild>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer group">
                <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <MessageCircle className="w-4 h-4 sm:w-4 sm:h-4" />
                </div>
                <span className="text-xs">{post?.comments?.length || 0}</span>
              </button>
            </DialogTrigger>

            {/* Repost button */}
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-500 transition-colors group">
              <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <Repeat className="w-4 h-4 sm:w-4 sm:h-4" />
              </div>
              <span className="text-xs">0</span>
            </button>

            {/* Reaction button */}
            <ReactionButton post={post} />

            {/* Views/Analytics button */}
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors group">
              <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <BarChart2 className="w-4 h-4 sm:w-4 sm:h-4" />
              </div>
              <span className="text-xs">{post?.views_count || 0}</span>
            </button>
          </div>

          {/* Right Group */}
          <div className="flex items-center gap-1">
            {/* Save/Bookmark button */}
            <button
              onClick={handleSavePost}
              disabled={savePostMutation.isPending}
              className="flex items-center text-gray-500 hover:text-blue-500 transition-colors group disabled:opacity-50"
              title={post?.is_saved ? "Remove from saved" : "Save post"}
            >
              <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                {post?.is_saved ? (
                  <BookmarkCheck className="w-4 h-4 sm:w-4 sm:h-4 text-blue-500" />
                ) : (
                  <Bookmark className="w-4 h-4 sm:w-4 sm:h-4" />
                )}
              </div>
            </button>

            {/* Report button */}
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center text-gray-500 hover:text-red-500 transition-colors group"
              title="Report post"
            >
              <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <Flag className="w-4 h-4 sm:w-4 sm:h-4" />
              </div>
            </button>

            {/* Share button */}
            <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors group">
              <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <Share className="w-4 h-4 sm:w-4 sm:h-4" />
              </div>
            </button>
          </div>
        </div>
        <DialogContent className="sm:max-w-3xl max-h-[90dvh] w-[95vw] sm:w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarImage src={post?.user?.profile_picture} />
                <AvatarFallback className="capitalize bg-linear-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
                  {post?.user?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm sm:text-base truncate">
                {post?.user?.name}&apos;s Post
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {formatDate(post?.created_at)}
            </DialogDescription>
          </DialogHeader>
          <PostComments post={post} allMedia={allMedia} />
        </DialogContent>
      </Dialog>

      {/* Report Posts */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report post</DialogTitle>
            <DialogDescription>
              Let us know why you're reporting this post.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="e.g. This post is unauthorized"
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReportOpen(false)}
              className="px-3 py-1.5 text-sm rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReportPost}
              disabled={reportPostMutation.isPending}
              className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reportPostMutation.isPending ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
