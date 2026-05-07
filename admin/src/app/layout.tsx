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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var color = window.localStorage.getItem("ui:primary-color") || "#16a34a";
                  if (color && color.toLowerCase() === "#f66e2a") color = "#16a34a";
                  if (!/^#([0-9a-fA-F]{6})$/.test(color)) color = "#16a34a";
                  color = color.toLowerCase();
                  var clean = color.replace("#", "");
                  var r = parseInt(clean.slice(0, 2), 16);
                  var g = parseInt(clean.slice(2, 4), 16);
                  var b = parseInt(clean.slice(4, 6), 16);
                  var luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                  var foreground = luminance > 150 ? "#101828" : "#ffffff";
                  var root = document.documentElement;
                  root.style.setProperty("--primary", color);
                  root.style.setProperty("--ring", color);
                  root.style.setProperty("--sidebar-primary", color);
                  root.style.setProperty("--primary-foreground", foreground);
                  root.style.setProperty("--sidebar-primary-foreground", foreground);
                } catch (error) {}
              })();
            `,
          }}
        />
      </head>
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
