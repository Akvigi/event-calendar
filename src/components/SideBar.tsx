import {
  BarChart3,
  Calendar as CalendarIcon,
  FileText,
  HelpCircle,
  Home,
  Mail,
  MessageSquare,
  Package,
  Settings,
  Users,
} from 'lucide-react';
import cn from '../helpers/cn.ts';

const SideBar = () => {
  const menuItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: BarChart3, label: 'Dashboard', active: false },
    { icon: Mail, label: 'Inbox', active: false },
    { icon: Package, label: 'Products', active: false },
    { icon: FileText, label: 'Invoices', active: false },
    { icon: Users, label: 'Customers', active: false },
    { icon: MessageSquare, label: 'Chat Room', active: false },
    { icon: CalendarIcon, label: 'Calendar', active: true },
    { icon: HelpCircle, label: 'Help Center', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <menu className="h-screen w-[260px] text-white flex flex-col p-0 m-0 bg-[#43425D]">
      {/* Header */}
      <div className="px-6 py-7 bg-[#0000001A]">
        <h1 className="text-white font-medium tracking-[0.3em] text-sm">
          IMPEKABLE
        </h1>
      </div>

      <nav className="flex-1 ">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={'#'}
            className={cn(
              `
              flex items-center gap-5 px-4 py-5 cursor-pointer
              transition-colors duration-200 border-l-5
            `,
              {
                'border-transparent hover:bg-[#0000001A]': !item.active,
                'border-[#A3A0FB] bg-[#0000001A]': item.active,
              }
            )}
          >
            <item.icon
              className={cn('w-5 h-5 text-gray-300', {
                'text-[#A3A0FB]': item.active,
              })}
            />
            <span className="text-gray-200 text-sm font-normal">
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </menu>
  );
};

export default SideBar;
