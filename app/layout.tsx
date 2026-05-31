import type { Metadata } from "next";
import "../src/styles/globals.css";
import { ConditionalShell } from "@/components/layout/ConditionalShell";

export const metadata: Metadata = {
  title: "EduLynx Think Tank — Academic Opportunity Dashboard",
  description: "Premium academic intelligence platform for IB Diploma students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-warm min-h-screen flex flex-col">
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
