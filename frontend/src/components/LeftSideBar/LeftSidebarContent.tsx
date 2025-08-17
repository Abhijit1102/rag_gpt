"use client";

import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchThreads, fetchMessages, Thread } from "@/actions/threadActions";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface LeftSidebarContentProps {
  onSelectThread: (threadId: string, messages: ChatMessage[]) => void;
}

export const LeftSidebarContent: FC<LeftSidebarContentProps> = ({ onSelectThread }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadThreads = async () => {
      setLoading(true);
      try {
        const data = await fetchThreads();
        setThreads(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadThreads();
  }, []);

  const handleThreadClick = async (threadId: string) => {
    setLoading(true);
    try {
      const data = await fetchMessages(threadId);
      const mappedMessages: ChatMessage[] = data.messages.map((msg) => ({
        role: msg.type === "HumanMessage" ? "user" : "assistant",
        content: msg.content,
      }));

      onSelectThread(threadId, mappedMessages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-gray-400 text-center mt-4">Loading...</p>;
  if (threads.length === 0) return <p className="text-gray-400 text-center mt-4">No threads found.</p>;

  return (
    <div className="flex flex-col gap-2 mt-4">
      {threads.map((thread) => (
        <Button
          key={thread.thread_id}
          className="w-full bg-[#262730] hover:bg-[#333] text-white text-sm px-2 py-2 rounded"
          onClick={() => handleThreadClick(thread.thread_id)}
        >
          {thread.first_human_message || "No message"}
        </Button>
      ))}
    </div>
  );
};
