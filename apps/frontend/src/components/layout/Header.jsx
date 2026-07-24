export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 flex-shrink-0">
      {/* Mobile/Tablet Menu Button Placeholder */}
      <div className="flex items-center lg:hidden">
        <button className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" aria-label="Open sidebar">
          {/* Hamburger Icon Placeholder */}
          <div className="w-5 flex flex-col gap-1">
            <span className="block w-full h-0.5 bg-gray-500 rounded-full"></span>
            <span className="block w-full h-0.5 bg-gray-500 rounded-full"></span>
            <span className="block w-full h-0.5 bg-gray-500 rounded-full"></span>
          </div>
        </button>
      </div>

      {/* Search Placeholder */}
      <div className="hidden sm:flex items-center flex-1 ml-4 lg:ml-0 max-w-md">
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          {/* Search Icon Placeholder */}
          <div className="absolute left-3 top-2.5 w-4 h-4 rounded-full border-2 border-gray-400"></div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3 ml-auto">
        {/* Notifications Placeholder */}
        <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Notifications">
          <div className="w-5 h-5 rounded-full border-2 border-current"></div>
          {/* Badge placeholder */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Profile Dropdown Placeholder */}
        <button className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-2" aria-label="User profile">
          <div className="w-full h-full bg-gray-300"></div>
        </button>
      </div>
    </header>
  );
}
