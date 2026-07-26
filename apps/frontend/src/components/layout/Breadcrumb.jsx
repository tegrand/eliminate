export default function Breadcrumb() {
  // Placeholder: Real breadcrumb logic will read the current route location
  return (
    <nav className="mb-6 flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <a href="#" className="hover:text-gray-900 transition-colors">Home</a>
        </li>
        <li>
          <span className="text-gray-400">/</span>
        </li>
        <li>
          <span className="text-gray-900 font-medium" aria-current="page">Current Module</span>
        </li>
      </ol>
    </nav>
  );
}
