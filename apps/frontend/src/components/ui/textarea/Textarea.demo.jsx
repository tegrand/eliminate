import { Textarea } from "./index";

export default function TextareaDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Textarea Component Demo</h1>

      {/* Basic Textareas */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Basic Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Textarea 
            label="Default Textarea" 
            placeholder="Type your message here..." 
          />
          <Textarea 
            label="Required Textarea" 
            placeholder="This field is required" 
            required 
          />
          <Textarea 
            label="Disabled Textarea" 
            placeholder="Cannot type here" 
            disabled 
            defaultValue="Disabled content..."
          />
          <Textarea 
            label="Read Only Textarea" 
            placeholder="Cannot edit" 
            readOnly 
            defaultValue="Read only data..."
          />
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Row Sizes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Textarea 
            label="2 Rows" 
            placeholder="Short message..." 
            rows={2}
          />
          <Textarea 
            label="6 Rows" 
            placeholder="Longer message..." 
            rows={6}
          />
        </div>
      </section>

      {/* Validation & Feedback */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Validation & Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Textarea 
            label="With Helper Text" 
            placeholder="Enter description"
            helperText="Briefly describe your requirements."
          />
          <Textarea 
            label="With Error State" 
            placeholder="Enter description"
            error="Description cannot be empty."
          />
        </div>
      </section>
    </div>
  );
}
