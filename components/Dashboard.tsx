
import React from 'react';
import { BookOpen, Users, MessageCircle, Trophy, ChevronRight, Atom, Monitor, Sparkles, Target, ArrowRight, Instagram, Presentation, FileCheck, BarChart3 } from 'lucide-react';
import { View, UserProfile } from '../types';

interface DashboardProps {
    setView: (view: View) => void;
    userPoints: number;
    user: UserProfile;
    activities: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ setView, userPoints, user, activities }) => {
  const firstName = user.name.split(' ')[0];
  const isEducator = user.role === 'Educator';
  
  // Student Stats
  const studentStats = [
    { label: 'Courses', value: '8', icon: <BookOpen className="text-blue-600" />, color: 'bg-blue-100', action: () => setView(View.CURRICULAR) },
    { label: 'Study Groups', value: '5', icon: <Users className="text-violet-600" />, color: 'bg-violet-100', action: () => setView(View.CURRICULAR) },
    { label: 'Messages', value: '12', icon: <MessageCircle className="text-green-600" />, color: 'bg-green-100', action: () => setView(View.MESSAGES) },
    { label: 'Points', value: userPoints.toString(), icon: <Trophy className="text-yellow-600" />, color: 'bg-yellow-100', action: () => setView(View.PROFILE) },
  ];

  // Educator Stats
  const educatorStats = [
    { label: 'Classes Taught', value: '4', icon: <Presentation className="text-blue-600" />, color: 'bg-blue-100', action: () => setView(View.CURRICULAR) },
    { label: 'Students', value: '142', icon: <Users className="text-violet-600" />, color: 'bg-violet-100', action: () => setView(View.CURRICULAR) },
    { label: 'Pending Review', value: '28', icon: <FileCheck className="text-orange-600" />, color: 'bg-orange-100', action: () => setView(View.EDUCATOR_STUDIO) },
    { label: 'Avg Attendance', value: '94%', icon: <BarChart3 className="text-green-600" />, color: 'bg-green-100', action: () => setView(View.EDUCATOR_STUDIO) },
  ];

  const stats = isEducator ? educatorStats : studentStats;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Welcome back, {firstName} 👋</h2>
           <p className="text-gray-500">
             {isEducator 
               ? "Manage your classes and student progress." 
               : `Explore your learning space at ${user.schoolName}.`}
           </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            onClick={stat.action}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Col */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {isEducator ? <Presentation className="text-primary" size={20}/> : <BookOpen className="text-primary" size={20}/>}
              {isEducator ? "Today's Schedule" : "Curricular"}
            </h3>
            <button 
              onClick={() => setView(View.CURRICULAR)} 
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {/* Schedule / Subjects Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h4 className="font-semibold text-gray-700 mb-4">{isEducator ? "Upcoming Lectures" : "Current Subjects"}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Atom size={18}/></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Physics II</p>
                  <p className="text-xs text-gray-500">{isEducator ? "Lecture Hall A • 2:00 PM" : "Electromagnetism • Next Class 2:00 PM"}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Monitor size={18}/></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Computer Studies</p>
                  <p className="text-xs text-gray-500">{isEducator ? "Lab 3 • 4:00 PM" : "Advanced JS • Assignment Due Today"}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* AI Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2">{isEducator ? "Need a lesson plan?" : "Stuck on a problem?"}</h4>
              <p className="text-indigo-100 mb-4 text-sm">
                {isEducator 
                   ? "Use Educator Studio to generate lesson plans, quizzes, and grading rubrics instantly."
                   : "Ask Chat RX Tutor for instant help with Calculus, Physics, or Coding."}
              </p>
              <button 
                onClick={() => setView(isEducator ? View.EDUCATOR_STUDIO : View.CHAT_RX)}
                className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition"
              >
                {isEducator ? "Open Studio" : "Ask Chat RX"}
              </button>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 text-white/10 h-32 w-32" />
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              {isEducator ? <BarChart3 className="text-green-600" size={20} /> : <Instagram className="text-pink-500" size={20} />}
              {isEducator ? "Quick Analytics" : "ChatRX Insta"}
            </h3>
             {!isEducator && <button 
              onClick={() => setView(View.CO_CURRICULAR)} 
              className="text-primary text-sm font-medium hover:underline"
            >
              View Feed
            </button>}
          </div>

           {/* Secondary Widget */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-700">{isEducator ? "Pending Actions" : "My Active Clubs"}</h4>
                <button onClick={() => setView(View.PROFILE)} className="text-xs text-primary hover:underline">Edit</button>
            </div>
            
            {isEducator ? (
                <div className="space-y-3">
                   <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-800">Grade Physics Lab Reports</span>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">12 Left</span>
                   </div>
                   <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-800">Approve Club Budget</span>
                      <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">Urgent</span>
                   </div>
                </div>
            ) : (
                activities.length > 0 ? (
                  <div className="space-y-4">
                     {activities.slice(0, 3).map((act, idx) => (
                         <div key={idx} className={`border-l-4 pl-4 py-1 ${idx % 2 === 0 ? 'border-accent' : 'border-green-500'}`}>
                           <p className="font-medium text-gray-800">{act}</p>
                           <p className="text-xs text-gray-500 mt-1">Upcoming events this week.</p>
                         </div>
                     ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                      <p className="text-sm">No clubs joined yet.</p>
                      <button onClick={() => setView(View.PROFILE)} className="text-primary text-sm mt-2 hover:underline">Join a club</button>
                  </div>
                )
            )}
          </div>

          {/* Daily Challenge / Tips Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-yellow-400 w-16 h-16 rounded-bl-full opacity-20"></div>
             <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Target className="text-red-500" size={18} /> {isEducator ? "Teaching Tip" : "Daily Challenge"}
             </h4>
             
             {isEducator ? (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                   <p className="text-sm text-gray-600 italic">"Use real-world examples to increase engagement in complex physics topics."</p>
                </div>
             ) : (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                   <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-medium text-gray-800">Complete Physics Module 3</span>
                       <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">50 XP</span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                       <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                   </div>
                   <p className="text-right text-xs text-gray-500">80% Completed</p>
                </div>
             )}

             {!isEducator && (
               <button 
                  onClick={() => setView(View.PROFILE)} 
                  className="mt-3 w-full text-center text-sm text-primary font-medium hover:underline flex items-center justify-center gap-1"
               >
                  View all challenges <ArrowRight size={14} />
               </button>
             )}
          </div>

          {/* Wellness */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
             <div className="bg-red-50 p-3 rounded-full">
                <Trophy className="text-red-500" />
             </div>
             <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Daily Motivation</h4>
                <p className="text-sm text-gray-500 italic">"Stay hydrated and code on! Progress is step by step."</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
