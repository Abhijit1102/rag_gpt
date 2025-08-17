"use client";

import { forwardRef, useImperativeHandle, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "@/components/LeftSideBar/LeftSidebarContent";
import { sendChat } from "@/actions/chatActions";

const ChatBot = forwardRef((props, ref) => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useImperativeHandle(ref, () => ({
    startNewChat: () => {
      setMessages([]);
      setThreadId(null);
      localStorage.removeItem("threadId");
      toast.success("🆕 Started a new chat");
    },
    loadThread: (threadId: string, messages: ChatMessage[]) => {
      setThreadId(threadId);
      setMessages(messages);
      localStorage.setItem("threadId", threadId);
    },
  }));

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChat({ message: input, thread_id: threadId });

      if (!threadId) {
        setThreadId(data.thread_id);
        localStorage.setItem("threadId", data.thread_id);
      }

      const assistantMessage: ChatMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center h-screen w-screen bg-[#0E1117] text-[#FAFAFA] font-sans">
      <div className="w-3/5 flex flex-col border-l border-r border-[#444444]">
        {/* Header */}
        <header className="bg-[#262730] border-b border-[#444444] p-4 fixed top-0 w-3/5 z-10">
          <h1 className="text-lg font-bold text-center">🤖 AI ChatBot</h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 mt-[64px] mb-[88px]">
          {messages.length === 0 && (
            <h3 className="text-center text-gray-400 text-2xl font-bold">
              Start a conversation with the AI...
            </h3>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-lg shadow text-lg leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#FF4B4B] text-white rounded-br-none"
                    : "bg-[#262730] text-[#FAFAFA] rounded-bl-none"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="text-lg leading-relaxed font-sans">{children}</p>,
                      code: ({ children }) => (
                        <code className="bg-[#1F1F1F] px-1 py-0.5 rounded font-mono text-sm">{children}</code>
                      ),
                      a: ({ children, href }) => (
                        <a className="text-[#FF4B4B] underline" href={href as string}>
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <span className="font-sans">{msg.content}</span>
                )}
              </div>
            </div>
          ))}

          {/* Loading / AI typing indicator */}
          {loading && (
            <div className="flex justify-start mt-2">
              <div className="bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 
                              text-white px-5 py-3 rounded-2xl shadow-lg text-base flex items-center gap-2">
                <span className="font-medium">AI is responding</span>
                <span className="flex space-x-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce inline-block"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce inline-block"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce inline-block"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-[#444444] px-4 py-3 flex gap-3 bg-[#0E1117] fixed bottom-2 w-3/5 shadow-lg">
          <Input
            className="bg-[#1F1F1F] border border-[#444444] text-[#FAFAFA] text-lg placeholder-gray-400 
                      focus:ring-2 focus:ring-[#FF4B4B] focus:outline-none py-3 px-4 rounded-xl flex-1 font-sans"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            className="bg-[#FF4B4B] hover:bg-[#e64545] text-white text-lg py-3 px-6 rounded-xl shadow-md"
            onClick={handleSend}
            disabled={loading}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ChatBot;
