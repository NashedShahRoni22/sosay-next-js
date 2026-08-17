"use client";

import React from "react";
import Image from "next/image";
import { Play, Eye } from "lucide-react";

export default function ReelCard({ reel, onView }) {
  const videoSrc = reel?.video_url || "";

  return (
    <button
      type="button"
      onClick={() => onView?.()}
      className="group relative rounded-xl overflow-hidden bg-black aspect-3/5 cursor-pointer w-full text-left"
    >
      {reel?.thumbnail_url && (
        <div className="absolute inset-0 z-10 cursor-pointer group">
          <Image
            src={reel.thumbnail_url}
            alt="Reel thumbnail"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 600px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-secondary/90 hover:bg-secondary p-3 rounded-full transition">
              <Play className="h-6 w-6 text-black fill-black" />
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
      )}

      <video
        src={videoSrc}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
      />

      {/* Stats (bottom left) */}
      <div className="absolute bottom-2 left-2 flex gap-2 text-xs text-white bg-black/60 rounded-lg px-2 py-1 z-20">
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {reel.view_count}
        </div>
      </div>

      {/* User Avatar (bottom right) */}
      {reel.user?.profile_picture && (
        <div className="absolute bottom-2 right-2 z-20">
          <Image
            src={reel.user.profile_picture}
            alt={reel.user.name}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border-2 border-white object-cover"
          />
        </div>
      )}
    </button>
  );
}
