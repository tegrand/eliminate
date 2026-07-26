export default function ResetPasswordFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center space-y-2 mt-8 w-full">
      <p className="text-sm text-gray-500">
        &copy; {currentYear} ELIMINATE. All rights reserved.
      </p>
      <p className="text-xs text-gray-400 font-medium">
        Version 1.0.0 (Beta)
      </p>
    </div>
  );
}
