// FeedPage.jsx
"use client";
import { useQuery } from "@tanstack/react-query";
import PostCard from "@/components/feed/PostCard";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import PostCardSkeletonList from "@/components/feed/PostCardSkletonList";

export default function FeedPage() {
  const { accessToken } = useAppContext();

  // Get feed posts
  const { data, isLoading, error } = useQuery({
    queryKey: ["/feed_management/public/feed/all/post", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });
  if (isLoading) return <PostCardSkeletonList/>;
  if (error)
    return (
      <p className="text-red-400 text-center mt-10">Failed to load feed</p>
    );

  const posts = data?.data || [];

  return (
    <main className="max-w-2xl mx-auto space-y-4">
      {posts.map((post, i) => (
        <PostCard key={i} post={post} />
      ))}
    </main>
  );
}
