import { Select } from "./index";

const countryOptions = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "India", value: "in" },
  { label: "Canada", value: "ca" },
];

const roleOptions = [
  { label: "Administrator", value: "admin" },
  { label: "Worker", value: "worker" },
  { label: "Client", value: "client" },
  { label: "Agency", value: "agency" },
];

export default function SelectDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Select Component Demo</h1>

      {/* Basic Variations */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Basic Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Select 
            label="Default Select" 
            options={countryOptions}
          />
          <Select 
            label="With Placeholder" 
            placeholder="Select a country..."
            options={countryOptions}
            defaultValue=""
          />
          <Select 
            label="Required Select" 
            placeholder="Please choose a role"
            options={roleOptions}
            required 
            defaultValue=""
          />
          <Select 
            label="Disabled Select" 
            placeholder="Cannot interact"
            options={roleOptions}
            disabled 
            defaultValue=""
          />
        </div>
      </section>

      {/* Validation & Feedback */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Validation & Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Select 
            label="With Helper Text" 
            placeholder="Select your primary role"
            options={roleOptions}
            helperText="This role determines your access level."
            defaultValue=""
          />
          <Select 
            label="With Error State" 
            placeholder="Select your primary role"
            options={roleOptions}
            error="Please select a valid role to continue."
            defaultValue=""
          />
        </div>
      </section>
    </div>
  );
}
