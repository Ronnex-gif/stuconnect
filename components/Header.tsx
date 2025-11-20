import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { View, UserProfile } from '../types';

interface HeaderProps {
    setSidebarOpen: (open: boolean) => void;
    setView: (view: View) => void;
    user: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, setView, user }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600">
            <Menu />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search courses, resources..." 
            className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div 
          className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setView(View.PROFILE)}
        >
           <div className="text-right hidden sm:block">
             <p className="text-sm font-semibold text-gray-800">{user.name}</p>
             <p className="text-xs text-gray-500">{user.role}</p>
           </div>
           <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
             <img 
               src={user.avatar} 
               alt="Profile" 
               className="rounded-full h-full w-full object-cover border-2 border-white" 
             />
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;