import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import { SocketProvider } from "./context/SocketContext";
import { AdProvider } from "./contexts/AdContext";

export default function App() {
  return (
    <SocketProvider>
      <AdProvider>
        <Toaster position="top-right" richColors visibleToasts={1} duration={2000} />
        <AppRouter />
      </AdProvider>
    </SocketProvider>
  );
}
