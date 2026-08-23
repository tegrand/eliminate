export default function PageContainer({ children, isWorker, isTransparent }) {
  const transparent = isWorker || isTransparent;
  return (
    <main className={`flex-1 overflow-y-auto scrollbar-hide ${transparent ? "bg-transparent" : "bg-gray-50"}`}>
      <div className="w-full px-4 sm:px-6 pt-1 sm:pt-2 pb-24 sm:pb-8">
        {children}
      </div>
    </main>
  );
}
