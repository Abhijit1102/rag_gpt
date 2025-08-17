"use client";

import { FC } from "react";
import { X } from "lucide-react";

interface HeaderProps {
  title: string;
  onClose: () => void;
}

export const RightSidebarHeader: FC<HeaderProps> = ({ title, onClose }) => {
  return (
    <div className="relative mb-4">
      {/* Centered Title */}
      <h2 className="text-lg font-bold text-center">{title}</h2>

      {/* Close Button on the right */}
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>
    </div>

  );
};
