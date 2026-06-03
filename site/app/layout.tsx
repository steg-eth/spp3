import type { Metadata } from "next"
import "./latex.min.css"
import "./dossier.css"
import ChatWidget from "./ChatWidget"

export const metadata: Metadata = {
  metadataBase: new URL("https://spp3.steg.eth.link"),
  title: "Steg — ENS Verification and Revocation Toolkit (SPP3)",
  description:
    "Steg's SPP3 application: an open-source ENS-native authorization and verification toolkit (Verifier + AuthResolver, TypeScript SDK, conformance suite) for issuing agent identities as ENS subnames carrying scoped, revocable, currently verifiable authority.",
  openGraph: {
    title: "Steg — ENS Verification and Revocation Toolkit (SPP3)",
    description:
      "SPP3 application for the ENS Service Provider Program (Term 3): ENS-native authority and verification infrastructure for managed agent runtime platforms.",
    url: "https://spp3.steg.eth.link",
    siteName: "Steg",
    type: "article",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js" async />
      </head>
      <body>
        <div className="spp3-dossier">{children}</div>
        <ChatWidget />
      </body>
    </html>
  )
}
