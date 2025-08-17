"use server";

export interface Thread {
  thread_id: string;
  first_human_message: string;
}

export async function fetchThreads(): Promise<Thread[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sidebar/sidebar/threads`);
  if (!res.ok) throw new Error("Failed to fetch threads");
  return res.json();
}

export interface Message {
  type: string;
  content: string;
}

export interface ThreadMessages {
  thread_id: string;
  messages: Message[];
}

export async function fetchMessages(thread_id: string): Promise<ThreadMessages> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sidebar/sidebar/get_messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thread_id }),
  });

  if (!res.ok) throw new Error(`Failed to fetch messages for thread ${thread_id}`);
  return res.json();
}
