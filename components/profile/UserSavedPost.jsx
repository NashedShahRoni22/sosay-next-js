import React from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import PostCard from "../feed/PostCard";

export default function UserSavedPost() {
  const { accessToken } = useAppContext();

  const { data, isLoading, error } = useQuery({
    queryKey: [`/feed_management/public/feed/saved/posts`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-400 text-center mt-10">Failed to load posts</p>
    );
  }

  const posts = data?.data || [];

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {posts.length === 0 ? (
        <div className="col-span-full text-center mt-10 h-60 bg-gray-100 flex justify-center items-center rounded-xl">
          Not posts saved yet
        </div>
      ) : (
        posts.map((post, i) => <PostCard key={i} post={post} />)
      )}
    </div>
  );
}
