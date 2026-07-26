import { useState } from "react";
import { Switch } from "./index";

export default function SwitchDemo() {
  const [basic, setBasic] = useState(false);
  const [req, setReq] = useState(true);
  const [helper, setHelper] = useState(false);
  
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Switch Component Demo</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Basic Variations</h2>
        <div className="space-y-4 max-w-md">
          <Switch 
            label="Default Switch" 
            checked={basic}
            onChange={(e) => setBasic(e.target.checked)}
          />
          <Switch 
            label="Required Switch" 
            required 
            checked={req}
            onChange={(e) => setReq(e.target.checked)}
          />
          <Switch 
            label="Disabled (Off)" 
            disabled 
            checked={false}
          />
          <Switch 
            label="Disabled (On)" 
            disabled 
            checked={true}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Validation & Feedback</h2>
        <div className="space-y-4 max-w-md">
          <Switch 
            label="With Helper Text" 
            helperText="Enable two-factor authentication for extra security."
            checked={helper}
            onChange={(e) => setHelper(e.target.checked)}
          />
          <Switch 
            label="With Error State" 
            error="You must agree to the terms."
            checked={false}
          />
        </div>
      </section>
    </div>
  );
}
