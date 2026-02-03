"use client";
import { useState } from "react";
import AppSidebar from "@/components/shared/AppSidebar";
import BottomBar from "@/components/shared/BottomBar";
import TopBar from "@/components/shared/TopBar";
import SuggestionList from "@/components/feed/SuggestionList";
import PrivateRoute from "@/components/private/PrivateRoute";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <PrivateRoute>
      <TopBar />
      <div className="flex min-h-screen bg-white">
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 min-h-screen bg-gray-50 mt-14 md:mt-0 md:ml-64 p-5 pb-16 md:pb-0">
          {children}
        </main>
        {/* <div className="hidden xl:block xl:w-72 p-5 mt-14 bg-gray-50">
          <SuggestionList />
        </div> */}
      </div>
      <BottomBar onUserClick={() => setIsSidebarOpen((v) => !v)} />
    </PrivateRoute>
  );
}
