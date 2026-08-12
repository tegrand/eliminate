import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";
import { SocketProvider } from "./context/SocketContext";

export default function App() {
  return (
    <SocketProvider>
      <Toaster position="top-right" richColors visibleToasts={1} duration={2000} />
      <AppRouter />
    </SocketProvider>
  );
}
