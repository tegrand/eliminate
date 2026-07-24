import { Search, Mail, Lock, User, Info, DollarSign } from "lucide-react";
import { Input } from "./index";

export default function InputDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Input Component Demo</h1>

      {/* Basic Inputs */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Basic Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input 
            label="Default Input" 
            placeholder="Type something..." 
          />
          <Input 
            label="Required Input" 
            placeholder="This field is required" 
            required 
          />
          <Input 
            label="Disabled Input" 
            placeholder="Cannot type here" 
            disabled 
            value="Disabled value"
          />
          <Input 
            label="Read Only Input" 
            placeholder="Cannot edit" 
            readOnly 
            value="Read only data"
          />
        </div>
      </section>

      {/* Types */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Input Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input 
            type="email"
            label="Email Address" 
            placeholder="john@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Input 
            type="password"
            label="Password" 
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
          />
          <Input 
            type="search"
            label="Search" 
            placeholder="Search workers..."
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Input 
            type="number"
            label="Amount" 
            placeholder="0.00"
            leftIcon={<DollarSign className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* Validation & Feedback */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Validation & Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input 
            label="With Helper Text" 
            placeholder="Enter username"
            helperText="Username must be at least 5 characters."
            leftIcon={<User className="w-4 h-4" />}
          />
          <Input 
            label="With Error State" 
            placeholder="Enter username"
            error="This username is already taken."
            leftIcon={<User className="w-4 h-4 text-red-500" />}
            defaultValue="admin"
          />
        </div>
      </section>

      {/* Icons */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Icon Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input 
            label="Left Icon" 
            placeholder="Search..."
            leftIcon={<Search className="w-4 h-4" />}
          />
          <Input 
            label="Right Icon" 
            placeholder="Information..."
            rightIcon={<Info className="w-4 h-4" />}
          />
          <Input 
            label="Both Icons" 
            placeholder="Search details..."
            leftIcon={<Search className="w-4 h-4" />}
            rightIcon={<Info className="w-4 h-4" />}
          />
        </div>
      </section>
    </div>
  );
}
