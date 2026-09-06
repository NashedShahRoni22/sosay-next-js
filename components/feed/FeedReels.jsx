"use client";

import React, { useState, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { useAppContext } from "@/context/context";
import ReelsViewer from "@/components/reels/ReelsViewer";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DEV_URL;

const CARD_CLASSES =
  "w-[calc((100%-16px)/3)] sm:w-[calc((100%-32px)/4)] md:w-[calc((100%-48px)/5)] " +
  "aspect-[3/5] relative rounded-xl overflow-hidden cursor-pointer bg-black flex-shrink-0 snap-start";

export default function FeedReels() {
  const { accessToken, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  const [openViewer, setOpenViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(0);
  const viewedInSessionRef = useRef(new Set());
  const scrollerRef = useRef(null);
  const cardRefs = useRef([]);

  const { data: reelsData, isLoading } = useQuery({
    queryKey: ["/reels", accessToken, 1], // fetch only first page
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/reels?page=1`, accessToken],
      }),
    enabled: !!accessToken,
  });

  const reelsPayload = reelsData?.data;
  const reels = Array.isArray(reelsPayload)
    ? reelsPayload
    : Array.isArray(reelsPayload?.data)
      ? reelsPayload.data
      : [];

  const markReelView = useCallback(
    async (reelId) => {
      if (!accessToken || !reelId || viewedInSessionRef.current.has(reelId))
        return;

      viewedInSessionRef.current.add(reelId);
      try {
        await fetch(`${API_BASE_URL}/reels/${reelId}/view`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        queryClient.invalidateQueries({ queryKey: ["/reels"] });
      } catch {
        // ignore
      }
    },
    [accessToken, queryClient],
  );

  React.useEffect(() => {
    const handleScroll = () => {
      const container = scrollerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      let bestIndex = -1;
      let minDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        
        const visibleLeft = Math.max(rect.left, containerRect.left);
        const visibleRight = Math.min(rect.right, containerRect.right);
        const visibleWidth = Math.max(0, visibleRight - visibleLeft);
        
        // Consider cards that are at least 40% visible
        if (visibleWidth > rect.width * 0.4) {
          const distance = Math.abs(rect.left - containerRect.left);
          if (distance < minDistance) {
            minDistance = distance;
            bestIndex = index;
          }
        }
      });

      if (bestIndex !== -1) {
        setPlayingIndex(bestIndex);
      }
    };

    const container = scrollerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      // Run once initially after render
      setTimeout(handleScroll, 100);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [reels]);

  const openReelViewer = (index) => {
    setViewerIndex(index);
    setOpenViewer(true);
    markReelView(reels?.[index]?.id);
  };

  const scrollByCards = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    // scroll by roughly 3 cards' worth of width
    const amount = el.clientWidth * 0.8 * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="mb-6 w-full overflow-hidden">
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`${CARD_CLASSES} animate-pulse bg-gray-200 dark:bg-gray-800`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 w-full min-w-0 relative group">
      <div
        ref={scrollerRef}
        className="flex gap-2 w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Create Story Card */}
        <Link
          href="/app/reels"
          className={`${CARD_CLASSES} group bg-white dark:bg-[#242526] block border border-gray-200 dark:border-gray-800`}
        >
          <div className="h-[65%] relative w-full overflow-hidden">
            {userInfo?.user_image ? (
              <Image
                src={userInfo.user_image}
                alt="Your profile"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 dark:bg-gray-700" />
            )}
          </div>

          <div className="h-[35%] w-full relative flex flex-col items-center justify-end pb-3 text-black dark:text-white">
            {/* Floating Plus Button */}
            <div className="absolute -top-5 bg-blue-600 rounded-full p-1 border-4 border-white dark:border-[#242526]">
              <Plus size={20} className="text-white" strokeWidth={3} />
            </div>
            <span className="text-[12px] sm:text-[13px] font-semibold mt-3">
              Create shorts
            </span>
          </div>
        </Link>

        {/* Reels Cards */}
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            ref={(el) => {
              if (el) cardRefs.current[index] = el;
            }}
            className={`${CARD_CLASSES} group border border-transparent dark:border-gray-800`}
            onClick={() => openReelViewer(index)}
          >
            {/* Background Thumbnail or Video */}
            {index === playingIndex && reel.video_url ? (
              <video
                src={reel.video_url}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : reel.thumbnail_url ? (
              <Image
                src={reel.thumbnail_url}
                alt="Reel thumbnail"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-800" />
            )}

            {/* Top Left Avatar */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
              {reel.user?.profile_picture ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[2px] sm:border-[3px] border-blue-500 overflow-hidden relative shadow-sm">
                  <Image
                    src={reel.user.profile_picture}
                    alt={reel.user.name || "User"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 32px, 40px"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[2px] sm:border-[3px] border-blue-500 bg-gray-500" />
              )}
            </div>

            {/* Bottom Gradient and Name */}
            <div className="absolute bottom-0 left-0 w-full h-3/5 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-10">
              <p className="text-white text-[11px] sm:text-[13px] font-semibold truncate leading-tight text-shadow-sm">
                {reel.user?.name || "User"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Navigation Buttons (Desktop only) */}
      {reels.length > 3 && (
        <>
          <div className="absolute top-1/2 -left-5 transform -translate-y-1/2 z-10 hidden sm:block">
            <button
              className="bg-white dark:bg-[#3e4042] w-[48px] h-[48px] flex justify-center items-center rounded-full cursor-pointer shadow-xl hover:bg-gray-100 dark:hover:bg-[#4e5052] transition border border-gray-200 dark:border-gray-700"
              onClick={() => scrollByCards(-1)}
            >
              <ChevronLeft className="text-black dark:text-[#e4e6eb] w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 z-10 hidden sm:block">
            <button
              className="bg-white dark:bg-[#3e4042] w-[48px] h-[48px] flex justify-center items-center rounded-full cursor-pointer shadow-xl hover:bg-gray-100 dark:hover:bg-[#4e5052] transition border border-gray-200 dark:border-gray-700"
              onClick={() => scrollByCards(1)}
            >
              <ChevronRight className="text-black dark:text-[#e4e6eb] w-6 h-6" />
            </button>
          </div>
        </>
      )}

      <ReelsViewer
        open={openViewer}
        reels={reels}
        initialIndex={viewerIndex}
        onClose={() => setOpenViewer(false)}
        onReelView={markReelView}
      />
    </div>
  );
}
