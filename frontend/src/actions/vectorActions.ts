"use server";

export async function fetchVectorInfo(): Promise<Record<string, any>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vectordb/vector_db/info`);
  if (!res.ok) throw new Error("Failed to fetch DB info");
  return res.json();
}

export async function deleteVectorCollection(): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vectordb/vector_db/delete`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete collection");
}

export async function uploadVectorFile(file: File): Promise<{ filename: string; chunks_uploaded: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vectordb/vector_db/upload_pdf`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Unknown upload error");

  return data;
}
