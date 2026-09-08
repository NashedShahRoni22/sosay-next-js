import { useAppContext } from "@/context/context";
import { postWithToken } from "@/helpers/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ReactionButton({ post, showLabel = false }) {
  const { accessToken, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  const [optimisticReaction, setOptimisticReaction] = useState(
    post?.current_user_reaction === 'like' ? 'like' : null,
  );
  const [optimisticCount, setOptimisticCount] = useState(
    post?.reactions_count || 0,
  );

  const isLiked = optimisticReaction === 'like';

  // React mutation
  const reactMutation = useMutation({
    mutationFn: async ({ type }) => {
      const formData = new FormData();
      formData.append("type", type);

      return await postWithToken(
        `/feed_management/private/posts/${post.id}/react`,
        formData,
        accessToken,
      );
    },
    onMutate: ({ nextReaction, nextCount }) => {
      setOptimisticReaction(nextReaction);
      setOptimisticCount(nextCount);
    },
    onSuccess: (data) => {
      if (data.status === true) {
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/private/feeds/all/post/${userInfo.id}`],
        });
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/public/feed/all/post`],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: (_error, variables) => {
      setOptimisticReaction(variables.prevReaction);
      setOptimisticCount(variables.prevCount);
      toast.error("Failed to react");
    },
  });

  const handleReaction = () => {
    const prevReaction = optimisticReaction;
    const prevCount = optimisticCount;

    const nextReaction = prevReaction === 'like' ? null : 'like';
    const nextCount =
      prevReaction === null
        ? prevCount + 1
        : nextReaction === null
          ? Math.max(0, prevCount - 1)
          : prevCount;

    reactMutation.mutate({
      type: 'like',
      prevReaction,
      prevCount,
      nextReaction,
      nextCount,
    });
  };

  return (
    <button
      className={`flex items-center gap-1.5 cursor-pointer hover:text-pink-600 transition-colors group ${
        isLiked ? "text-pink-600" : "text-gray-500"
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleReaction();
      }}
      disabled={reactMutation.isPending}
    >
      <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-pink-50 transition-colors">
        <Heart
          size={16}
          className={`sm:w-4 sm:h-4 ${isLiked ? "fill-current" : ""}`}
        />
      </div>
      <span className="text-xs">{optimisticCount || 0}</span>
    </button>
  );
}
