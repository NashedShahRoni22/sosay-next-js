"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import toast from "react-hot-toast";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  X,
  Loader2,
  UserRoundX,
  UserRoundPlus,
  UserCheck,
  UserMinus,
  ImageIcon,
  Coffee,
  PlaySquare,
  Clapperboard,
  ShoppingBag,
  Rss,
  Users,
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Chatpanel from "@/components/message/Chatpanel";
import UserProfilePost from "@/components/profile/UserProfilePost";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import UserProfileReels from "@/components/profile/UserProfileReels";
import UserProfileContents from "@/components/profile/UserProfileContents";
import UserProfileProducts from "@/components/profile/UserProfileProducts";
import UserProfilePhotos from "@/components/profile/UserProfilePhotos";
import UserProfileLifestyle from "@/components/profile/UserProfileLifestyle";
import UserProfileFollowers from "@/components/profile/UserProfileFollowers";
import UserProfileFollowing from "@/components/profile/UserProfileFollowing";
import ContentDetails from "@/components/contents/ContentDetails";
import ReelsViewer from "@/components/reels/ReelsViewer";
import ContentPaymentModal from "@/components/contents/ContentPaymentModal";

export default function ProfilePage() {
  const { id } = useParams();
  const { accessToken } = useAppContext();
  const queryClient = useQueryClient();
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("Posts");

  const [activeContentId, setActiveContentId] = useState(null);
  const [openViewer, setOpenViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerReels, setViewerReels] = useState([]);

  const openReelViewer = (list, index) => {
    setViewerReels(list);
    setViewerIndex(index);
    setOpenViewer(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const Tabs = [
    { name: "Posts", icon: Rss, Component: UserProfilePost },
    { name: "Photos", icon: ImageIcon, Component: UserProfilePhotos },
    { name: "Lifestyle", icon: Coffee, Component: UserProfileLifestyle },
    { name: "Reels", icon: PlaySquare, Component: UserProfileContents },
    { name: "Shorts", icon: Clapperboard, Component: UserProfileReels },
    { name: "Listings", icon: ShoppingBag, Component: UserProfileProducts },
    { name: "Followers", icon: Users, Component: UserProfileFollowers },
    { name: "Following", icon: Users, Component: UserProfileFollowing },
  ];

  // Fetch profile data
  const { data: profile, isLoading: profileDataLoading } = useQuery({
    queryKey: [`/personal-information/${id}`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  // Fetch creator profile
  const { data: creatorData } = useQuery({
    queryKey: ["/contents/creators", id],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/contents/creators/${id}`, accessToken],
      }),
    enabled: !!id,
  });

  const creatorProfile = creatorData?.data?.creator_profile;
  const isSubscribed = creatorData?.data?.is_subscribed;

  // Add Friend
  const addFriendMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken("/friendship/friends", formData, accessToken);
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/personal-information/${id}`, accessToken],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to send friend request");
    },
  });

  // Unfriend
  const unfriendMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken(
        "/friendship/friends/unfriend",
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/personal-information/${id}`, accessToken],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to unfriend");
    },
  });

  // Follow
  const followMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken("/friendship/follow", formData, accessToken);
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/personal-information/${id}`, accessToken],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to follow");
    },
  });

  // Unfollow
  const unfollowMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken("/friendship/unfollow", formData, accessToken);
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/personal-information/${id}`, accessToken],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to unfollow");
    },
  });

  // Cancel Friend Request
  const cancelFriendRequestMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken(
        "/friendship/sent-friends-request/cancel",
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status === true) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: [`/personal-information/${id}`, accessToken],
        });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to cancel friend request");
    },
  });

  const profileData = profile?.data;

  const lightboxSlides = [
    ...(profileData?.profile_cover_picture
      ? [{ src: profileData.profile_cover_picture, alt: "Cover Image" }]
      : []),
    ...(profileData?.profile_picture
      ? [{ src: profileData.profile_picture, alt: "Profile Image" }]
      : []),
  ];

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleAddFriend = () => {
    const formData = new FormData();
    formData.append("friend_id", id);
    addFriendMutation.mutate(formData);
  };

  const handleUnfriend = () => {
    const formData = new FormData();
    formData.append("friend_id", id);
    unfriendMutation.mutate(formData);
  };

  const handleCancelFriendRequest = () => {
    const formData = new FormData();
    formData.append("friend_id", id);
    cancelFriendRequestMutation.mutate(formData);
  };

  const handleFollow = () => {
    const formData = new FormData();
    formData.append("followee_id", id);
    followMutation.mutate(formData);
  };

  const handleUnfollow = () => {
    const formData = new FormData();
    formData.append("followee_id", id);
    unfollowMutation.mutate(formData);
  };

  if (activeContentId) {
    return (
      <section className="max-w-5xl mx-auto space-y-4 mt-14 md:mt-8 p-4">
        <ContentDetails
          contentId={activeContentId}
          onBack={() => setActiveContentId(null)}
          onContentClick={setActiveContentId}
          accessToken={accessToken}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto mt-14 max-w-3xl space-y-6 px-4 md:mt-0">
      {/* Cover Picture */}
      <div className="relative">
        {profileDataLoading ? (
          <div className="w-full h-[200px] md:h-[300px] rounded-b-xl bg-accent animate-pulse" />
        ) : profileData?.profile_cover_picture ? (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="block w-full cursor-pointer"
          >
            <Image
              src={profileData.profile_cover_picture}
              className="w-full h-[200px] md:h-[300px] rounded-b-xl object-cover object-top"
              alt="Cover Image"
              height={1000}
              width={1000}
            />
          </button>
        ) : (
          <div className="w-full h-[200px] md:h-[300px] rounded-b-xl bg-muted flex items-center justify-center text-sm md:text-base font-medium text-muted-foreground">
            No Cover Picture added
          </div>
        )}
      </div>

      {/* Profile Picture and Info */}
      <div className="relative z-10 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
          {/* Profile Picture (Pulled Up) */}
          <div className="relative -mt-18 sm:-mt-22 md:-mt-0 shrink-0">
            {profileDataLoading ? (
              <div className="rounded-full ring-4 ring-white dark:ring-gray-950 shadow-lg size-28 sm:size-32 md:size-40 bg-accent animate-pulse" />
            ) : (
              <div
                className="rounded-full ring-4 ring-white dark:ring-gray-950 shadow-lg overflow-hidden size-28 sm:size-32 md:size-40 bg-gray-100 dark:bg-gray-800 cursor-pointer"
                onClick={() =>
                  openLightbox(profileData?.profile_cover_picture ? 1 : 0)
                }
              >
                <Image
                  src={profileData?.profile_picture}
                  alt="Profile Image"
                  className="w-full h-full object-cover"
                  height={500}
                  width={500}
                />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-center md:text-left flex-1 w-full pb-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col items-center md:items-start gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight dark:text-white">
                    {profileDataLoading ? (
                      <span className="inline-block h-7 w-44 rounded bg-accent animate-pulse" />
                    ) : (
                      profileData?.name
                    )}
                  </h1>
                </div>

                {/* counts */}
                <div className="flex items-center justify-center md:justify-start gap-5 sm:gap-8 text-sm text-gray-600 dark:text-gray-400">
                  {[
                    { label: "Posts", value: profileData?.posts_count },
                    { label: "Friends", value: profileData?.friends_count },
                    { label: "Followers", value: profileData?.followers_count },
                    {
                      label: "Subscribers",
                      value: profileData?.subscribers_count,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center md:items-start"
                    >
                      <span className="font-bold text-gray-900 dark:text-white text-base md:text-lg leading-none">
                        {value || 0}
                      </span>
                      <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <TooltipProvider delayDuration={100}>
                  {!profileData?.friends?.is_self && (
                    <>
                      {/* Friend / Unfriend / Cancel */}
                      {profileData?.friends?.is_friend ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleUnfriend}
                              disabled={unfriendMutation.isPending}
                            >
                              {unfriendMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserRoundX className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Unfriend</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : profileData?.friends?.is_request_sent ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleCancelFriendRequest}
                              disabled={cancelFriendRequestMutation.isPending}
                            >
                              {cancelFriendRequestMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancel Request</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleAddFriend}
                              disabled={addFriendMutation.isPending}
                            >
                              {addFriendMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserRoundPlus className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add Friend</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {/* Follow / Unfollow */}
                      {profileData?.friends?.is_following ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleUnfollow}
                              disabled={unfollowMutation.isPending}
                            >
                              {unfollowMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserMinus className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Unfollow</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleFollow}
                              disabled={followMutation.isPending}
                            >
                              {followMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Follow</p>
                          </TooltipContent>
                        </Tooltip>
                      )}

                      {/* Send Message */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            onClick={() => {
                              setOpenChatDialog(true);
                              setReceiver(profileData);
                            }}
                            className="bg-secondary hover:bg-secondary/90"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send Message</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </TooltipProvider>

                {/* Subscribe */}
                {creatorProfile && (
                  <Button
                    variant={isSubscribed ? "outline" : "default"}
                    className={
                      !isSubscribed
                        ? "bg-secondary text-white hover:bg-secondary/95 w-full sm:w-auto"
                        : "w-full sm:w-auto"
                    }
                    onClick={() => {
                      if (!isSubscribed) {
                        setPaymentModalOpen(true);
                      }
                    }}
                  >
                    {isSubscribed
                      ? "Subscribed"
                      : `Subscribe for $${creatorProfile.subscription_price}`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs button here */}
      <div className="flex flex-wrap gap-2 items-center mt-6 p-1 bg-gray-50/50">
        {Tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-lg z-10 ${
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="profile-id-active-tab"
                  className="absolute inset-0 bg-white shadow-sm rounded-lg border border-gray-200/60 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {tab.icon && <tab.icon className="w-4 h-4" />}
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tabs content here */}
      <div className="mt-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {(() => {
              const ActiveComponent = Tabs.find(
                (tab) => tab.name === activeTab,
              )?.Component;
              return ActiveComponent ? (
                <ActiveComponent
                  id={id}
                  onReelClick={openReelViewer}
                  onContentClick={setActiveContentId}
                />
              ) : null;
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chat Panel Dialog */}
      <Dialog open={openChatDialog} onOpenChange={setOpenChatDialog}>
        <DialogContent className="h-dvh w-screen max-w-none rounded-none border-0 p-0 sm:h-[92dvh] sm:w-[96vw] sm:rounded-xl sm:border sm:max-w-4xl">
          <DialogTitle className="sr-only">Chat</DialogTitle>
          <div className="h-full overflow-hidden">
            <Chatpanel
              receiver={receiver}
              setShowChatPanel={setOpenChatDialog}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
      />
      <ReelsViewer
        open={openViewer}
        reels={viewerReels}
        initialIndex={viewerIndex}
        onClose={() => setOpenViewer(false)}
      />

      <ContentPaymentModal
        creatorId={id}
        accessToken={accessToken}
        open={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          queryClient.invalidateQueries({
            queryKey: [`/contents/creators/${id}`, accessToken],
          });
          queryClient.invalidateQueries({
            queryKey: [`/personal-information/${id}`, accessToken],
          });
        }}
      />
    </section>
  );
}
