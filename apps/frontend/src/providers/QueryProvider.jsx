import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Retry failed queries 3 times before displaying an error
      refetchOnWindowFocus: false, // Prevent refetching when the user switches browser tabs
      refetchOnMount: false, // Prevent refetching when a component unmounts and remounts
      refetchOnReconnect: true, // Automatically refetch if the user's network reconnects
      staleTime: 2 * 60 * 1000, // Data is considered "fresh" for 2 minutes (no background refetching during this time)
      gcTime: 5 * 60 * 1000, // Unused cached data is garbage collected after 5 minutes to free memory
    },
  },
});

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools are only bundled and visible in development environments */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
