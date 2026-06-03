"use client"

import { useState } from "react"

// "Read with your agent" prompt box (ETHSKILLS-style). The application.steg.eth.link
// URL in the passed prompt goes live once application.md is pinned to that subname.
export default function CopyPrompt({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="agent-prompt">
      <code className="agent-prompt-text">{prompt}</code>
      <button
        type="button"
        className="agent-prompt-copy"
        aria-label="Copy prompt"
        onClick={() => {
          navigator.clipboard?.writeText(prompt).then(
            () => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1800)
            },
            () => {},
          )
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
        {copied ? "Copied" : "Copy prompt"}
      </button>
    </div>
  )
}
