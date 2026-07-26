import { Check, AlertTriangle, Info, XCircle } from "lucide-react";
import { Badge } from "./index";

export default function BadgeDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Badge Component Demo</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Outlined</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="default" outlined>Default</Badge>
          <Badge variant="primary" outlined>Primary</Badge>
          <Badge variant="success" outlined>Success</Badge>
          <Badge variant="danger" outlined>Danger</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Rounded Full</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="default" rounded>Default</Badge>
          <Badge variant="primary" rounded>Primary</Badge>
          <Badge variant="warning" rounded>Warning</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Sizes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge size="sm">Small (sm)</Badge>
          <Badge size="md">Medium (md)</Badge>
          <Badge size="lg">Large (lg)</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">With Icons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="success" icon={<Check className="w-3 h-3" />}>Active</Badge>
          <Badge variant="warning" icon={<AlertTriangle className="w-3 h-3" />}>Pending</Badge>
          <Badge variant="danger" icon={<XCircle className="w-3 h-3" />}>Rejected</Badge>
          <Badge variant="info" icon={<Info className="w-3 h-3" />}>New Update</Badge>
        </div>
      </section>
    </div>
  );
}
