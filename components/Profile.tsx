
import React, { useState, useEffect } from 'react';
import { User, Mail, Award, Medal, Target, Edit2, CheckCircle2, Trophy, Zap, Star, Share2, MapPin, Calendar, Plus, Camera, Trash2, X, TrendingUp, TrendingDown, Minus, ChevronRight, Crown } from 'lucide-react';
import { UserProfile } from '../types';

// Constants for Badges and Challenges
const BADGES = [
  { id: 1, name: 'Fast Learner', icon: <Zap size={20} className="text-yellow-500" />, desc: 'Completed 5 quizzes in 1 hour', earned: true },
  { id: 2, name: 'Team Player', icon: <User size={20} className="text-blue-500" />, desc: 'Joined 3 study groups', earned: true },
  { id: 3, name: 'Top Scorer', icon: <Trophy size={20} className="text-purple-500" />, desc: 'Ranked #1 in a weekly challenge', earned: false },
  { id: 4, name: 'Dedicated', icon: <Award size={20} className="text-red-500" />, desc: 'Logged in 7 days in a row', earned: true },
  { id: 5, name: 'Innovator', icon: <Star size={20} className="text-orange-500" />, desc: 'Submitted a winning project', earned: false },
];

const CHALLENGES = [
  { id: 1, title: 'Complete Physics Module 3', progress: 80, total: 100, reward: '50 XP', deadline: '2h left' },
  { id: 2, title: 'Attend "AI for Good" Webinar', progress: 0, total: 1, reward: '20 XP', deadline: 'Tomorrow' },
  { id: 3, title: 'Post in 3 Discussion Forums', progress: 1, total: 3, reward: '30 XP', deadline: 'Weekly' },
];

// Competitors for dynamic leaderboard
const COMPETITORS = [
  { id: 101, name: 'Sarah J.', points: 1200, avatar: 'https://i.pravatar.cc/150?u=1', trend: 'up' },
  { id: 102, name: 'Mike T.', points: 980, avatar: 'https://i.pravatar.cc/150?u=2', trend: 'down' },
  { id: 103, name: 'Jessica L.', points: 420, avatar: 'https://i.pravatar.cc/150?u=4', trend: 'same' },
  { id: 104, name: 'David W.', points: 350, avatar: 'https://i.pravatar.cc/150?u=5', trend: 'up' },
  { id: 105, name: 'Alex K.', points: 1100, avatar: 'https://i.pravatar.cc/150?u=8', trend: 'up' },
];

interface ProfileProps {
  userPoints: number;
  setUserPoints: React.Dispatch<React.SetStateAction<number>>;
  user: UserProfile;
  activities: string[];
  setActivities: React.Dispatch<React.SetStateAction<string[]>>;
}

