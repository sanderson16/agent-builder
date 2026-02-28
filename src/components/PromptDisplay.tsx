"use client";

import { useState, useMemo } from "react";

interface PromptDisplayProps {
  prompt: string;
}

function highlightXml(text: string): (string | { type: "tag" | "bold" | "code"; content: string })[] {
  // Split on XML-like tags, bold markers, and backtick code
  const parts: (string | { type: "tag" | "bold" | "code"; content: string })[] = [];
  // Simple regex approach: find XML tags, **bold**, and `code`
  const regex = /(<\/?[a-z_]+>|\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const m = match[0];
    if (m.startsWith("<")) {
      parts.push({ type: "tag", content: m });
    } else if (m.startsWith("**")) {
      parts.push({ type: "bold", content: m.slice(2, -2) });
    } else if (m.startsWith("`")) {
      parts.push({ type: "code", content: m.slice(1, -1) });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export default function PromptDisplay({ prompt }: PromptDisplayProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => highlightXml(prompt), [prompt]);

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-400">Generated prompt</p>
        <button
          type="button"
          onClick={copy}
          className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
            bg-primary-500 text-white hover:bg-primary-600"
        >
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 overflow-x-auto max-h-[500px] overflow-y-auto">
        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
          {highlighted.map((part, i) => {
            if (typeof part === "string") {
              return <span key={i}>{part}</span>;
            }
            switch (part.type) {
              case "tag":
                return (
                  <span key={i} className="text-primary-400 font-semibold">
                    {part.content}
                  </span>
                );
              case "bold":
                return (
                  <span key={i} className="text-white font-semibold">
                    **{part.content}**
                  </span>
                );
              case "code":
                return (
                  <span key={i} className="text-amber-400">
                    `{part.content}`
                  </span>
                );
              default:
                return <span key={i}>{part.content}</span>;
            }
          })}
        </pre>
      </div>
    </div>
  );
}
