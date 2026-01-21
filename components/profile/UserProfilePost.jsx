import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import PostCardSkeletonList from "../feed/PostCardSkletonList";
import PostCard from "../feed/PostCard";

export default function UserProfilePost({ id }) {
  const { accessToken, userInfo } = useAppContext();
  // Fetch personal posts
  const { data, isLoading, error } = useQuery({
    queryKey: [
      `/feed_management/private/feeds/all/post/${id}`,
      accessToken,
    ],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });
  if (isLoading) return <PostCardSkeletonList />;
  if (error)
    return (
      <p className="text-red-400 text-center mt-10">Failed to load feed</p>
    );

  const posts = data?.data || [];

  return (
    <div>
      {posts.map((post, i) => (
        <PostCard key={i} post={post} />
      ))}
    </div>
  );
}
