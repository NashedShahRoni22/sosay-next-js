"use client";
import React, { useState } from "react";
import ChatHistory from "@/components/message/ChatHistory";
import Chatpanel from "@/components/message/Chatpanel";

export default function page() {
  const [receiver, setReceiver] = useState(null);
  const [showChatPanel, setShowChatPanel] = useState(false);
  return (
    <section className="relative sm:grid sm:grid-cols-2 mt-14 gap-8">
      <ChatHistory
        setReceiver={setReceiver}
        receiver={receiver}
        setShowChatPanel={setShowChatPanel}
      />
      <div className="hidden sm:block">
        <Chatpanel receiver={receiver} />
      </div>
      {showChatPanel && (
        <div className="fixed top-0 left-0 bg-background min-h-screen w-full flex items-center justify-center sm:hidden">
          <Chatpanel receiver={receiver} setShowChatPanel={setShowChatPanel} />
        </div>
      )}
    </section>
  );
}
