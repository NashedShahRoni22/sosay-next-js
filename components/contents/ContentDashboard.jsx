"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import {
  User,
  Pencil,
  CheckCircle,
  DollarSign,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ContentDashboard({ accessToken, userInfo }) {
  const queryClient = useQueryClient();
  const [bio, setBio] = useState("");
  const [subscriptionPrice, setSubscriptionPrice] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Bio & Subscription Query
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/contents/me/bio", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  // Stripe Status Query
  const { data: stripeStatusData } = useQuery({
    queryKey: ["/onboarding/status", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (profileData?.data) {
      setBio(profileData.data.bio || "");
      setSubscriptionPrice(profileData.data.subscription_price || "");
    }
  }, [profileData]);

  const updateMutation = useMutation({
    mutationFn: (formData) =>
      postWithToken("/contents/profile/pricing", formData, accessToken),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(
          res.message || "Profile and pricing updated successfully!",
        );
        queryClient.invalidateQueries({ queryKey: ["/contents/me/bio"] });
        setIsOpen(false);
      } else {
        toast.error("Failed to update profile.");
      }
    },
    onError: () => {
      toast.error("An error occurred while updating.");
    },
  });

  const stripeOnboardMutation = useMutation({
    mutationFn: () => postWithToken("/onboarding/url", {}, accessToken),
    onSuccess: (res) => {
      if (res.status && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(res.message || "Failed to generate Stripe onboarding URL.");
      }
    },
    onError: () => {
      toast.error("An error occurred while connecting to Stripe.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subscription_price", subscriptionPrice);
    formData.append("bio", bio);
    updateMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700 relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full relative bg-gray-200 dark:bg-gray-700">
        {userInfo?.user_cover_image ? (
          <img
            src={userInfo.user_cover_image}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600"></div>
        )}

        {/* Edit Button overlay */}
        <div className="absolute top-4 right-4 z-20">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 p-2 bg-white/90 backdrop-blur border border-gray-200/50 text-gray-700 rounded-full hover:bg-white transition-colors shadow-sm text-sm font-medium dark:bg-gray-900/80 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                <Pencil className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Update Dashboard
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    Subscription Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={subscriptionPrice}
                    onChange={(e) => setSubscriptionPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0.00"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Platform fee is 10%. You keep 90% of earnings.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Welcome to my premium feed! Here you'll find..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="w-full py-2 bg-secondary hover:bg-secondary/95 text-white font-medium rounded-full disabled:opacity-50 transition-colors mt-4"
                >
                  {updateMutation.isLoading
                    ? "Saving changes..."
                    : "Save Changes"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col md:flex-row gap-6 mb-6 relative z-10">
          {/* User Image */}
          <div className="relative -mt-16 md:-mt-20 shrink-0">
            {userInfo?.user_image ? (
              <img
                src={userInfo.user_image}
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md bg-white"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Name and Bio */}
          <div className="flex-1 pb-2 md:pt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {userInfo?.name || "Creator"}
            </h1>
            {isLoadingProfile ? (
              <div className="h-4 bg-gray-100 rounded w-1/2 mt-2 animate-pulse"></div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed max-w-2xl whitespace-pre-wrap">
                {profileData?.data?.bio ||
                  "You haven't added a bio yet. Click 'Edit Profile' to tell your audience about your premium content."}
              </p>
            )}
          </div>
        </div>

        {/* Pricing & Stripe Bottom Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-700/50">
          {/* Subscription Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Monthly Subscription
              </p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${profileData?.data?.subscription_price || "0.00"}
                </span>
                <span className="text-sm font-medium text-gray-500">/mo</span>
              </div>
            </div>
          </div>

          {/* Stripe Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${stripeStatusData?.data?.is_ready ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"}`}
            >
              <Wallet className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Stripe Payouts
              </p>
              {stripeStatusData?.data?.is_ready ? (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                    Connected
                  </span>
                  <button
                    onClick={() => stripeOnboardMutation.mutate()}
                    disabled={stripeOnboardMutation.isLoading}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
                  >
                    {stripeOnboardMutation.isLoading
                      ? "Changing..."
                      : "Change Account"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                    Not Connected
                  </span>
                  <button
                    onClick={() => stripeOnboardMutation.mutate()}
                    disabled={stripeOnboardMutation.isLoading}
                    className="text-xs font-medium bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  >
                    {stripeOnboardMutation.isLoading
                      ? "Connecting..."
                      : "Connect"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
