import type { Metadata } from "next"
import "./latex.min.css"
import "./dossier.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://spp3.steg.eth.link"),
  title: "Steg — SPP3 Dossier",
  description: "Steg's SPP3 application dossier: overview, proposal, live roadmap, evidence, and changelog.",
  openGraph: {
    title: "Steg — SPP3 Dossier",
    description: "Live application dossier for the ENS Service Provider Program (SPP3).",
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
      </head>
      <body>
        <div className="spp3-dossier">{children}</div>
      </body>
    </html>
  )
}
