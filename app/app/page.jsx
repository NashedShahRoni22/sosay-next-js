"use client";
import React from "react";
import FeedReels from "@/components/feed/FeedReels";
import PublicPost from "@/components/feed/PublicPost";

export default function FeedPage() {
  return (
    <main className="max-w-3xl mx-auto space-y-4 mt-14 md:mt-8">
      {/* <div>
        <h1 className="text-3xl font-bold mb-2">Feed</h1>
        <p className="text-gray-600">
          Latest insights and updates from your connections.
        </p>
      </div> */}

      <FeedReels />
      <PublicPost />
    </main>
  );
}
