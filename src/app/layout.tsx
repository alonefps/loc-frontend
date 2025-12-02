import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Locations - Explore e Navegue",
  description: "Descubra locais incríveis e navegue até eles com facilidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
