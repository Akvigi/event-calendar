import {
  Bell,
  ChevronDown,
  HelpCircle,
  MessageSquare,
  Search,
} from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full flex gap-2 items-center">
          <Search className="transform w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions, invoices or help"
            className="w-full  text-sm text-gray-[#4D4F5C]  rounded-md focus:outline-none "
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-8">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 ml-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
          <span className="text-sm text-gray-700 font-medium">John Doe</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="User Avatar"
            className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
