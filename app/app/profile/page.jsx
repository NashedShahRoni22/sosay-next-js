"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken, putWithToken } from "@/helpers/api";
import toast from "react-hot-toast";
import {
  Camera,
  Share2,
  LayoutGrid,
  ImageIcon,
  Coffee,
  PlaySquare,
  Clapperboard,
  ShoppingBag,
  Users,
  Star,
  Rss,
  LogOut,
  CheckCircle,
} from "lucide-react";
import ProfilePost from "@/components/profile/ProfilePost";
import ProfilePictureDialog from "@/components/profile/ProfilePictureDialog";
import CoverPictureDialog from "@/components/profile/CoverPictureDialog";
import Image from "next/image";
import defaultCover from "../../assets/designs/Welcome.png";
import defaultProfile from "../../assets/designs/girl.png";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MyReelsTab from "@/components/reels/MyReelsTab";
import MyContentTab from "@/components/contents/MyContentTab";
import UserShop from "@/components/shop/UserShop";
import ProfilePhotos from "@/components/profile/ProfilePhotos";
import ProfileLifestyle from "@/components/profile/ProfileLifestyle";
import MyCreatorsTab from "@/components/creators/MyCreatorsTab";
import MyFans from "@/components/contents/MyFans";
import ContentDashboard from "@/components/creators/ContentDashboard";
import UploadContentDialog from "@/components/contents/UploadContentDialog";
import UploadReelDialog from "@/components/reels/UploadReelDialog";
import ContentDetails from "@/components/contents/ContentDetails";
import ReelsViewer from "@/components/reels/ReelsViewer";
import UserProfileFollowers from "@/components/profile/UserProfileFollowers";
import UserProfileFollowing from "@/components/profile/UserProfileFollowing";

