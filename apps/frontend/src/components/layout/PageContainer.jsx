export default function PageContainer({ children }) {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
      <div className="w-full px-3 sm:px-5 lg:px-6 pt-3 pb-6">
        {children}
      </div>
    </main>
  );
}