const Profile: React.FC<ProfileProps> = ({ userPoints, setUserPoints, user, activities, setActivities }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('Passionate about Computer Science and Physics. Always looking for new study partners and hackathons! 🚀');
  const [avatar, setAvatar] = useState(user.avatar);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements'>('overview');
  
  // Gamification & Activity State
  const [subjects] = useState(['Physics II', 'Computer Studies', 'Calculus', 'Digital Logic']);
  const [newActivity, setNewActivity] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  // Dynamic Calculations
  const level = Math.floor(userPoints / 500) + 1;
  const xpForNextLevel = 500;
  const currentLevelProgress = userPoints % 500;
  const progressPercent = (currentLevelProgress / xpForNextLevel) * 100;
  
  // Rank Title Logic
  const getRankTitle = (lvl: number) => {
      if (lvl >= 10) return 'Legend';
      if (lvl >= 5) return 'Master';
      if (lvl >= 3) return 'Expert';
      if (lvl >= 2) return 'Contributor';
      return 'Novice';
  };
  const rankTitle = getRankTitle(level);

  // Dynamic Leaderboard Calculation
  const leaderboard = [
      ...COMPETITORS.map(c => ({ ...c, isUser: false })),
      { id: 999, name: user.name, points: userPoints, avatar: avatar, trend: 'up', isUser: true }
  ].sort((a, b) => b.points - a.points);

  const userRank = leaderboard.findIndex(u => u.isUser) + 1;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setActivities([...activities, newActivity.trim()]);
      setNewActivity('');
      setIsAddingActivity(false);
      // Gamification: Award XP
      setUserPoints(prev => prev + 50);
    }
  };

  const handleRemoveActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const getTrendIcon = (trend: string) => {
      if (trend === 'up') return <TrendingUp size={12} className="text-green-500" />;
      if (trend === 'down') return <TrendingDown size={12} className="text-red-500" />;
      return <Minus size={12} className="text-gray-400" />;
  };

  const getRankDisplay = (index: number) => {
      if (index === 0) return <div className="bg-yellow-100 text-yellow-600 p-1 rounded-lg"><Crown size={16} /></div>;
      if (index === 1) return <div className="bg-gray-100 text-gray-500 p-1 rounded-lg"><Medal size={16} /></div>;
      if (index === 2) return <div className="bg-orange-100 text-orange-500 p-1 rounded-lg"><Medal size={16} /></div>;
      return <span className="font-bold text-gray-400 w-6 text-center">{index + 1}</span>;
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* Profile Header Card with Stats */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden mb-6">
        {/* Cover Image */}
        <div className="h-36 bg-gradient-to-r from-[#5B21B6] to-[#9333EA] relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition">
                <Share2 size={18} />
            </button>
        </div>
        
        <div className="px-6 md:px-10 pb-8 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-14 mb-6 gap-6">
                
                {/* Avatar with Upload */}
                <div className="relative group">
                    <div className="h-28 w-28 rounded-full p-1 bg-white relative shadow-lg ring-4 ring-white/50">
                        <img src={avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        {/* Hover Overlay */}
                        <label className="absolute inset-0 m-1 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                            <Camera className="text-white drop-shadow-md" size={24} />
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </label>
                    </div>
                    <div className="absolute bottom-2 right-1 bg-green-500 h-5 w-5 rounded-full border-2 border-white z-10 pointer-events-none shadow-sm"></div>
                </div>

                <div className="flex-1 w-full">
                    <div className="flex justify-between items-start w-full">
                         <div>
                            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 flex items-center gap-2 text-sm font-medium mt-1">
                                {user.role} <span className="text-gray-300">•</span> <MapPin size={14}/> {user.schoolName}
                            </p>
                         </div>
                         <div className="hidden md:block text-right">
                            <div className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">Current Rank</div>
                            <div className="flex items-center justify-end gap-1 text-yellow-600 font-bold">
                                <Medal size={16} /> #{userRank} Global
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Key User Statistics Card - Grid */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 relative overflow-hidden">
                {/* Decorator */}
                <div className="absolute -top-10 -right-10 bg-primary/5 w-32 h-32 rounded-full blur-2xl"></div>

                {/* Stat 1: Level & Rank */}
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 relative z-10">
                     <div className="bg-violet-100 text-primary p-3 rounded-lg">
                        <Star size={24} />
                     </div>
                     <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Level</p>
                        <p className="text-lg font-bold text-gray-900">Level {level}</p>
                        <p className="text-xs text-primary font-medium">{rankTitle}</p>
                     </div>
                </div>

                {/* Stat 2: Points */}
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 relative z-10">
                     <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                        <Zap size={24} />
                     </div>
                     <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total XP</p>
                        <p className="text-lg font-bold text-gray-900">{userPoints.toLocaleString()} XP</p>
                        <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                            <TrendingUp size={10} /> Top 5%
                        </p>
                     </div>
                </div>

                 {/* Stat 3: Progress */}
                 <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-center relative z-10">
                     <div className="flex justify-between items-end mb-2">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Next Level Progress</p>
                        <p className="text-xs font-bold text-primary">{Math.round(progressPercent)}%</p>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                         <div 
                            className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full transition-all duration-1000 ease-out relative" 
                            style={{ width: `${progressPercent}%` }}
                         >
                             <div className="absolute right-0 top-0 h-full w-2 bg-white/30 animate-pulse"></div>
                         </div>
                     </div>
                     <p className="text-[10px] text-gray-400 text-right">{xpForNextLevel - currentLevelProgress} XP needed</p>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-100 px-6 md:px-10">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`mr-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('achievements')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'achievements' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
                Gamification & Badges
            </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Bio & Info */}
            <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 text-lg">About Me</h3>
                        <button onClick={() => setIsEditing(!isEditing)} className="text-primary hover:bg-primary/5 p-2 rounded-lg transition">
                            <Edit2 size={18} />
                        </button>
                    </div>
                    {isEditing ? (
                        <div>
                            <textarea 
                                value={bio} 
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 outline-none min-h-[100px]"
                            />
                            <button onClick={() => setIsEditing(false)} className="mt-2 bg-primary text-white px-4 py-2 rounded-lg text-sm">Save Bio</button>
                        </div>
                    ) : (
                        <p className="text-gray-600 leading-relaxed">{bio}</p>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                     <h3 className="font-bold text-gray-800 text-lg mb-4">Academic Focus</h3>
                     <div className="flex flex-wrap gap-2">
                        {subjects.map((subj, i) => (
                            <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                                {subj}
                            </span>
                        ))}
                        <button className="border border-dashed border-gray-300 text-gray-400 px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:border-primary hover:text-primary transition">
                            <Plus size={14} /> Add
                        </button>
                     </div>
                </div>
            </div>

            {/* Right: Co-Curricular & Contact */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 text-lg">Co-Curriculars</h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg">+50 XP per activity</span>
                     </div>
                     
                     <div className="space-y-3 mb-4">
                        {activities.map((act, i) => (
                            <div key={i} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 transition group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-accent/10 text-accent p-2 rounded-lg"><Star size={16}/></div>
                                    <span className="text-gray-700 font-medium text-sm">{act}</span>
                                </div>
                                <button 
                                    onClick={() => handleRemoveActivity(i)}
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {activities.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-2">No activities added yet.</p>
                        )}
                     </div>

                     {isAddingActivity ? (
                         <div className="flex items-center gap-2 animate-fade-in">
                             <input 
                                type="text" 
                                value={newActivity}
                                onChange={(e) => setNewActivity(e.target.value)}
                                placeholder="Activity name..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
                             />
                             <button onClick={handleAddActivity} className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90"><CheckCircle2 size={16} /></button>
                             <button onClick={() => setIsAddingActivity(false)} className="bg-gray-200 text-gray-600 p-2 rounded-lg hover:bg-gray-300"><X size={16} /></button>
                         </div>
                     ) : (
                        <button 
                            onClick={() => setIsAddingActivity(true)}
                            className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Add Activity
                        </button>
                     )}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 text-lg mb-4">Contact Info</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-gray-600">
                            <Mail size={16} />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <Calendar size={16} />
                            <span>Joined 2025</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Challenges & Badges */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Active Challenges */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <Target className="text-red-500" /> Weekly Challenges
                    </h3>
                    <div className="space-y-4">
                        {CHALLENGES.map((challenge) => (
                            <div key={challenge.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{challenge.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            Deadline: <span className="text-red-400">{challenge.deadline}</span>
                                        </p>
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                                        +{challenge.reward}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full transition-all" 
                                        style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Badges */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <Medal className="text-yellow-500" /> Badges
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {BADGES.map((badge) => (
                            <div key={badge.id} className={`text-center p-4 rounded-xl border transition-all ${badge.earned ? 'bg-white border-gray-200' : 'bg-gray-50 border-dashed border-gray-200 opacity-60'}`}>
                                <div className={`mx-auto h-12 w-12 flex items-center justify-center rounded-full mb-2 ${badge.earned ? 'bg-gray-100' : 'bg-gray-200 grayscale'}`}>
                                    {badge.icon}
                                </div>
                                <p className="font-bold text-sm text-gray-800">{badge.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Leaderboard */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
                <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                    <Trophy className="text-yellow-500" /> Global Leaderboard
                </h3>
                <div className="space-y-4">
                    {leaderboard.slice(0, 6).map((leaderUser, index) => (
                        <div 
                            key={leaderUser.id} 
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${leaderUser.isUser ? 'bg-primary/5 border border-primary/20 transform scale-[1.02] shadow-sm' : 'hover:bg-gray-50'}`}
                        >
                            <div className="flex-shrink-0">
                                {getRankDisplay(index)}
                            </div>
                            <img src={leaderUser.avatar} alt={leaderUser.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
                            <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm truncate ${leaderUser.isUser ? 'text-primary' : 'text-gray-800'}`}>
                                    {leaderUser.name} {leaderUser.isUser && '(You)'}
                                </p>
                                <p className="text-xs text-gray-500">{leaderUser.points} XP</p>
                            </div>
                            <div className="flex flex-col items-center">
                                {getTrendIcon(leaderUser.trend || 'same')}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 text-center">
                     <p className="text-xs text-gray-400 mb-2">Updates every 24h</p>
                     <button className="w-full py-2 text-sm text-primary font-medium bg-primary/5 rounded-lg hover:bg-primary/10 transition">
                        View Full Rankings
                    </button>
                </div>
            </div>

        </div>
      )}
    </div>
  );
};

export default Profile;
