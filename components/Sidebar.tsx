
import React from 'react';
import { View, UserProfile } from '../types';
import { 
  LayoutDashboard, 
  GraduationCap, 
  MessageSquare, 
  Library, 
  BrainCircuit, 
  Heart, 
  Settings,
  User,
  Instagram,
  Star,
  Building2,
  Presentation,
  PenTool
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userPoints: number;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen, userPoints, user }) => {
  
  const isEducator = user.role === 'Educator';

  // Shared Items
  const commonItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: View.MESSAGES, label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: View.RESOURCES, label: 'Resources', icon: <Library size={20} /> },
    { id: View.CHAT_RX, label: 'Chat RX Assistant', icon: <BrainCircuit size={20} /> },
    { id: View.WELLNESS, label: 'Wellness', icon: <Heart size={20} /> },
    { id: View.SCHOOL_INFO, label: 'School Info', icon: <Building2 size={20} /> },
    { id: View.PROFILE, label: 'Profile & Rewards', icon: <User size={20} /> },
    { id: View.SETTINGS, label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Student Specific
  const studentItems = [
    { id: View.CURRICULAR, label: 'Curricular', icon: <GraduationCap size={20} /> },
    { id: View.CO_CURRICULAR, label: 'ChatRX Insta', icon: <Instagram size={20} /> },
  ];

  // Educator Specific
  const educatorItems = [
    { id: View.EDUCATOR_STUDIO, label: 'Educator Studio', icon: <Presentation size={20} /> },
    { id: View.CURRICULAR, label: 'Teaching', icon: <PenTool size={20} /> },
  ];

  // Insert role specific items after Dashboard (index 0)
  const navItems = [
    commonItems[0],
    ...(isEducator ? educatorItems : studentItems),
    ...commonItems.slice(1)
  ];

  // Calculate dynamic level
  const level = Math.floor(userPoints / 500) + 1;
  const progress = ((userPoints % 500) / 500) * 100;
  const levelTitle = level === 1 ? 'Novice' : level === 2 ? 'Contributor' : level === 3 ? 'Expert' : 'Master';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-gradient-to-b from-[#5B21B6] to-[#7C3AED] text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-lg">
              <BrainCircuit className="text-primary h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-tight">Chatrx Stuconnect</h1>
              <p className="text-xs text-white/70">{isEducator ? 'Educator Portal' : 'Student Portal'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${currentView === item.id 
                  ? 'bg-white/20 shadow-lg backdrop-blur-sm font-medium' 
                  : 'hover:bg-white/10 text-white/80 hover:text-white'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => {
              setCurrentView(View.PROFILE);
              setIsOpen(false);
            }}
            className="w-full text-left bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors group"
          >
            <p className="text-sm font-medium mb-1 flex items-center justify-between">
              {user.role}
              <Star size={12} className="text-yellow-300 fill-yellow-300" />
            </p>
            <p className="text-xs text-white/70 mb-3 group-hover:text-white">Lvl {level} {levelTitle}</p>
            <div className="w-full bg-black/20 rounded-full h-1.5">
              <div 
                className="bg-accent h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
