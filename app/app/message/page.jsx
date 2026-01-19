"use client";
import React, { useState } from "react";
import ChatHistory from "@/components/message/ChatHistory";
import Chatpanel from "@/components/message/Chatpanel";

export default function page() {
  const [receiver, setReceiver] = useState(null);
  const [showChatPanel, setShowChatPanel] = useState(false);
  
  return (
    <section className="relative lg:grid lg:grid-cols-2 mt-14 gap-8">
      {/* responsive desktop panel  */}
      <ChatHistory
        setReceiver={setReceiver}
        receiver={receiver}
        setShowChatPanel={setShowChatPanel}
      />

      <div className="hidden lg:block">
        <Chatpanel receiver={receiver} />
      </div>

      {/* responsive mobile panel  */}
      {showChatPanel && (
        <div className="fixed z-50 inset-0 bg-background lg:hidden">
          <Chatpanel receiver={receiver} setShowChatPanel={setShowChatPanel} />
        </div>
      )}
    </section>
  );
}