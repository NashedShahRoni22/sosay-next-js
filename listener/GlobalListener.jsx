
import { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/context";
 
// Initialize Echo Globally (outside component)
if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}
 
const echo = new Echo({
  broadcaster: "reverb",
  key: "k9tfoyoxjqydldgg2w6y",
  wsHost: "api.sosay.org",
  wsPort: 8080,
  wssPort: 443,
  forceTLS: true,
  enabledTransports: ["ws", "wss"],
});
 
export default function GlobalListener() {
  const { userInfo } = useAppContext();
  const queryClient = useQueryClient();
 
  useEffect(() => {
    if (!userInfo?.id) return;
 
    console.log("Global Listener Active for User:", userInfo.id);
 
    const channel = echo.channel(`chat.${userInfo.id}`);
 
    channel.listen(".message.sent", (e) => {
      console.log("Global Notification:", e);
 
      // 1. Invalidate Inbox Query
      // This ensures the "Unread Count" badge in your sidebar updates automatically
      queryClient.invalidateQueries(["/chat/inbox"]);
 
      // 2. Play Notification Sound (Optional)
      const audio = new Audio("/notification.mp3"); // Add a sound file to /public
      audio.play().catch(err => console.log("Audio blocked:", err));
 
      // 3. Check where the user currently is
      const currentPath = window.location.pathname;
      // Handle the data structure (wrapped or unwrapped)
      const data = e.data || e;
      const senderId = data.sender_id;
      const messageText = data.message;
 
      // 4. Show Toast/Popup Notification
      // ONLY if we are NOT already looking at the chat page for this user
      // (Adjust '/chat' to match your actual route)
      const isOnChatPage = currentPath.includes("/chat") || currentPath.includes("/message");
      if (!isOnChatPage) {
        // Show a popup notification
        // Example using standard browser Notification API or a Toast library
        if (typeof toast !== "undefined") {
             toast.success(`New message: ${messageText}`);
        } else {
             // Fallback if you don't have a toast library installed
             // alert(`New message from User ${senderId}: ${messageText}`); 
             console.log("New Message Notification Triggered");
        }
      }
    });
 
    return () => {
      channel.stopListening(".message.sent");
      echo.leave(`chat.${userInfo.id}`);
    };
  }, [userInfo?.id, queryClient]);
 
  return null; // This component renders nothing visually
}