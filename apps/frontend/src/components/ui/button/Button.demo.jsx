import { Mail, ArrowRight, Save, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "./index";

export default function ButtonDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Variants</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sizes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small (sm)</Button>
          <Button size="md">Medium (md)</Button>
          <Button size="lg">Large (lg)</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">States</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button disabled>Disabled Normal</Button>
          <Button loading>Loading...</Button>
          <Button loading leftIcon={<Mail className="w-4 h-4" />}>
            Loading (Hides Icon)
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Icons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button leftIcon={<Mail className="w-4 h-4" />}>With Left Icon</Button>
          <Button rightIcon={<ArrowRight className="w-4 h-4" />}>With Right Icon</Button>
          <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
            Delete Item
          </Button>
          <Button variant="success" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Full Width</h2>
        <div className="w-full max-w-md">
          <Button fullWidth leftIcon={<Save className="w-4 h-4" />}>
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
