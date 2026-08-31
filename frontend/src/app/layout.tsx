import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zootickets",
  description: "Ett biljettsystem för att köpa, aktivera och hantera biljetter",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
