import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";
import StarryBackground from "@/components/StarryBackground";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Registered Disk One Radio",
  description: "Call me a WiFi Pinapple, cause I'm jammin'",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased min-h-screen relative`}
      >
        <StarryBackground />
        <main className="relative z-10">
          {children}
        </main>
        <Toaster 
          toastOptions={{
            style: {
              background: 'var(--background)',
              color: 'var(--foreground)',
              border: '1px solid var(--foreground)',
            },
          }}
        />
      </body>
    </html>
  );
}
