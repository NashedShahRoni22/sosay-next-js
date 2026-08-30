"use client";
import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postWithToken } from "@/helpers/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditCampaignModal({
  campaign,
  accessToken,
  countries,
  open,
  onClose,
}) {
  const queryClient = useQueryClient();

  // Form states
  const [totalBudget, setTotalBudget] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [targetCountryId, setTargetCountryId] = useState("");
  const [targetGender, setTargetGender] = useState("");
  const [targetMinAge, setTargetMinAge] = useState("");
  const [targetMaxAge, setTargetMaxAge] = useState("");
  const [placementArea, setPlacementArea] = useState("");

  useEffect(() => {
    if (campaign && open) {
      setTotalBudget(campaign.total_budget || "");
      setDurationDays(campaign.duration_days || "");
      setTargetCountryId(
        campaign.target_country_id ? String(campaign.target_country_id) : ""
      );
      setTargetGender(campaign.target_gender || "");
      setTargetMinAge(campaign.target_min_age || "");
      setTargetMaxAge(campaign.target_max_age || "");
      setPlacementArea(campaign.placement_area || "");
    }
  }, [campaign, open]);

  // Edit campaign mutation
  const editCampaignMutation = useMutation({
    mutationFn: async () => {
      if (!totalBudget || !durationDays) {
        throw new Error("Please fill in all required fields");
      }

      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("boostable_id", campaign.boostable_id);
      formData.append(
        "boostable_type",
        campaign.boostable_type || "Modules\\FeedManagement\\app\\Models\\Post"
      );
      formData.append("total_budget", totalBudget);
      formData.append("duration_days", durationDays);

      if (targetCountryId) {
        formData.append("target_country_id", targetCountryId);
      }
      if (targetGender) {
        formData.append("target_gender", targetGender);
      }
      if (targetMinAge) {
        formData.append("target_min_age", targetMinAge);
      }
      if (targetMaxAge) {
        formData.append("target_max_age", targetMaxAge);
      }
      if (placementArea) {
        formData.append("placement_area", placementArea);
      }

      return await postWithToken(
        `/ads/campaigns/${campaign.id}`,
        formData,
        accessToken
      );
    },
    onSuccess: (data) => {
      if (data.status || data.success) {
        toast.success(data.message || "Campaign updated successfully!");
        queryClient.invalidateQueries(["/ads/campaigns/me", accessToken]);
        onClose();
      } else {
        toast.error(data.message || "Failed to update campaign");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update campaign");
    },
  });

  const handleEditCampaign = (e) => {
    e.preventDefault();
    editCampaignMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-secondary" />
            Edit Campaign #{campaign?.id}
          </DialogTitle>
          <DialogDescription>
            Update budget, duration, and targeting
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEditCampaign} className="space-y-6">
          {/* Budget and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-budget">Total Budget ($) *</Label>
              <Input
                id="edit-budget"
                type="number"
                placeholder="Enter budget"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration (Days) *</Label>
              <Input
                id="edit-duration"
                type="number"
                placeholder="Enter duration"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                min="1"
                max="365"
                required
                className="w-full"
              />
            </div>

            {/* Placement Area */}
            <div className="space-y-2">
              <Label htmlFor="edit-placementArea">Placement Area</Label>
              <Select value={placementArea} onValueChange={setPlacementArea}>
                <SelectTrigger id="edit-placementArea" className="w-full">
                  <SelectValue placeholder="Select placement area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feed_inline">Feed Inline</SelectItem>
                  <SelectItem value="reels_interstitial">
                    Reels Interstitial
                  </SelectItem>
                  <SelectItem value="marketplace_featured">
                    Marketplace Featured
                  </SelectItem>
                  <SelectItem value="home_sidebar">Home Sidebar</SelectItem>
                  <SelectItem value="profile_banner">Profile Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional Targeting */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-semibold mb-4 text-sm">Targeting</h3>

            <div className="space-y-2 mb-4">
              <Label htmlFor="edit-gender">Target Gender</Label>
              <Select value={targetGender} onValueChange={setTargetGender}>
                <SelectTrigger id="edit-gender" className="w-full">
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minAge">Minimum Age</Label>
                <Input
                  id="edit-minAge"
                  type="number"
                  placeholder="Min age"
                  value={targetMinAge}
                  onChange={(e) => setTargetMinAge(e.target.value)}
                  min="13"
                  max="120"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxAge">Maximum Age</Label>
                <Input
                  id="edit-maxAge"
                  type="number"
                  placeholder="Max age"
                  value={targetMaxAge}
                  onChange={(e) => setTargetMaxAge(e.target.value)}
                  min="13"
                  max="120"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-country">Target Country</Label>
              <Select
                value={targetCountryId}
                onValueChange={setTargetCountryId}
              >
                <SelectTrigger id="edit-country" className="w-full">
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  {countries &&
                    countries.map((country) => (
                      <SelectItem key={country.id} value={String(country.id)}>
                        {country.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={editCampaignMutation.isPending}
              className="flex-1 bg-secondary hover:bg-secondary/90"
            >
              {editCampaignMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
