import React, { useState } from 'react';
import { 
  User, Bell, Lock, Eye, Globe, HelpCircle, LogOut, 
  ChevronRight, Moon, Sun, Shield, Mail, Smartphone, 
  Check, X, Save, Camera
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
}

type Tab = 'account' | 'preferences' | 'security' | 'support';

const Toggle = ({ label, description, checked, onChange }: { label: string, description?: string, checked: boolean, onChange: (val: boolean) => void }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="pr-4">
      <p className="font-medium text-gray-800 text-sm">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${checked ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span 
        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} 
      />
    </button>
  </div>
);

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [isLoading, setIsLoading] = useState(false);

  // State for form fields
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    schoolName: user.schoolName,
    role: user.role
  });

  const [preferences, setPreferences] = useState({
    emailNotifs: true,
    pushNotifs: true,
    darkMode: false,
    publicProfile: true
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSaveProfile = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onUpdateUser({
        ...user,
        name: formData.name,
        email: formData.email,
        schoolName: formData.schoolName
      });
      setIsLoading(false);
    }, 800);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
       setPasswordData({ current: '', new: '', confirm: '' });
       setIsLoading(false);
       alert("Password updated successfully!");
    }, 1000);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'support', label: 'Support', icon: <HelpCircle size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <img src={user.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
                <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow hover:bg-primary/90">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.role} • {user.schoolName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">School / Institution</label>
                <input 
                  type="text" 
                  value={formData.schoolName}
                  onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>
               <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                <input 
                  type="text" 
                  value={formData.role}
                  disabled
                  className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-70"
              >
                {isLoading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
              <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Bell size={18} className="text-primary" /> Notifications
              </h4>
              <div className="bg-white rounded-xl border border-gray-200 p-4 mt-3 shadow-sm">
                <Toggle 
                  label="Email Notifications" 
                  description="Receive updates about assignments and grades."
                  checked={preferences.emailNotifs}
                  onChange={(v) => setPreferences({...preferences, emailNotifs: v})}
                />
                <Toggle 
                  label="Push Notifications" 
                  description="Get real-time alerts on your device."
                  checked={preferences.pushNotifs}
                  onChange={(v) => setPreferences({...preferences, pushNotifs: v})}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <Eye size={18} className="text-primary" /> Appearance & Privacy
              </h4>
               <div className="bg-white rounded-xl border border-gray-200 p-4 mt-3 shadow-sm">
                <Toggle 
                  label="Dark Mode" 
                  description="Switch to a darker theme for low-light conditions."
                  checked={preferences.darkMode}
                  onChange={(v) => setPreferences({...preferences, darkMode: v})}
                />
                 <Toggle 
                  label="Public Profile" 
                  description="Allow other students to see your badges and rank."
                  checked={preferences.publicProfile}
                  onChange={(v) => setPreferences({...preferences, publicProfile: v})}
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
                <Shield className="text-orange-500 shrink-0" size={24} />
                <div>
                   <h4 className="font-bold text-orange-800 text-sm">Security Recommendation</h4>
                   <p className="text-xs text-orange-600 mt-1">Enable Two-Factor Authentication (2FA) to add an extra layer of security to your account.</p>
                </div>
             </div>

             <form onSubmit={handlePasswordChange} className="space-y-4">
               <h4 className="font-bold text-gray-800">Change Password</h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="password" 
                      required
                      value={passwordData.current}
                      onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="password" 
                      required
                      value={passwordData.new}
                      onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Confirm New Password</label>
                  <div className="relative">
                    <Check className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="password" 
                      required
                      value={passwordData.confirm}
                      onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                   <button 
                      type="submit"
                      disabled={isLoading || !passwordData.current || !passwordData.new}
                      className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-black transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
             </form>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-4 animate-fade-in">
             <div className="bg-blue-50 p-6 rounded-2xl text-center">
                <HelpCircle className="mx-auto text-blue-500 mb-2" size={32} />
                <h3 className="text-lg font-bold text-blue-900">Need Help?</h3>
                <p className="text-blue-700 text-sm mb-4">Our support team is available 24/7 to assist you with any issues.</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition">Contact Support</button>
             </div>

             <div className="space-y-2">
                {['Frequently Asked Questions', 'Report a Bug', 'Terms of Service', 'Privacy Policy'].map((item, i) => (
                  <button key={i} className="w-full flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-left">
                     <span className="font-medium text-gray-700">{item}</span>
                     <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
             </div>

             <div className="text-center text-xs text-gray-400 mt-8">
                <p>Chatrx Stuconnect v1.2.0</p>
                <p>© 2025 Stuconnect Inc.</p>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full max-w-6xl mx-auto pb-8">
      
      {/* Sidebar Menu */}
      <div className="w-full lg:w-64 shrink-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 px-2">Settings</h2>
        
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-gray-200 px-2">
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
           >
              <LogOut size={18} />
              Sign Out
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[500px]">
         <div className="mb-6 border-b border-gray-100 pb-4 lg:hidden">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               {tabs.find(t => t.id === activeTab)?.icon}
               {tabs.find(t => t.id === activeTab)?.label}
            </h2>
         </div>
         {renderContent()}
      </div>

    </div>
  );
};

export default Settings;