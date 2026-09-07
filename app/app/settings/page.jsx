"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Activity } from "lucide-react";
import ProfileSettings from "@/components/settings/ProfileSettings";
import ActivitySettings from "@/components/settings/ActivitySettings";

export default function SettingsPage() {
  const { accessToken: token } = useAppContext();
  const [activeTab, setActiveTab] = useState("profile");

  if (!token) {
    return <div className="p-4">You must be logged in to access settings.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4 py-8 mt-14 md:mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="gap-2 bg-transparent p-0 h-auto w-auto flex-wrap mb-6">
          <TabsTrigger
            value="profile"
            className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-100 cursor-pointer"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-100 cursor-pointer"
          >
            <Activity className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="outline-none">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="activity" className="outline-none">
          <ActivitySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
