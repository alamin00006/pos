import Providers from "@/redux/provider";
import "./globals.css";
import ThemProviders from "./providers";
import { Toaster } from "react-hot-toast";
// import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "POS",
  description: "Converted from Vite to Next.js (App Router).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemProviders>{children}</ThemProviders>
        </Providers>
        {/* 
        <Toaster /> */}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
