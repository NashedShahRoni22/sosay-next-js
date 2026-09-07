"use client";

import { useAppContext } from "@/context/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ActivitySettings() {
  const { accessToken: token, logout } = useAppContext();
  const queryClient = useQueryClient();

  const { data: onlineData, isLoading: onlineLoading } = useQuery({
    queryKey: ["/user/online-status", token],
    queryFn: fetchWithToken,
    enabled: !!token,
  });

  const currentStatus = onlineData?.data?.status?.toLowerCase() || "offline";

  const toggleMutation = useMutation({
    mutationFn: (newStatus) => {
      const fd = new FormData();
      fd.append("status", newStatus);
      // Assuming this is a POST request since it accepts FormData
      return postWithToken("/user/toggle-status", fd, token);
    },
    onSuccess: (res) => {
      if (res?.status === true) {
        toast.success(res.message || "Status updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["/user/online-status", token],
        });
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("An error occurred while updating status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("_method", "DELETE");
      return postWithToken("/user/delete", fd, token);
    },
    onSuccess: (res) => {
      if (res?.status === true || res?.status_code === 200) {
        toast.success("Account deleted successfully");
        logout();
      } else {
        toast.error(res?.message || "Failed to delete account");
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("An error occurred while deleting account");
    },
  });

  const handleStatusChange = (newStatus) => {
    toggleMutation.mutate(newStatus);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      deleteMutation.mutate();
    }
  };

  if (!token) {
    return <div className="p-4">Please log in to view activity settings.</div>;
  }

  return (
    <div className="bg-white border rounded-xl px-6 py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Activity Settings</h2>

        <div className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Online Status</Label>
            {onlineLoading ? (
              <div className="flex items-center text-sm text-muted-foreground h-10">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading
                status...
              </div>
            ) : (
              <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={toggleMutation.isLoading}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Control how others see your online presence.
            </p>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div>
        <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="p-4 border border-red-100 bg-red-50/50 rounded-lg max-w-2xl">
          <h4 className="font-medium text-gray-900 mb-1">Delete Account</h4>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={deleteMutation.isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteMutation.isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete My Account
          </Button>
        </div>
      </div>
    </div>
  );
}
