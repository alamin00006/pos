import type { AppProps } from "next/app";
import Providers from "@/redux/provider";
import ThemProviders from "@/app/providers";
import "@/app/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <ThemProviders>
        <Component {...pageProps} />
      </ThemProviders>
    </Providers>
  );
}
