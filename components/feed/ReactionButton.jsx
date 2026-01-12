import { useAppContext } from "@/context/context";
import { postWithToken } from "@/helpers/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Smile, Laugh, Frown, ThumbsUp, Angry } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const REACTIONS = {
  like: { icon: ThumbsUp, label: "Like", color: "text-blue-500" },
  love: { icon: Heart, label: "Love", color: "text-pink-500" },
  haha: { icon: Laugh, label: "Haha", color: "text-yellow-500" },
  wow: { icon: Smile, label: "Wow", color: "text-blue-500" },
  sad: { icon: Frown, label: "Sad", color: "text-gray-500" },
  angry: { icon: Angry, label: "Angry", color: "text-red-500" },
};

export default function ReactionButton({ post, showLabel = true }) {
  const { accessToken, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  const [showReactions, setShowReactions] = useState(false);

  const currentReaction = post?.current_user_reaction;
  const CurrentIcon = currentReaction
    ? REACTIONS[currentReaction]?.icon
    : Heart;
  const currentColor = currentReaction
    ? REACTIONS[currentReaction]?.color
    : "text-gray-600";

  // React mutation
  const reactMutation = useMutation({
    mutationFn: async (type) => {
      const formData = new FormData();
      formData.append("type", type);

      return await postWithToken(
        `/feed_management/private/posts/${post.id}/react`,
        formData,
        accessToken
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/private/feeds/all/post/${userInfo.id}`],
        });
        queryClient.invalidateQueries({
          queryKey: [`/feed_management/public/feed/all/post`],
        });
        setShowReactions(false);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to react");
    },
  });

  const handleReaction = (type) => {
    // If clicking same reaction, remove it
    if (currentReaction === type) {
      reactMutation.mutate(type);
    } else {
      reactMutation.mutate(type);
    }
  };

  const getTotalReactions = () => {
    return post?.reactions_count || 0;
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={showReactions} onOpenChange={setShowReactions}>
        <PopoverTrigger asChild>
          <button
            className={`flex items-center gap-2 hover:scale-110 transition-all ${currentColor} ${
              currentReaction ? "font-semibold" : ""
            }`}
            onMouseEnter={() => setShowReactions(true)}
          >
            <CurrentIcon
              size={20}
              className={currentReaction ? "fill-current" : ""}
            />
            {showLabel && (
              <span className="text-sm hidden md:block">
                {currentReaction
                  ? REACTIONS[currentReaction]?.label
                  : "Like"}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-2 bg-white shadow-lg border border-gray-200"
          onMouseLeave={() => setShowReactions(false)}
        >
          <div className="flex gap-2">
            {Object.entries(REACTIONS).map(([key, { icon: Icon, color }]) => (
              <button
                key={key}
                onClick={() => handleReaction(key)}
                className={`p-2 rounded-full hover:scale-125 transition-transform ${color} hover:bg-gray-100`}
                disabled={reactMutation.isPending}
              >
                <Icon
                  size={24}
                  className={currentReaction === key ? "fill-current" : ""}
                />
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {getTotalReactions() > 0 && (
        <span className="text-xs text-gray-500 ml-1">
          {getTotalReactions()}
        </span>
      )}
    </div>
  );
}