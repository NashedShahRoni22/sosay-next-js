import { useEffect, useState, useRef } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useAppContext } from "@/context/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Paperclip, X, Download, Smile } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { EMOJI_CATEGORIES, ALL_EMOJIS } from "./Emojidata";

// ─── EmojiPicker Component ─────────────────────────────────────────────────
function EmojiPicker({ onSelect, onClose, pickerRef }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const scrollRef = useRef(null);

  // Filtered results — every typed word must appear at the start of some keyword word
  const filtered = search.trim()
    ? (() => {
        const terms = search.trim().toLowerCase().split(/\s+/);
        return ALL_EMOJIS.filter(({ keywords }) =>
          terms.every((term) =>
            keywords.split(/\s+/).some((word) => word.startsWith(term))
          )
        );
      })()
    : null;

  // Scroll category into view
  const scrollToCategory = (idx) => {
    setActiveCategory(idx);
    const el = scrollRef.current?.querySelector(`[data-cat="${idx}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full mb-2 left-0 w-80 bg-card border rounded-xl shadow-lg z-50 flex flex-col"
      style={{ maxHeight: "360px" }}
    >
      {/* Search */}
      <div className="p-2 border-b">
        <input
          autoFocus
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emoji…"
          className="w-full px-3 py-1.5 text-sm rounded-lg border bg-muted focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>

      {/* Category Tabs */}
      {!search.trim() && (
        <div className="flex gap-1 px-2 pt-2 pb-1 overflow-x-auto">
          {EMOJI_CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => scrollToCategory(i)}
              className={`text-lg flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md transition-colors
                ${activeCategory === i ? "bg-secondary" : "hover:bg-muted"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2">
        {filtered ? (
          // Search results
          filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No emoji found</p>
          ) : (
          <div className="grid grid-cols-10 gap-0.5">
            {filtered.map(({ emoji }, i) => (
              <button
                key={i}
                onClick={() => onSelect(emoji)}
                className="text-xl w-7 h-7 flex items-center justify-center rounded hover:bg-muted transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
          )
        ) : (
          // Categorised view
          EMOJI_CATEGORIES.map((cat, catIdx) => (
            <div key={cat.name} data-cat={catIdx}>
              <p className="text-xs font-semibold text-muted-foreground px-1 py-1 sticky top-0 bg-card">
                {cat.name}
              </p>
              <div className="grid grid-cols-10 gap-0.5">
                {cat.emojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => onSelect(emoji)}
                    className="text-xl w-7 h-7 flex items-center justify-center rounded hover:bg-muted transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Echo Setup ────────────────────────────────────────────────────────────
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

// ─── Chatpanel ─────────────────────────────────────────────────────────────
export default function Chatpanel({ receiver, setShowChatPanel }) {
  const { accessToken, userInfo } = useAppContext();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const queryClient = useQueryClient();

  // ── Close picker on outside click ──────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // ── Insert emoji at cursor position ────────────────────────────────────
  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji);
    // Keep focus on the input after selecting
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (!accessToken || !userInfo?.id) return;

    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.sosay.org/api/v1/chat/history/${receiver?.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          queryClient.invalidateQueries({
            queryKey: [`/chat/inbox`],
          });
        }

        const data = await response.json();
        const messages = Array.isArray(data) ? data : data.data;

        if (!messages) {
          console.error("Unexpected data format", data);
          return;
        }

        const formattedHistory = messages.map((msg) => ({
          text: typeof msg.message === "string" ? msg.message : (msg.message?.message || "Message"),
          sender: msg.sender_id == userInfo.id ? "Me" : "Them",
          timestamp: msg.created_at,
          isFile: msg.is_file === 1 || msg.is_file === true,
          fileUrl: msg.is_file
            ? (typeof msg.message === "string" ? msg.message : msg.message?.message || null)
            : null,
        }));

        setChatHistory(formattedHistory);
      } catch (error) {
        console.error("Could not fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    const channel = echo.channel(`chat.${userInfo.id}`);

    channel.listen(".message.sent", (e) => {
      console.log("Real-time Message received:", e);
      const messageText = typeof e.message === "string" ? e.message : (e.message?.message || "Message");
      setChatHistory((prev) => [
        ...prev,
        {
          text: messageText,
          sender: "Them",
          timestamp: new Date(),
          isFile: e.is_file === 1 || e.is_file === true,
          fileUrl: e.is_file ? messageText : null,
        },
      ]);
    });

    return () => {
      channel.stopListening(".message.sent");
      echo.leave(`chat.${userInfo.id}`);
    };
  }, [accessToken, userInfo, receiver]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFileNameFromUrl = (url) => {
    try {
      const urlParts = url.split("/");
      return urlParts[urlParts.length - 1];
    } catch {
      return "file";
    }
  };

  const sendMessage = async () => {
    if ((!message.trim() && !selectedFile) || !accessToken || isSending) return;
    setIsSending(true);
    setShowEmojiPicker(false);

    try {
      let requestBody;
      let headers = { Authorization: `Bearer ${accessToken}` };

      if (selectedFile) {
        const formData = new FormData();
        formData.append("receiver_id", receiver?.user_id);
        formData.append("file", selectedFile);
        formData.append("is_file", "1");
        if (message.trim()) formData.append("message", message);
        requestBody = formData;
      } else {
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify({
          receiver_id: receiver?.user_id,
          message: message,
          is_file: 0,
        });
      }

      const optimisticMessage = {
        text: selectedFile ? selectedFile.name : message,
        sender: "Me",
        timestamp: new Date(),
        isFile: !!selectedFile,
        fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : null,
      };
      setChatHistory((prev) => [...prev, optimisticMessage]);

      const response = await fetch("https://api.sosay.org/api/v1/chat/send", {
        method: "POST",
        headers: headers,
        body: requestBody,
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: [`/chat/inbox`] });

        if (selectedFile) {
          const responseData = await response.json();
          const fileUrl = responseData?.data?.message;
          if (fileUrl) {
            setChatHistory((prev) =>
              prev.map((msg, idx) =>
                idx === prev.length - 1 ? { ...msg, text: fileUrl, fileUrl } : msg
              )
            );
          }
        }

        setMessage("");
        removeSelectedFile();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => prev.slice(0, -1));
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <section className="w-full h-full">
      {receiver ? (
        <div className="flex flex-col h-full lg:h-[calc(100dvh-90px)] bg-card shadow-sm lg:rounded-xl">
          {/* Chat Header */}
          <div className="border-b px-4 py-3 flex items-center gap-3 bg-card lg:rounded-t-xl">
            <button className="lg:hidden" onClick={() => setShowChatPanel(false)}>
              <ArrowLeft className="text-gray-400" />
            </button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={receiver?.avatar} alt={receiver?.name} />
              <AvatarFallback className="capitalize bg-gradient-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
                {getInitials(receiver?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{receiver?.name}</h2>
              <p className="text-xs text-muted-foreground">
                {receiver?.is_online ? (
                  "Active now"
                ) : (
                  <span className="text-xs text-muted-foreground mt-1">
                    {receiver?.last_seen}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "Me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.sender === "Me"
                        ? "bg-secondary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.isFile ? (
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline break-all hover:opacity-80"
                        >
                          {getFileNameFromUrl(msg.fileUrl || msg.text)}
                        </a>
                        <a href={msg.fileUrl} download className="hover:opacity-80">
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm break-words">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4 bg-card lg:rounded-b-xl">
            {/* File Preview */}
            {selectedFile && (
              <div className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeSelectedFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex gap-2 relative">
              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <EmojiPicker
                  pickerRef={emojiPickerRef}
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}

              {/* File Upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending}
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              {/* Emoji Toggle Button */}
              <Button
                ref={emojiButtonRef}
                variant="outline"
                size="icon"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                disabled={isSending}
                className={showEmojiPicker ? "bg-muted" : ""}
              >
                <Smile className="h-4 w-4" />
              </Button>

              {/* Text Input */}
              <Input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={selectedFile ? "Add a caption (optional)..." : "Type a message…"}
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                disabled={isSending}
              />

              {/* Send Button */}
              <Button
                onClick={sendMessage}
                size="icon"
                disabled={(!message.trim() && !selectedFile) || isSending}
                className="bg-secondary"
              >
                {isSending ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center h-full lg:h-[calc(100dvh-90px)] bg-card rounded-xl shadow-sm">
          <p className="text-muted-foreground">Select a chat to start messaging</p>
        </div>
      )}
    </section>
  );
}