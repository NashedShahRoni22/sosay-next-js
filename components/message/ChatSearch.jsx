import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

export default function ChatSearch({ isSearching, setIsSearching, setReceiver }) {
  const { accessToken } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  // Get friends list with search query
  const { data: friendsData, isLoading } = useQuery({
    queryKey: ["/chat/friends/list", accessToken, searchQuery],
    queryFn: ({ queryKey }) => {
      const [endpoint, token, search] = queryKey;
      const url = search ? `${endpoint}?search=${encodeURIComponent(search)}` : endpoint;
      return fetchWithToken({ queryKey: [url, token] });
    },
    enabled: !!accessToken && isSearching,
  });
  const friends = friendsData?.data || [];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading skeleton component
  const FriendListSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <Card key={index} className="mb-2">
          <CardContent>
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearching(true)}
          placeholder="Search chats..."
          className="w-full p-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <div className="absolute left-3 top-3 text-gray-500">
          <Search />
        </div>
      </div>

      {/* my friends list here */}
      {isSearching && (
        <div className="h-[calc(90dvh-192px)] overflow-y-auto mt-8">
          {isLoading ? (
            <FriendListSkeleton />
          ) : friends.length > 0 ? (
            friends.map((friend, index) => (
              <Card
                key={index}
                className="mb-2 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => {
                  setReceiver(friend);
                  setIsSearching(false);
                  setSearchQuery("");
                }}
              >
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback className="capitalize bg-gradient-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
                        {getInitials(friend.name)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-gray-700">{friend.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>No friends found</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}