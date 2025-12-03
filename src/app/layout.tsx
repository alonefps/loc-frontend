import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Locations - Explore e Navegue",
  description: "Descubra locais incríveis e navegue até eles com facilidade. Planeje rotas, avalie locais e ganhe recompensas!",
  keywords: ["locations", "mapas", "rotas", "navegação", "locais", "lugares"],
  authors: [{ name: "Locations Team" }],
  openGraph: {
    title: "Locations - Explore e Navegue",
    description: "Descubra locais incríveis e navegue até eles com facilidade",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Locations - Explore e Navegue",
    description: "Descubra locais incríveis e navegue até eles com facilidade",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans bg-neutral-950 text-white">
        {children}
      </body>
    </html>
  );
}
