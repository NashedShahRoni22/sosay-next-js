"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, UserCheck, X, Eye, Users } from "lucide-react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";

// Skeleton Loader Component
const UserCardSkeleton = () => (
  <div className="relative bg-white border rounded-lg p-6">
    <div className="flex flex-col items-center space-y-4">
      <Skeleton className="h-32 w-32 rounded-full" />
      <div className="w-full space-y-2">
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
      <div className="w-full space-y-2 pt-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

const UserCardSkeletonList = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <UserCardSkeleton key={i} />
    ))}
  </div>
);

// User Card Component
const UserCard = ({ user, type, onAction }) => {
  const getActionButtons = () => {
    switch (type) {
      case "suggested":
        return (
          <Button
            onClick={() => onAction(user.id, "send")}
            className="w-full gap-2 bg-blue-500 hover:bg-blue-600"
          >
            <UserPlus className="h-4 w-4" />
            Add Friend
          </Button>
        );
      case "requested":
        return (
          <>
            <Button
              onClick={() => onAction(user.id, "accept")}
              className="w-full gap-2 bg-green-500 hover:bg-green-600"
            >
              <UserCheck className="h-4 w-4" />
              Accept
            </Button>
            <Button
              onClick={() => onAction(user.id, "reject")}
              variant="outline"
              className="w-full gap-2 border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
          </>
        );
      case "sent":
        return (
          <Button
            onClick={() => onAction(user.id, "cancel")}
            variant="outline"
            className="w-full gap-2 border-gray-300 hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            Cancel Request
          </Button>
        );
      case "friends":
        return (
          <Button
            onClick={() => onAction(user.id, "view")}
            className="w-full gap-2 bg-purple-500 hover:bg-purple-600"
          >
            <Eye className="h-4 w-4" />
            View Profile
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center space-y-4 bg-white rounded-lg border p-6">
      {/* User Image */}
      <div className="relative">
        <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-white/50 shadow-lg">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=random&size=128`;
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-4xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* User Name */}
      <div className="text-center w-full">
        <h3 className="font-bold text-lg truncate text-gray-800 dark:text-white">
          {user.name}
        </h3>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 pt-2">{getActionButtons()}</div>
    </div>
  );
};

// Tab Content Component
const FriendsTabContent = ({ endpoint, type, title }) => {
  const { accessToken } = useAppContext();

  const { data, isLoading, error } = useQuery({
    queryKey: [endpoint, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const handleAction = (userId, action) => {
    console.log(`Action: ${action} for user: ${userId}`);
    // You'll add functionality here later
  };

  if (isLoading) return <UserCardSkeletonList />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">
          Failed to load {title.toLowerCase()}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const users = data?.data || [];

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No {title} Found
        </h3>
        <p className="text-gray-500">Check back later for updates!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          type={type}
          onAction={handleAction}
        />
      ))}
    </div>
  );
};

// Main Friends Page Component
export default function FriendsPage() {
  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Friends</h1>
        <p className="text-gray-600">
          Manage your connections and friend requests
        </p>
      </div>

      <Tabs defaultValue="suggested" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
          <TabsTrigger value="friends">My Friends</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="suggested">
          <FriendsTabContent
            endpoint="/friendship/suggest-friends"
            type="suggested"
            title="Suggested Friends"
          />
        </TabsContent>

        <TabsContent value="friends">
          <FriendsTabContent
            endpoint="/friendship/my-friends?status=2"
            type="friends"
            title="Friends"
          />
        </TabsContent>

        <TabsContent value="requests">
          <FriendsTabContent
            endpoint="/friendship/requested-friends"
            type="requested"
            title="Friend Requests"
          />
        </TabsContent>

        <TabsContent value="sent">
          <FriendsTabContent
            endpoint="/friendship/sent-friends-request"
            type="sent"
            title="Sent Requests"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
