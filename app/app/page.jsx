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
  if (isLoading) return <div className="p-4"><PostCardSkeletonList /></div> ;
  if (error)
    return (
      <p className="text-red-400 text-center mt-10">Failed to load feed</p>
    );

  const posts = data?.data || [];

  return (
    <main className="max-w-2xl mx-auto space-y-4 mt-14 md:mt-8 p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feed</h1>
        <p className="text-gray-600">
          Latest insights and updates from your connections.
        </p>
      </div>

      <div>
        {posts.map((post, i) => (
          <PostCard key={i} post={post} />
        ))}
      </div>
    </main>
  );
}
