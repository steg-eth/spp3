"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// Public config — domainKeys are publishable (each bound to specific origins in
// the OpenAI dashboard); the OpenAI secret key lives only in the backend service.
const CHATKIT_URL =
  process.env.NEXT_PUBLIC_CHATKIT_URL ||
  "https://spp3-dossier-chat-production.up.railway.app/chatkit"

// domainKey is a single string per widget instance (no arrays). ChatKit verifies
// the current page origin against the allowlist for that one key — so we pick the
// key by runtime host. NEXT_PUBLIC_CHATKIT_DOMAIN_KEY overrides if set.
const SPP3_DOMAIN_KEY = "domain_pk_6a1f1279adb48196a2f71fc439aadbd70e14844f90c0eebe" // spp3.steg.eth.link (+ localhost auto-allowed)
const NGROK_DOMAIN_KEY = "domain_pk_699fcf76d15881959c293143daa624fd0896db94a2b47d3f" // ngrok share

function resolveDomainKey(): string {
  const override = process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_KEY
  if (override) return override
  const host = typeof window !== "undefined" ? window.location.hostname : ""
  if (/\.ngrok(-free)?\.(app|io|dev)$/.test(host)) return NGROK_DOMAIN_KEY
  return SPP3_DOMAIN_KEY
}

function buildTheme() {
  const dark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
  return {
    colorScheme: dark ? ("dark" as const) : ("light" as const),
    radius: "soft" as const,
    density: "normal" as const,
    typography: {
      baseSize: 15 as const,
      fontFamily: "'Geist', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      fontFamilyMono: "'IBM Plex Mono', ui-monospace, Menlo, monospace",
    },
    color: { accent: { primary: "#3a6ea5", level: 2 as const } },
  }
}

const OPTIONS = {
  startScreen: {
    greeting: "Ask about Steg's SPP3 application",
    prompts: [
      { label: "What's the funding ask?", prompt: "What is the total requested funding and how is it split across tiers?" },
      { label: "What is the toolkit?", prompt: "What does the Verifier + AuthResolver toolkit actually do?" },
      { label: "Milestones", prompt: "What are the milestones and the delivery timeline?" },
      { label: "Counterfactual", prompt: "What is the counterfactual — what happens without this funding?" },
    ],
  },
  header: { enabled: false },
  composer: { placeholder: "Ask about the dossier…" },
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)
  // The <openai-chatkit> element, created once on first open and kept mounted.
  const elRef = useRef<HTMLElement | null>(null)

  const ensureWidget = useCallback(async () => {
    if (elRef.current || !mountRef.current) return
    if (typeof window === "undefined" || !window.customElements) return
    await window.customElements.whenDefined("openai-chatkit")
    if (elRef.current || !mountRef.current) return
    const el = document.createElement("openai-chatkit") as HTMLElement & {
      setOptions: (o: unknown) => void
    }
    el.style.height = "100%"
    el.style.width = "100%"
    el.setOptions({ api: { url: CHATKIT_URL, domainKey: resolveDomainKey() }, theme: buildTheme(), ...OPTIONS })
    mountRef.current.appendChild(el)
    elRef.current = el
  }, [])

  useEffect(() => {
    if (open) void ensureWidget()
  }, [open, ensureWidget])

  return (
    <div className="spp3-chat" data-open={open}>
      <div className="spp3-chat-panel" role="dialog" aria-label="Ask the dossier" hidden={!open}>
        <div className="spp3-chat-panel-head">
          <span>Ask the dossier</span>
          <button type="button" aria-label="Close chat" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
        <div ref={mountRef} className="spp3-chat-mount" />
      </div>
      <button
        type="button"
        className="spp3-chat-launcher"
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Ask the dossier"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕" : "Ask the dossier"}
      </button>
    </div>
  )
}
