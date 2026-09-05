import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorker } from "@/components/ServiceWorker";

export const metadata: Metadata = {
  title: "Growth Radar Outreach",
  description: "Персонализированные письма для компаний Growth Radar",
  manifest: "/manifest.webmanifest",
  themeColor: "#171a14"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
