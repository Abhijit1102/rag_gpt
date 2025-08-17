"use client";

import { FC } from "react";
import { X } from "lucide-react";

interface LeftSidebarHeaderProps {
  title: string;
  onClose: () => void;
}

export const LeftSidebarHeader: FC<LeftSidebarHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="relative mb-4">
      <h2 className="text-lg font-semibold text-center">{title}</h2>
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-white hover:text-gray-300"
      >
        <X size={20} />
      </button>
    </div>
  );
};
