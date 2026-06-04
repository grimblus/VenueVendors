import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "@/components/ui/provider"
import { AuthProvider } from "@/context/AuthContext";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  )
}