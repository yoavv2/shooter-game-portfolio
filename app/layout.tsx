import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site";
import SoundProvider from "@/components/game/SoundProvider";
import AchievementsProvider from "@/components/game/AchievementsProvider";
import GameLayer from "@/components/game/GameLayer";
import BootIntro from "@/components/game/BootIntro";
import "./globals.css";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Yoav Hevroni — Full-Stack Operative",
  description:
    "Full-stack developer portfolio. React, TypeScript, Node. Production web apps end-to-end with AI-assisted workflows. Based in Tel Aviv, open to work.",
  openGraph: {
    title: "Yoav Hevroni — Full-Stack Operative",
    description:
      "Production web apps end-to-end — React, TypeScript, Node. Open to work.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${chakra.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-base text-ink font-display">
        <SoundProvider>
          <AchievementsProvider>
            <GameLayer />
            <BootIntro />
            {children}
          </AchievementsProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
