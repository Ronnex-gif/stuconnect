
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChatRX from './components/ChatRX';
import Profile from './components/Profile';
import Curricular from './components/Curricular';
import CoCurricular from './components/CoCurricular';
import Messages from './components/Messages';
import Resources from './components/Resources';
import Wellness from './components/Wellness';
import Settings from './components/Settings';
import SchoolInfo from './components/SchoolInfo';
import Onboarding from './components/Onboarding';
import VisitorPage from './components/VisitorPage';
import EducatorStudio from './components/EducatorStudio';
import { View, UserProfile } from './types';
import { Heart, Loader2 } from 'lucide-react';
import { auth, getUserProfile, logoutUser } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Mock Data for specific UI elements not yet in DB
const INITIAL_ACTIVITIES = ['STEM Challenge 2025', 'Hack4Future', 'Debate Club', 'Robotics'];
const ONLINE_USERS = [
  { id: 1, name: 'Sarah J.', status: 'online', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Mike T.', status: 'busy', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'David W.', status: 'online', avatar: 'https://i.pravatar.cc/150?u=5' },
];

function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Auth State
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPoints, setUserPoints] = useState(450); // In real app, fetch from Firestore
  const [isVisitor, setIsVisitor] = useState(false);

  // Real-time Data State
  const [activities, setActivities] = useState<string[]>(INITIAL_ACTIVITIES);
  const [chatHistory, setChatHistory] = useState<any[]>([]); // Now handled by Messages component via Firestore
  const [onlineUsers, setOnlineUsers] = useState(ONLINE_USERS);

  // 1. Listen for Firebase Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            // User is signed in, fetch profile details from Firestore
            try {
                const profile = await getUserProfile(firebaseUser.uid);
                if (profile) {
                    setUserProfile(profile);
                    // If we stored points in DB, we would set them here
                    // setUserPoints(profile.points || 0); 
                } else {
                    // Fallback if firestore doc missing but auth exists
                    setUserProfile({
                        name: firebaseUser.displayName || 'Student',
                        email: firebaseUser.email || '',
                        role: 'Student',
                        schoolName: 'Chatrx University',
                        avatar: firebaseUser.photoURL || 'https://i.pravatar.cc/150'
                    });
                }
            } catch (e) {
                console.error("Error fetching profile", e);
            }
            // Reset visitor mode if logged in
            setIsVisitor(false);
        } else {
            // User is signed out
            setUserProfile(null);
        }
        setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Simulate real-time user status updates (Mock for now)
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev.map(u => ({
        ...u,
        status: Math.random() > 0.7 ? (u.status === 'online' ? 'busy' : 'online') : u.status
      })));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentView(View.DASHBOARD);
    setIsVisitor(false);
  };

  if (loadingAuth) {
      return (
          <div className="h-screen w-full flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-4">
                 <Loader2 className="h-10 w-10 text-primary animate-spin" />
                 <p className="text-gray-500 font-medium">Connecting to Chatrx...</p>
              </div>
          </div>
      );
  }

  // If no user profile is set, show Onboarding or Visitor Page
  if (!userProfile) {
    if (isVisitor) {
      return <VisitorPage onLoginClick={() => setIsVisitor(false)} />;
    }
    return (
      <Onboarding 
        onComplete={(profile) => setUserProfile(profile)} 
        onVisitorClick={() => setIsVisitor(true)}
      />
    );
  }

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard 
            setView={setCurrentView} 
            userPoints={userPoints} 
            user={userProfile} 
            activities={activities}
          />
        );
      case View.CURRICULAR:
        return <Curricular isEducator={userProfile.role === 'Educator'} setView={setCurrentView} />;
      case View.CO_CURRICULAR:
        return (
          <CoCurricular 
            currentUser={userProfile}
            onlineUsers={onlineUsers}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            userActivities={activities}
          />
        );
      case View.MESSAGES:
        return (
          <Messages 
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            onlineUsers={onlineUsers}
            currentUser={userProfile}
          />
        );
      case View.RESOURCES:
        return <Resources />;
      case View.CHAT_RX:
        return <ChatRX />;
      case View.WELLNESS:
        return <Wellness user={userProfile} />;
      case View.SCHOOL_INFO:
        return <SchoolInfo user={userProfile} />;
      case View.PROFILE:
        return (
          <Profile 
            userPoints={userPoints} 
            setUserPoints={setUserPoints} 
            user={userProfile}
            activities={activities}
            setActivities={setActivities}
          />
        );
      case View.SETTINGS:
        return <Settings user={userProfile} onUpdateUser={setUserProfile} onLogout={handleLogout} />;
      case View.EDUCATOR_STUDIO:
        return <EducatorStudio />;
      default:
        return (
          <Dashboard 
            setView={setCurrentView} 
            userPoints={userPoints} 
            user={userProfile} 
            activities={activities}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        userPoints={userPoints}
        user={userProfile}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setSidebarOpen={setSidebarOpen} 
          setView={setCurrentView} 
          user={userProfile} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="min-h-[calc(100vh-12rem)]">
            {renderView()}
          </div>

          <footer className="mt-12 py-8 border-t border-gray-200/60">
            <div className="flex flex-col items-center justify-center space-y-3">
              <p className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                Made with <Heart size={16} className="fill-red-500 text-red-500 animate-pulse" /> by 
                <span className="text-gray-900 font-bold">Ronnex</span> 
                from 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-extrabold">Ronnex Techs</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                <a href="mailto:contact@ronnextechs.com" className="hover:text-primary transition">contact@ronnextechs.com</a>
                <span className="text-gray-300">•</span>
                <span>+254 700 123 456</span>
                <span className="text-gray-300">•</span>
                <span>Kabale,Uganda</span>
              </div>
              <p className="text-[10px] text-gray-300">© 2025 Chatrx Stuconnect. All rights reserved.</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
