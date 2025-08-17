"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-full break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};


// export default function markdownText(markdownText) {
//   return (
//     <div className="p-4 bg-gray-900 min-h-screen text-white">
//       <MarkdownRenderer content={markdownText} />
//     </div>
//   );
// }