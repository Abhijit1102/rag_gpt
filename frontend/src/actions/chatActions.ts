"use server";

interface ChatRequest {
  message: string;
  thread_id?: string | null;
}

interface ChatResponse {
  reply: string;
  thread_id: string;
}

export async function sendChat({ message, thread_id }: ChatRequest): Promise<ChatResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${API_BASE}/llm/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, thread_id }),
  });

  if (!res.ok) throw new Error("Failed to fetch AI response");

  return res.json();
}
