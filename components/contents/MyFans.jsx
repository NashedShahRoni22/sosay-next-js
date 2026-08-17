"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "@/helpers/api";
import { User, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SubscriberSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm mb-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="space-y-2 text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
        <Skeleton className="h-4 w-12 ml-auto rounded-md" />
      </div>
    </div>
  );
}

export default function MyFans({ accessToken }) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["/contents/subscribers", accessToken, page],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/contents/subscribers?page=${page}`, accessToken],
      }),
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const subscribers = data?.data || [];
  const paginationData = data?.pagination || null;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="">
      <h2 className="text-lg font-bold text-gray-800 mb-6">My Subscriber</h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SubscriberSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-10 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
          <p className="font-medium text-sm">Failed to load subscribers.</p>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <Users className="w-12 h-12 text-gray-300 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            No subscribers yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600">
                {sub.subscriber?.profile_picture ? (
                  <img
                    src={sub.subscriber.profile_picture}
                    alt={sub.subscriber.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                  {sub.subscriber?.name || "Unknown User"}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-white">
                    ${sub.price_paid}
                  </div>
                  <div className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium">
                    +${sub.creator_earnings} Earned
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-md h-8 px-3 text-xs font-medium"
                  asChild
                >
                  <Link href={`/app/profile/${sub.subscriber?.id}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {paginationData?.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="cursor-pointer rounded-md h-9 px-3 text-sm"
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from(
                  { length: paginationData.last_page },
                  (_, i) => i + 1,
                ).map((p) => (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    onClick={() => handlePageChange(p)}
                    className="w-9 h-9 p-0 cursor-pointer rounded-md text-sm"
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === paginationData.last_page}
                className="cursor-pointer rounded-md h-9 px-3 text-sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