export default function ProfilePage() {
  const { userInfo, setUserInfo, accessToken, isUserVerified, logout } =
    useAppContext();

  const queryClient = useQueryClient();
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openCoverDialog, setOpenCoverDialog] = useState(false);
  const [profilePreview, setProfilePreview] = useState(
    userInfo?.user_image || defaultProfile,
  );
  const [coverPreview, setCoverPreview] = useState(
    userInfo?.user_cover_image || defaultCover,
  );
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);

  const [activeTab, setActiveTab] = useState("Posts");
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openUploadReelDialog, setOpenUploadReelDialog] = useState(false);

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

  // Tabs button here
  const Tabs = [
    { name: "Posts", icon: Rss, Component: ProfilePost },
    { name: "Dashboard", icon: LayoutGrid, Component: ContentDashboard },
    { name: "Photos", icon: ImageIcon, Component: ProfilePhotos },
    { name: "Lifestyle", icon: Coffee, Component: ProfileLifestyle },
    { name: "Reels", icon: PlaySquare, Component: MyContentTab },
    { name: "Shorts", icon: Clapperboard, Component: MyReelsTab },
    { name: "Listings", icon: ShoppingBag, Component: UserShop },
    { name: "Fans", icon: Users, Component: MyFans },
    { name: "Other Creators", icon: Star, Component: MyCreatorsTab },
    { name: "Followers", icon: Users, Component: UserProfileFollowers },
    { name: "Following", icon: Users, Component: UserProfileFollowing },
  ];

  // Fetch profile pictures
  const { data: profilePictures, isLoading: profilePicturesLoading } = useQuery(
    {
      queryKey: ["/user/profile/profilepicture", accessToken],
      queryFn: fetchWithToken,
      enabled: !!accessToken,
    },
  );

  // Fetch profile stats
  const { data: profileStats, isLoading: profileStatsLoading } = useQuery({
    queryKey: [`users/${userInfo.id}/stats`, accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const statsData = profileStats?.data;

  // Fetch cover pictures
  const { data: coverPictures, isLoading: coverPicturesLoading } = useQuery({
    queryKey: ["/user/profile/coverpicture", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  // Add new profile picture mutation
  const addProfilePictureMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken(
        "/user/profile/profilepicture",
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        const updatedUserInfo = {
          ...userInfo,
          user_image: data.data.picture_name,
        };
        setUserInfo(updatedUserInfo);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
        }
        setOpenProfileDialog(false);
        setNewProfileImage(null);
        queryClient.invalidateQueries(["/user/profile/profilepicture"]);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to upload profile picture");
    },
  });

  // Update profile picture mutation
  const updateProfilePictureMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      return await putWithToken(
        `/user/profile/profilepicture/${id}`,
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        const updatedUserInfo = {
          ...userInfo,
          user_image: data.data.picture_name,
        };
        setUserInfo(updatedUserInfo);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
        }
        setOpenProfileDialog(false);
        queryClient.invalidateQueries(["/user/profile/profilepicture"]);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update profile picture");
    },
  });

  // Add new cover picture mutation
  const addCoverPictureMutation = useMutation({
    mutationFn: async (formData) => {
      return await postWithToken(
        "/user/profile/coverpicture",
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        const updatedUserInfo = {
          ...userInfo,
          user_cover_image: data.data.cover_picture_name,
        };
        setUserInfo(updatedUserInfo);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
        }
        setOpenCoverDialog(false);
        setNewCoverImage(null);
        queryClient.invalidateQueries(["/user/profile/coverpicture"]);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to upload cover picture");
    },
  });

  // Update cover picture mutation
  const updateCoverPictureMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      return await putWithToken(
        `/user/profile/coverpicture/${id}`,
        formData,
        accessToken,
      );
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        const updatedUserInfo = {
          ...userInfo,
          user_cover_image: data.data.cover_picture_name,
        };
        setUserInfo(updatedUserInfo);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
        }
        setOpenCoverDialog(false);
        queryClient.invalidateQueries(["/user/profile/coverpicture"]);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update cover picture");
    },
  });

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      setNewProfileImage(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setNewCoverImage(file);
    }
  };

  const handleAddProfilePicture = () => {
    if (!newProfileImage) return;

    const formData = new FormData();
    formData.append("picture_name", newProfileImage);
    formData.append("status", "0");
    formData.append("user_id", userInfo.id);

    addProfilePictureMutation.mutate(formData);
  };

  const handleUpdateProfilePicture = (id) => {
    const formData = new FormData();
    formData.append("profilepicture", id);

    updateProfilePictureMutation.mutate({ id, formData });
  };

  const handleAddCoverPicture = () => {
    if (!newCoverImage) return;

    const formData = new FormData();
    formData.append("cover_picture_name", newCoverImage);
    formData.append("status", "0");
    formData.append("user_id", userInfo.id);

    addCoverPictureMutation.mutate(formData);
  };

  const handleUpdateCoverPicture = (id) => {
    const formData = new FormData();
    formData.append("coverpicture", id);

    updateCoverPictureMutation.mutate({ id, formData });
  };

  const handleOpenProfileDialog = () => {
    setOpenProfileDialog(!openProfileDialog);
    setProfilePreview(userInfo.user_image);
    setNewProfileImage(null);
  };

  const handleOpenCoverDialog = () => {
    setOpenCoverDialog(!openCoverDialog);
    setCoverPreview(userInfo?.user_cover_image || defaultCover);
    setNewCoverImage(null);
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/app/profile/${userInfo.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userInfo.name}'s Profile`,
          url: profileUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          navigator.clipboard.writeText(profileUrl);
          toast.success("Profile link copied to clipboard!");
        }
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const isLoading =
    addProfilePictureMutation.isPending ||
    updateProfilePictureMutation.isPending ||
    addCoverPictureMutation.isPending ||
    updateCoverPictureMutation.isPending;

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
    <section className="max-w-3xl mx-auto space-y-6 px-4 mt-14 md:mt-0">
      {/* Cover Picture */}
      <div className="relative group">
        <div className="relative w-full h-[180px] sm:h-[240px] md:h-[320px] overflow-hidden rounded-b-2xl">
          <Image
            src={userInfo?.user_cover_image || defaultCover}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            alt="Cover Image"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
        <button
          onClick={handleOpenCoverDialog}
          className="absolute bottom-3 right-3 md:bottom-5 md:right-5 flex items-center gap-1.5 p-2.5 md:p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-105 active:scale-95 transition-all"
        >
          <Camera className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>
      </div>

      {/* Profile Picture and Info */}
      <div className="relative z-10 px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
          {/* Profile Picture (Pulled Up) */}
          <div className="relative -mt-18 sm:-mt-22 md:-mt-0 shrink-0">
            <div className="rounded-full ring-4 ring-white dark:ring-gray-950 shadow-lg overflow-hidden size-28 sm:size-32 md:size-40 bg-gray-100 dark:bg-gray-800">
              <Image
                src={userInfo?.user_image}
                alt="Profile Image"
                className="w-full h-full object-cover"
                height={500}
                width={500}
              />
            </div>
            <button
              onClick={handleOpenProfileDialog}
              className="absolute bottom-0.5 right-0.5 bg-white dark:bg-gray-900 p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left flex-1 w-full pb-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col items-center md:items-start gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight dark:text-white">
                    {userInfo?.name}
                  </h1>
                  <div className="flex justify-center">
                    {isUserVerified ? (
                      <Link
                        href="/app/verified-infromations"
                        className="w-fit inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Verified
                      </Link>
                    ) : (
                      <Link
                        href="/app/verify"
                        className="w-fit inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-gray-700 ring-1 ring-red-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Unverified
                      </Link>
                    )}
                  </div>
                </div>

                {/* counts */}
                <div className="flex items-center justify-center md:justify-start gap-5 sm:gap-8 text-sm text-gray-600 dark:text-gray-400">
                  {[
                    { label: "Posts", value: statsData?.posts_count },
                    { label: "Friends", value: statsData?.friends_count },
                    { label: "Followers", value: statsData?.followers_count },
                    {
                      label: "Subscribers",
                      value: statsData?.subscribers_count,
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
                <button
                  onClick={handleShareProfile}
                  className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-colors whitespace-nowrap"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full text-sm font-medium ring-1 ring-red-100 dark:ring-red-900 transition-colors whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" />
                </button>
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
                  layoutId="profile-active-tab"
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
      <div className="mt-6 min-h-[400px] pb-6">
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
                  accessToken={accessToken}
                  userInfo={userInfo}
                  onContentClick={setActiveContentId}
                  onUploadClick={() => {
                    if (activeTab === "Shorts") {
                      setOpenUploadReelDialog(true);
                    } else {
                      setOpenUploadDialog(true);
                    }
                  }}
                  onReelClick={openReelViewer}
                />
              ) : null;
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Profile Picture Dialog */}
      <ProfilePictureDialog
        open={openProfileDialog}
        onOpenChange={setOpenProfileDialog}
        profilePreview={profilePreview}
        profilePictures={profilePictures}
        profilePicturesLoading={profilePicturesLoading}
        isLoading={isLoading}
        newProfileImage={newProfileImage}
        onImageChange={handleProfileImageChange}
        onAddProfilePicture={handleAddProfilePicture}
        onUpdateProfilePicture={handleUpdateProfilePicture}
      />

      {/* Cover Picture Dialog */}
      <CoverPictureDialog
        open={openCoverDialog}
        onOpenChange={setOpenCoverDialog}
        coverPreview={coverPreview}
        coverPictures={coverPictures}
        coverPicturesLoading={coverPicturesLoading}
        isLoading={isLoading}
        newCoverImage={newCoverImage}
        onImageChange={handleCoverImageChange}
        onAddCoverPicture={handleAddCoverPicture}
        onUpdateCoverPicture={handleUpdateCoverPicture}
      />

      {/* Upload Dialogs */}
      <UploadContentDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
        accessToken={accessToken}
        onUploadSuccess={() => queryClient.invalidateQueries(["/contents/me"])}
      />
      <UploadReelDialog
        open={openUploadReelDialog}
        onOpenChange={setOpenUploadReelDialog}
        accessToken={accessToken}
        onUploadSuccess={() => queryClient.invalidateQueries(["/reels"])}
      />

      <ReelsViewer
        open={openViewer}
        reels={viewerReels}
        initialIndex={viewerIndex}
        onClose={() => setOpenViewer(false)}
      />
    </section>
  );
}
