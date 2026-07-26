import { Spinner } from "./index";
import { Button } from "../button";
import { Card, CardHeader, CardTitle, CardContent } from "../card";

export default function SpinnerDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Spinner Component Demo</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Sizes</h2>
        <div className="flex flex-wrap gap-8 items-end">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-500">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <span className="text-sm text-gray-500">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-sm text-gray-500">Large</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="xl" />
            <span className="text-sm text-gray-500">Extra Large</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Variants</h2>
        <div className="flex flex-wrap gap-8 items-center bg-gray-200 p-6 rounded-lg">
          <Spinner variant="primary" size="lg" />
          <Spinner variant="secondary" size="lg" />
          <div className="bg-gray-900 p-4 rounded-md">
            <Spinner variant="white" size="lg" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Inside Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button disabled className="gap-2">
            <Spinner size="sm" variant="white" />
            Saving...
          </Button>
          <Button variant="outline" disabled className="gap-2">
            <Spinner size="sm" variant="secondary" />
            Processing
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Inside Cards (Content Loading)</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-12">
            <Spinner size="lg" variant="secondary" />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Centered Page Loader</h2>
        <div className="relative h-64 border-2 border-dashed border-gray-300 rounded-xl bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="xl" />
            <p className="text-gray-500 font-medium">Loading application...</p>
          </div>
        </div>
      </section>
    </div>
  );
}
