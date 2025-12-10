import PostCardSkleton from "./PostCardSkleton";

export default function PostCardSkeletonList() {
  return (
    <main className="max-w-2xl mx-auto space-y-4">
      {[...Array(5)].map((_, i) => (
        <PostCardSkleton key={i} isSkeleton />
      ))}
    </main>
  );
}
