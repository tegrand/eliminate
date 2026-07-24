import { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonCard, 
  SkeletonTableRow 
} from "./index";

export default function SkeletonDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Skeleton Component Demo</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Basic Primitives</h2>
        <div className="space-y-4 max-w-md">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-32 w-full" rounded />
          <Skeleton className="h-12 w-12" circle />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Text Blocks</h2>
        <div className="space-y-8 max-w-md">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Single Line</p>
            <SkeletonText lines={1} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Paragraph (4 lines)</p>
            <SkeletonText lines={4} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Avatars</h2>
        <div className="flex items-center space-x-6">
          <SkeletonAvatar size="sm" />
          <SkeletonAvatar size="md" />
          <SkeletonAvatar size="lg" />
          <SkeletonAvatar size="xl" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Data Tables</h2>
        <div className="border border-gray-200 rounded-lg p-4 max-w-3xl space-y-2">
          {/* Header */}
          <div className="flex space-x-4 border-b border-gray-100 pb-3 mb-3">
            <span className="w-1/3 text-xs font-medium text-gray-400">NAME</span>
            <span className="w-1/4 text-xs font-medium text-gray-400">ROLE</span>
            <span className="w-1/4 text-xs font-medium text-gray-400">STATUS</span>
            <span className="w-1/4 text-xs font-medium text-gray-400">ACTIONS</span>
          </div>
          {/* Rows */}
          <SkeletonTableRow columns={4} />
          <SkeletonTableRow columns={4} />
          <SkeletonTableRow columns={4} />
          <SkeletonTableRow columns={4} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Cards & Widgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <SkeletonCard />
          <SkeletonCard />
          
          <div className="col-span-1 md:col-span-2 rounded-xl border border-gray-200 p-6 flex items-center justify-between">
            <div className="space-y-2 w-1/2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
