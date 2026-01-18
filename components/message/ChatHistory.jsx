import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton component for loading state
function ChatCardSkeleton() {
  return (
    <Card className="mb-2">
      <CardContent>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-5 rounded-full ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Chat card component
function ChatCard({ chat, receiver }) {
  //   console.log(chat);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={`mb-2 cursor-pointer hover:bg-accent transition-colors ${chat?.user_id === receiver?.user_id && "border border-secondary"}`}
    >
      <CardContent>
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback className="capitalize bg-gradient-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
                {getInitials(chat.name)}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            {chat.is_online ? (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
            ) : (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-500 border-2 border-background"></span>
            )}
          </div>

          {/* Chat info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
              <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                {chat.time}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground truncate">
                {chat.is_file ? "📎 File" : chat.last_message}{" "}
                {/* {!chat.is_online && (
                  <span className="text-xs text-muted-foreground mt-1">
                    {chat.last_seen}
                  </span>
                )} */}
              </p>
              {chat.unread_count > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {chat.unread_count}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChatHistory({
  setReceiver,
  receiver,
  setShowChatPanel,
}) {
  const { accessToken } = useAppContext();

  // Fetch chat history
  const { data: chatHistory, isLoading: chatHistoryLoading } = useQuery({
    queryKey: ["/chat/inbox", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-gray-600">
          Chat with your friends and stay connected
        </p>
      </div>

      <div className="h-[calc(100dvh-192px)] overflow-y-auto">
        {chatHistoryLoading ? (
          // Show skeleton loaders
          <div>
            {[...Array(5)].map((_, index) => (
              <ChatCardSkeleton key={index} />
            ))}
          </div>
        ) : chatHistory?.data?.length > 0 ? (
          // Show chat cards
          <div>
            {chatHistory.data.map((chat) => (
              <button
                key={chat.user_id}
                onClick={() => {
                  setReceiver(chat);
                  setShowChatPanel(true);
                }}
                className="cursor-pointer w-full"
              >
                <ChatCard chat={chat} receiver={receiver} />
              </button>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-12">
            <p className="text-muted-foreground">No chat history found</p>
          </div>
        )}
      </div>
    </section>
  );
}
