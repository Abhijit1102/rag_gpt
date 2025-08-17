"use client";

import { FC } from "react";
import { LeftSidebarHeader } from "./LeftSidebarHeader";
import { LeftSidebarContent, ChatMessage } from "./LeftSidebarContent";
import { LeftSidebarActions } from "./LeftSidebarActions";

interface LeftSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNewChat: () => void;
  onSelectThread: (threadId: string, messages: ChatMessage[]) => void;
}

export const LeftSidebar: FC<LeftSidebarProps> = ({
  isOpen,
  setIsOpen,
  onNewChat,
  onSelectThread,
}) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-80 bg-[#1A1A1A] text-white border-r border-gray-700 p-4
        overflow-y-auto transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <LeftSidebarHeader title="SQLite 💾" onClose={() => setIsOpen(false)} />
      <LeftSidebarActions onNewChat={onNewChat} />
      <LeftSidebarContent onSelectThread={onSelectThread} />
    </aside>
  );
};
