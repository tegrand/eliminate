import { Checkbox } from "./index";

export default function CheckboxDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkbox Component Demo</h1>

      {/* Basic Variations */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Basic Variations</h2>
        <div className="space-y-4 max-w-md">
          <Checkbox 
            label="Default Checkbox" 
          />
          <Checkbox 
            label="Checked by Default" 
            defaultChecked 
          />
          <Checkbox 
            label="Required Checkbox" 
            required 
          />
          <Checkbox 
            label="Disabled (Unchecked)" 
            disabled 
          />
          <Checkbox 
            label="Disabled (Checked)" 
            defaultChecked
            disabled 
          />
        </div>
      </section>

      {/* Validation & Feedback */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Validation & Feedback</h2>
        <div className="space-y-4 max-w-md">
          <Checkbox 
            label="With Helper Text" 
            helperText="We will occasionally send you product updates."
          />
          <Checkbox 
            label="With Error State" 
            error="You must accept the terms and conditions to continue."
          />
        </div>
      </section>

      {/* Checkbox Group Example */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Checkbox Group</h2>
        <div className="space-y-3 max-w-md bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-2">Notification Preferences</p>
          <Checkbox label="Email Notifications" defaultChecked />
          <Checkbox label="SMS Alerts" />
          <Checkbox label="Push Notifications" defaultChecked />
        </div>
      </section>
    </div>
  );
}
