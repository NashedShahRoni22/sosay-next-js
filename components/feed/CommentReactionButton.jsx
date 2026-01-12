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
  like: { icon: Heart, label: "Like", color: "text-red-500" },
  love: { icon: Heart, label: "Love", color: "text-pink-500" },
  haha: { icon: Laugh, label: "Haha", color: "text-yellow-500" },
  wow: { icon: Smile, label: "Wow", color: "text-blue-500" },
  sad: { icon: Frown, label: "Sad", color: "text-gray-500" },
  angry: { icon: Angry, label: "Angry", color: "text-orange-500" },
};

export default function CommentReactionButton({ comment }) {
  const { accessToken, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  const [showReactions, setShowReactions] = useState(false);

  const currentReaction = comment?.current_user_reaction;
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
        `/feed_management/private/comments/${comment.id}/react`,
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
    reactMutation.mutate(type);
  };

  const getTotalReactions = () => {
    return comment?.reactions_count || 0;
  };

  return (
    <div className="flex items-center gap-1">
      <Popover open={showReactions} onOpenChange={setShowReactions}>
        <PopoverTrigger asChild>
          <button
            className={`flex items-center gap-1 hover:scale-110 transition-all text-xs ${currentColor} ${
              currentReaction ? "font-semibold" : ""
            }`}
            onMouseEnter={() => setShowReactions(true)}
          >
            <CurrentIcon
              size={14}
              className={currentReaction ? "fill-current" : ""}
            />
            <span>
              {currentReaction ? REACTIONS[currentReaction]?.label : "Like"}
            </span>
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
                className={`p-1.5 rounded-full hover:scale-125 transition-transform ${color} hover:bg-gray-100`}
                disabled={reactMutation.isPending}
              >
                <Icon
                  size={20}
                  className={currentReaction === key ? "fill-current" : ""}
                />
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {getTotalReactions() > 0 && (
        <span className="text-xs text-gray-500">({getTotalReactions()})</span>
      )}
    </div>
  );
}