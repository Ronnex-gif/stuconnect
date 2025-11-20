import React, { useState } from 'react';
import { Heart, Coffee, Sun, Moon, Smile, Frown, Meh, PlayCircle, Music } from 'lucide-react';
import { UserProfile } from '../types';

interface WellnessProps {
    user: UserProfile;
}

const Wellness: React.FC<WellnessProps> = ({ user }) => {
  const [mood, setMood] = useState<string | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-rose-400 to-orange-400 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
         <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Good Morning, {firstName}!</h2>
            <p className="text-white/90 text-lg font-light max-w-md">"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
         </div>
         <Sun className="absolute top-4 right-8 text-white/20 h-32 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         {/* Mood Tracker */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <Heart className="text-rose-500" size={20} /> How are you feeling?
            </h3>
            <div className="flex justify-between gap-4 mt-6">
                {[
                    { icon: <Smile size={32} />, label: 'Great', val: 'great', color: 'text-green-500 bg-green-50' },
                    { icon: <Meh size={32} />, label: 'Okay', val: 'okay', color: 'text-yellow-500 bg-yellow-50' },
                    { icon: <Frown size={32} />, label: 'Stressed', val: 'stressed', color: 'text-red-500 bg-red-50' },
                    { icon: <Coffee size={32} />, label: 'Tired', val: 'tired', color: 'text-blue-500 bg-blue-50' },
                ].map((m) => (
                    <button 
                        key={m.val}
                        onClick={() => setMood(m.val)}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${mood === m.val ? 'ring-2 ring-offset-2 ring-primary ' + m.color : 'hover:bg-gray-50 grayscale hover:grayscale-0'}`}
                    >
                        <div className={mood === m.val ? '' : 'text-gray-400'}>{m.icon}</div>
                        <span className="text-xs font-medium text-gray-600">{m.label}</span>
                    </button>
                ))}
            </div>
         </div>

         {/* Focus Timer */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Focus Mode</h3>
                    <p className="text-gray-500 text-sm">25 min pomodoro session</p>
                </div>
                <div className="bg-violet-100 p-2 rounded-lg text-primary">
                    <Moon size={20} />
                </div>
            </div>
            
            <div className="flex items-center justify-center my-4">
                <div className="text-5xl font-mono font-bold text-gray-800">25:00</div>
            </div>

            <button 
                onClick={() => setTimerActive(!timerActive)}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${timerActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-primary text-white hover:bg-primary/90'}`}
            >
                <PlayCircle size={20} /> {timerActive ? 'Stop Focus' : 'Start Session'}
            </button>
         </div>
      </div>

      {/* Resources */}
      <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
              <Music size={24} className="text-indigo-300" />
              <h3 className="text-xl font-bold">Relaxation Sounds</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
              {['Rain', 'Forest', 'Ocean', 'Cafe', 'White Noise', 'Piano'].map(sound => (
                  <button key={sound} className="bg-indigo-800/50 hover:bg-indigo-700 p-3 rounded-lg text-sm font-medium text-indigo-100 transition text-center">
                      {sound}
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Wellness;