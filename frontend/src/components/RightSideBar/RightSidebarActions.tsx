"use client";

import { FC, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

interface ActionsProps {
  selectedFile: File | null;
  onDelete: () => void;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
  isDeleting?: boolean;
  isUploading?: boolean;
}

export const RightSidebarActions: FC<ActionsProps> = ({
  selectedFile,
  onDelete,
  onFileSelect,
  onUploadClick,
  isDeleting = false,
  isUploading = false,
}) => {
  return (
    <div className="mt-6 space-y-3">
      {/* Clear Collection Button */}
      <Button
        onClick={onDelete}
        variant="destructive"
        className={`w-full relative overflow-hidden ${isDeleting ? "opacity-70 animate-pulse" : ""}`}
        disabled={isDeleting}
      >
        {isDeleting ? "🗑 Clearing..." : "🗑 Clear Collection"}
      </Button>

      {/* File Input */}
      <label className="block w-full">
        <span className="text-gray-300 text-sm">Select PDF</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={onFileSelect}
          className="mt-1 block w-full text-sm text-gray-200 bg-gray-800 border border-gray-600 rounded p-1
            file:mr-3
            file:py-2 file:px-4 file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-red-500 file:text-white
            hover:file:bg-red-600"
          disabled={isUploading} // disable input while uploading
        />
      </label>

      {/* Upload Button */}
      <Button
        onClick={onUploadClick}
        disabled={!selectedFile || isUploading}
        variant="destructive"
        className={`w-full ${isUploading ? "opacity-70 animate-pulse" : ""}`}
      >
        {isUploading ? "📄 Uploading..." : "📄 Upload PDF"}
      </Button>
    </div>
  );
};
