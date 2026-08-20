"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Film,
  Clapperboard,
  Camera,
  Coffee,
  Star,
  Users,
  LayoutGrid,
} from "lucide-react";
import { useAppContext } from "@/context/context";
import MyContentTab from "@/components/contents/MyContentTab";
import MyCreatorsTab from "@/components/creators/MyCreatorsTab";
import UploadContentDialog from "@/components/contents/UploadContentDialog";
import ContentDetails from "@/components/contents/ContentDetails";
import MyReelsTab from "@/components/reels/MyReelsTab";
import UploadReelDialog from "@/components/reels/UploadReelDialog";
import ProfilePhotos from "@/components/profile/ProfilePhotos";
import ProfileLifestyle from "@/components/profile/ProfileLifestyle";
import MyFans from "@/components/contents/MyFans";
import ContentDashboard from "@/components/creators/ContentDashboard";
import ReelsViewer from "@/components/reels/ReelsViewer";

export default function ContentPage() {
  const { accessToken, userInfo } = useAppContext();
  const [activeTab, setActiveTab] = useState("dashboard");
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

  const tabs = [
    {
      value: "dashboard",
      label: "Dashboard",
      icon: LayoutGrid,
      colorClass:
        "data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-100",
      content: (
        <ContentDashboard accessToken={accessToken} userInfo={userInfo} />
      ),
    },
    {
      value: "my-content",
      label: "Reels",
      icon: Film,
      colorClass:
        "data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-100",
      content: (
        <MyContentTab
          accessToken={accessToken}
          onUploadClick={() => setOpenUploadDialog(true)}
          onContentClick={setActiveContentId}
        />
      ),
    },
    {
      value: "my-reels",
      label: "Shorts",
      icon: Clapperboard,
      colorClass:
        "data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-100",
      content: (
        <MyReelsTab
          accessToken={accessToken}
          onUploadClick={() => setOpenUploadReelDialog(true)}
          onReelClick={openReelViewer}
        />
      ),
    },
    {
      value: "my-photos",
      label: "Photos",
      icon: Camera,
      colorClass:
        "data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-100",
      content: (
        <ProfilePhotos
          accessToken={accessToken}
          onUploadClick={() => setOpenUploadDialog(true)}
          onContentClick={setActiveContentId}
        />
      ),
    },
    {
      value: "my-lifestyle",
      label: "Lifestyle",
      icon: Coffee,
      colorClass:
        "data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-100",
      content: (
        <ProfileLifestyle
          accessToken={accessToken}
          onUploadClick={() => setOpenUploadDialog(true)}
          onContentClick={setActiveContentId}
        />
      ),
    },
    {
      value: "fans",
      label: "Fans",
      icon: Users,
      colorClass:
        "data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-100",
      content: <MyFans accessToken={accessToken} userInfo={userInfo} />,
    },
    {
      value: "my-creators",
      label: "Other Creators",
      icon: Star,
      colorClass:
        "data-[state=active]:bg-yellow-100 dark:data-[state=active]:bg-yellow-900 data-[state=active]:text-yellow-700 dark:data-[state=active]:text-yellow-100",
      content: <MyCreatorsTab accessToken={accessToken} />,
    },
  ];

  return (
    <section className="max-w-3xl mx-auto space-y-4 mt-14 md:mt-8 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Creators Workplace
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your creation from here. Add effecttive creations to keep
            you growth and earning!
          </p>
        </div>
        {/* <Button
          onClick={() => setOpenUploadDialog(true)}
          className="gap-2 bg-secondary hover:bg-secondary/90 cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Content</span>
        </Button> */}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="gap-2 bg-transparent p-0 h-auto w-auto flex-wrap mb-6">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`gap-2 rounded-full px-4 py-2 cursor-pointer ${tab.colorClass}`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>

      {/* Upload Dialogs */}
      <UploadContentDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
        accessToken={accessToken}
        onUploadSuccess={() => setActiveTab("my-content")}
      />
      <UploadReelDialog
        open={openUploadReelDialog}
        onOpenChange={setOpenUploadReelDialog}
        accessToken={accessToken}
        onUploadSuccess={() => setActiveTab("my-reels")}
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
