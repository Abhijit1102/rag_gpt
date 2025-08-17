"use client";

import { FC, useState, useEffect, ChangeEvent } from "react";
import { RightSidebarHeader } from "./RightSidebarHeader";
import { RightSidebarInfo } from "./RightSidebarInfo";
import { RightSidebarActions } from "./RightSidebarActions";
import { toast } from "sonner";
import { fetchVectorInfo, deleteVectorCollection, uploadVectorFile } from "@/actions/vectorActions";

interface RightSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const RightSidebar: FC<RightSidebarProps> = ({ isOpen, setIsOpen }) => {
  const [info, setInfo] = useState<Record<string, any> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFetchInfo = async () => {
    try {
      const data = await fetchVectorInfo();
      setInfo(data);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Could not fetch Vector DB info");
    }
  };

  const handleDeleteCollection = async () => {
    if (!confirm("Are you sure you want to delete the collection?")) return;
    try {
      setIsDeleting(true);
      await deleteVectorCollection();
      toast.success("✅ Vector DB collection deleted");
      setInfo(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete collection");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      toast.error("⚠️ Please select a PDF first");
      return;
    }

    try {
      setIsUploading(true);
      const data = await uploadVectorFile(selectedFile);
      toast.success(`📄 Uploaded ${data.filename}, chunks: ${data.chunks_uploaded}`);
      handleFetchInfo();
    } catch (err) {
      console.error(err);
      toast.error("⚠️ PDF upload failed");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    if (isOpen) handleFetchInfo();
  }, [isOpen]);

  return (
    <aside
      className={`
        fixed top-0 right-0 h-full w-80 bg-[#1A1A1A] text-white border-l border-gray-700 p-4 overflow-y-auto
        transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <RightSidebarHeader title="📦 Vector DB" onClose={() => setIsOpen(false)} />
      <RightSidebarInfo info={info} isLoading={isUploading} />
      <RightSidebarActions
        selectedFile={selectedFile}
        onDelete={handleDeleteCollection}
        onFileSelect={handleFileChange}
        onUploadClick={handleUploadClick}
        isDeleting={isDeleting}
        isUploading={isUploading}
      />
    </aside>
  );
};
