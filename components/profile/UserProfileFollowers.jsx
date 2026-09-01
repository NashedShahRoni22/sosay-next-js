import React from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function UserProfileFollowers({ id, userInfo }) {
  const { accessToken } = useAppContext();
  const targetId = id || userInfo?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: [`/friendship/followers?user_id=${targetId}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken && !!targetId,
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
      <p className="text-red-400 text-center mt-10">Failed to load followers</p>
    );
  }

  const followers = data?.data || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {followers.length === 0 ? (
        <div className="col-span-full text-center mt-10 h-60 bg-gray-100 flex justify-center items-center rounded-xl">
          No followers yet
        </div>
      ) : (
        followers.map((user) => (
          <Link href={`/app/profile/${user.user_id}`} key={user.user_id}>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <Image
                src={user.avatar || "/placeholder.png"}
                alt={user.name}
                width={50}
                height={50}
                className="rounded-full object-cover h-12 w-12 border"
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 line-clamp-1">
                  {user.name}
                </span>
                {user.followed_at && (
                  <span className="text-xs text-gray-500">
                    Followed: {new Date(user.followed_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
