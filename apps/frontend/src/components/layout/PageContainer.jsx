export default function PageContainer({ children }) {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        {children}
      </div>
    </main>
  );
}
