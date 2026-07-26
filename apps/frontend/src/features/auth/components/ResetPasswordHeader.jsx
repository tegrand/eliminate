import { Shield } from "lucide-react";

export default function ResetPasswordHeader() {
  return (
    <div className="flex flex-col items-center space-y-3 text-center w-full">
      <div className="rounded-full bg-blue-100 p-4 mb-2 shadow-sm">
        <Shield className="h-10 w-10 text-blue-600" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        ELIMINATE
      </h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        Reset Your Password
      </h2>
      <p className="text-sm font-medium text-gray-500 max-w-sm">
        Please enter and confirm your new password below.
      </p>
    </div>
  );
}
