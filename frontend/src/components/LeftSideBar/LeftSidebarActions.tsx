"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";

interface LeftSidebarActionsProps {
  onNewChat: () => void;
}

export const LeftSidebarActions: FC<LeftSidebarActionsProps> = ({ onNewChat }) => {
  return (
    <div className="mt-6">
      <Button
        className="w-full bg-[#FF4B4B] hover:bg-[#e64545] text-white text-lg px-4 py-4 rounded-lg"
        onClick={onNewChat}
      >
        🆕 New Chat
      </Button>
    </div>
  );
};
