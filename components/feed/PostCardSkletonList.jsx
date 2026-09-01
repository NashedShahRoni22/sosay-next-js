import PostCardSkleton from "./PostCardSkleton";

export default function PostCardSkeletonList() {
  return (
    <main className="max-w-3xl mx-auto space-y-4 mt-14">
      {[...Array(5)].map((_, i) => (
        <PostCardSkleton key={i} isSkeleton />
      ))}
    </main>
  );
}
