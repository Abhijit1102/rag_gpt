"use client";

import { useState, useRef } from "react";
import ChatBot from "@/components/ChatBot";
import { PanelRightOpen, PanelLeftOpen } from "lucide-react";
import { RightSidebar } from "@/components/RightSideBar/RightSidebar";
import { LeftSidebar } from "@/components/LeftSideBar/LeftSidebar";
import { ChatMessage } from "@/components/LeftSideBar/LeftSidebarContent";

export default function App() {
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isLeftOpen, setIsLeftOpen] = useState(false);

  const chatRef = useRef<any>(null);

  const resetThread = () => {
    chatRef.current?.startNewChat?.();
  };

  const handleSelectThread = (threadId: string, messages: ChatMessage[]) => {
    chatRef.current?.loadThread?.(threadId, messages);
  };

  return (
    <div className="w-screen h-screen flex bg-[#0E1117] text-white">
      <LeftSidebar
        isOpen={isLeftOpen}
        setIsOpen={setIsLeftOpen}
        onNewChat={resetThread}
        onSelectThread={handleSelectThread}
      />

      <div className="flex-1 relative">
        <ChatBot ref={chatRef} />
      </div>

      <RightSidebar isOpen={isRightOpen} setIsOpen={setIsRightOpen} />

      {!isLeftOpen && (
        <button
          onClick={() => setIsLeftOpen(true)}
          className="fixed top-4 left-4 bg-[#4B79FF] hover:bg-[#3a62d1] text-white p-2 rounded shadow-lg z-50"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      {!isRightOpen && (
        <button
          onClick={() => setIsRightOpen(true)}
          className="fixed top-4 right-4 bg-[#FF4B4B] hover:bg-[#e64545] text-white p-2 rounded shadow-lg z-50"
        >
          <PanelRightOpen size={20} />
        </button>
      )}
    </div>
  );
}
