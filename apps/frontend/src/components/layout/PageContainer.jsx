export default function PageContainer({ children }) {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
      <div className="w-full px-4 sm:px-6 py-4 sm:py-6 pb-24 sm:pb-8">
        {children}
      </div>
    </main>
  );
}
