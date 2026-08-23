import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import { SocketProvider } from "./context/SocketContext";
import { AdProvider } from "./contexts/AdContext";

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  return (
    <SocketProvider>
      <AdProvider>
        <Toaster position="top-right" richColors visibleToasts={1} duration={2000} />
        <AppRouter />
      </AdProvider>
    </SocketProvider>
  );
}
