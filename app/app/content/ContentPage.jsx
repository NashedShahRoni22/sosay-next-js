"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Tv, Film } from "lucide-react";
import ContentTab from "@/components/contents/ContentTab";
import MyContentTab from "@/components/contents/MyContentTab";
import UploadContentDialog from "@/components/contents/UploadContentDialog";
import ContentDetails from "@/components/contents/ContentDetails";
import { useAppContext } from "@/context/context";

export default function ContentPage() {
  const { accessToken, userInfo } = useAppContext();
  const [activeTab, setActiveTab] = useState("content");
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [activeContentId, setActiveContentId] = useState(null);

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
      value: "content",
      label: "Reels",
      icon: Tv,
      colorClass:
        "data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-100",
      content: (
        <ContentTab
          accessToken={accessToken}
          onContentClick={setActiveContentId}
        />
      ),
    },
    {
      value: "my-content",
      label: "My Reels",
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
  ];

  return (
    <section className="max-w-3xl mx-auto space-y-4 mt-14 md:mt-8 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Reels
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and view all your Reels
          </p>
        </div>
        <Button
          onClick={() => setOpenUploadDialog(true)}
          className="gap-2 bg-secondary hover:bg-secondary/90 cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Reel</span>
        </Button>
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

      {/* Upload Dialog */}
      <UploadContentDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
        accessToken={accessToken}
        onUploadSuccess={() => setActiveTab("my-content")}
      />
    </section>
  );
}
