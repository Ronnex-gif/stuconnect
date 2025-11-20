
import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, PlusSquare, X, Minimize2, User, Circle, UserPlus, Sparkles, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';
import { sendMessageToFirestore, subscribeToMessages, auth } from '../services/firebase';

// Mock Data
const STORIES = [
  { id: 1, name: 'Your Story', img: 'https://picsum.photos/200', isUser: true },
  { id: 2, name: 'Robotics', img: 'https://images.unsplash.com/photo-1561557944-6e7860d9a7db?auto=format&fit=crop&w=200&q=80', hasStory: true },
  { id: 3, name: 'Debate', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=200&q=80', hasStory: true },
  { id: 4, name: 'CampusNews', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80', hasStory: true },
  { id: 5, name: 'ArtClub', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=200&q=80', hasStory: true },
  { id: 6, name: 'Hackathon', img: 'https://images.unsplash.com/photo-1504384308090-c54be385263d?auto=format&fit=crop&w=200&q=80', hasStory: true },
];

const POSTS = [
  {
    id: 1,
    user: 'Robotics Club',
    location: 'Innovation Lab',
    avatar: 'https://images.unsplash.com/photo-1561557944-6e7860d9a7db?auto=format&fit=crop&w=100&q=80',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    likes: 124,
    caption: 'Our new drone prototype is finally flying! 🚁 Come check it out at the Innovation Lab tomorrow at 2 PM. #Robotics #Innovation #STEM',
    time: '2 hours ago',
    liked: true
  },
  {
    id: 2,
    user: 'Student Council',
    location: 'Main Campus Hall',
    avatar: 'https://ui-avatars.com/api/?name=Student+Council&background=random',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    likes: 89,
    caption: 'Hack4Future registration is OPEN! 🚀 Don\'t miss out on the biggest tech event of the semester. Link in bio.',
    time: '5 hours ago',
    liked: false
  },
  {
    id: 3,
    user: 'Sarah Jenkins',
    location: 'Central Library',
    avatar: 'https://i.pravatar.cc/150?u=1',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    likes: 45,
    caption: 'Late night study session with the group. Coffee is our fuel! ☕📚 #FinalsWeek #StudyGrind',
    time: '8 hours ago',
    liked: false
  }
];

// Simulated Database of users to find matches from
const MOCK_USER_DB = [
    { id: 201, name: 'Alex Rivera', school: 'Chatrx University', interests: ['Robotics', 'Coding', 'STEM Challenge 2025'], avatar: 'https://i.pravatar.cc/150?u=201' },
    { id: 202, name: 'Maria Garcia', school: 'Chatrx University', interests: ['Debate', 'Politics', 'Debate Club'], avatar: 'https://i.pravatar.cc/150?u=202' },
    { id: 203, name: 'Kenji Sato', school: 'Chatrx University', interests: ['Hack4Future', 'AI'], avatar: 'https://i.pravatar.cc/150?u=203' },
    { id: 204, name: 'Lisa Kudrow', school: 'Other U', interests: ['Drama', 'Art'], avatar: 'https://i.pravatar.cc/150?u=204' },
    { id: 205, name: 'Jordan Lee', school: 'Chatrx University', interests: ['Physics', 'Science'], avatar: 'https://i.pravatar.cc/150?u=205' },
];

interface CoCurricularProps {
    currentUser: UserProfile;
    onlineUsers: any[];
    chatHistory: any[];
    setChatHistory: React.Dispatch<React.SetStateAction<any[]>>;
    userActivities: string[];
}

const ChatRXInsta: React.FC<CoCurricularProps> = ({ currentUser, onlineUsers, chatHistory, setChatHistory, userActivities }) => {
  const [posts, setPosts] = useState(POSTS);
  const [activeChatUser, setActiveChatUser] = useState<any | null>(null);
  const [miniChatInput, setMiniChatInput] = useState('');
  const miniChatScrollRef = useRef<HTMLDivElement>(null);

  // Calculate Suggestions based on Similarities
  const getSmartSuggestions = () => {
      return MOCK_USER_DB.map(user => {
          let score = 0;
          let reasons: string[] = [];

          // Check School Match
          if (user.school === currentUser.schoolName) {
              score += 1;
              reasons.push('Same School');
          }

          // Check Activity/Interest Match
          const sharedInterests = user.interests.filter(interest => 
              userActivities.some(ua => ua.toLowerCase().includes(interest.toLowerCase()) || interest.toLowerCase().includes(ua.toLowerCase()))
          );

          if (sharedInterests.length > 0) {
              score += 2 * sharedInterests.length;
              reasons.push(`Shared: ${sharedInterests[0]}`);
          }

          return { ...user, score, reasons };
      })
      .filter(u => u.score > 0) // Only show relevant people
      .sort((a, b) => b.score - a.score) // Highest relevance first
      .slice(0, 4); // Top 4
  };

  const suggestions = getSmartSuggestions();

  // Subscribe to messages if not already
  useEffect(() => {
      const unsubscribe = subscribeToMessages((msgs) => {
          setChatHistory(msgs);
      });
      return () => unsubscribe();
  }, [setChatHistory]);

  // Auto scroll mini chat
  useEffect(() => {
      if(miniChatScrollRef.current) {
          miniChatScrollRef.current.scrollTop = miniChatScrollRef.current.scrollHeight;
      }
  }, [chatHistory, activeChatUser]);

  const toggleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const openChat = (user: any) => {
      // In a real app, this user object would come from DB with ID. 
      // We are mocking the 'active user' object structure for the chat window
      setActiveChatUser({
          name: user.name || user.user, // handle both suggestion/online objects and post objects
          avatar: user.img || user.avatar,
          id: user.id
      });
  };

  const handleSendMiniMessage = async () => {
        if(!miniChatInput.trim() || !auth.currentUser) return;
        
        const text = miniChatInput;
        setMiniChatInput(''); 
        
        // Sending to general firestore collection for demo simplicity
        await sendMessageToFirestore(text, currentUser.name, auth.currentUser.uid);
  };

  return (
    <div className="h-full flex justify-center animate-fade-in relative">
      <div className="w-full max-w-5xl flex gap-8">
        
        {/* Main Feed Column */}
        <div className="flex-1 max-w-2xl">
          
          {/* Header (Mobile Only) */}
          <div className="md:hidden flex justify-between items-center mb-4 sticky top-0 bg-gray-50 z-10 py-2">
             <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: 'billabong, cursive' }}>
               ChatRX Insta
             </h2>
             <div className="flex gap-4">
                <PlusSquare size={24} />
                <Heart size={24} />
                <MessageCircle size={24} />
             </div>
          </div>

          {/* Stories */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 min-w-max">
              {STORIES.map((story) => (
                <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className={`w-16 h-16 rounded-full p-[2px] ${story.isUser ? '' : 'bg-gradient-to-tr from-yellow-400 to-pink-600'}`}>
                    <div className="bg-white rounded-full p-[2px] w-full h-full">
                       <img src={story.img} alt={story.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    {story.isUser && (
                       <div className="absolute bottom-7 right-0 bg-blue-500 text-white rounded-full p-[2px] border-2 border-white">
                          <PlusSquare size={12} />
                       </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 truncate w-16 text-center">{story.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6 pb-10">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Post Header */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => openChat(post)}>
                    <img src={post.avatar} alt={post.user} className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-primary transition" />
                    <div>
                       <p className="text-sm font-bold text-gray-900 leading-none hover:underline">{post.user}</p>
                       {post.location && <p className="text-xs text-gray-500 mt-0.5">{post.location}</p>}
                    </div>
                  </div>
                  <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
                </div>

                {/* Post Image */}
                <div className="w-full aspect-square sm:aspect-video bg-gray-100 relative">
                   <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                </div>

                {/* Post Actions */}
                <div className="p-3">
                  <div className="flex justify-between mb-2">
                    <div className="flex gap-4">
                      <button onClick={() => toggleLike(post.id)} className="hover:opacity-60 transition">
                         <Heart size={24} className={post.liked ? 'fill-red-500 text-red-500' : 'text-gray-800'} />
                      </button>
                      <button onClick={() => openChat(post)} className="hover:opacity-60 transition" title="Message">
                         <MessageCircle size={24} className="text-gray-800" />
                      </button>
                      <button className="hover:opacity-60 transition">
                         <Send size={24} className="text-gray-800" />
                      </button>
                    </div>
                    <button className="hover:opacity-60 transition">
                       <Bookmark size={24} className="text-gray-800" />
                    </button>
                  </div>
                  
                  <p className="font-bold text-sm mb-1">{post.likes} likes</p>
                  
                  <div className="text-sm">
                    <span className="font-bold mr-2">{post.user}</span>
                    <span className="text-gray-800">{post.caption}</span>
                  </div>

                  <p className="text-gray-400 text-[10px] uppercase mt-2 tracking-wide">{post.time}</p>
                </div>

                {/* Comment Input */}
                <div className="px-3 py-3 border-t border-gray-100 flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="flex-1 text-sm outline-none placeholder-gray-400"
                  />
                  <button className="text-blue-500 font-bold text-sm opacity-50 hover:opacity-100">Post</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar (Desktop) */}
        <div className="hidden lg:block w-80 space-y-6 sticky top-4 h-fit">
           {/* User Profile Mini */}
           <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                 <img src={currentUser.avatar} alt="User" className="w-12 h-12 rounded-full border border-gray-200" />
                 <div>
                    <p className="font-bold text-sm text-gray-900">{currentUser.name}</p>
                    <p className="text-gray-500 text-xs">{currentUser.schoolName}</p>
                 </div>
              </div>
              <button className="text-xs font-bold text-blue-500">Switch</button>
           </div>

           {/* Smart Suggestions (Friend Finder) */}
           <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                 <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <Sparkles size={14} className="text-yellow-500 fill-yellow-500" /> Suggested For You
                 </p>
                 <button className="text-xs font-bold text-gray-900">See All</button>
              </div>
              <div className="space-y-4">
                 {suggestions.map((sugg) => (
                    <div key={sugg.id} className="flex justify-between items-center group">
                       <div className="flex items-center gap-3">
                          <img src={sugg.avatar} alt={sugg.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                          <div>
                             <p className="font-bold text-xs text-gray-900 group-hover:text-primary transition-colors cursor-pointer">{sugg.name}</p>
                             <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                                {sugg.reasons[0].includes('School') ? (
                                    <BookOpen size={10} className="text-blue-400" />
                                ) : (
                                    <Heart size={10} className="text-pink-400" />
                                )}
                                <span className="truncate max-w-[120px]">{sugg.reasons[0]}</span>
                             </div>
                          </div>
                       </div>
                       <button className="text-xs font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1">
                           <UserPlus size={14} />
                       </button>
                    </div>
                 ))}
                 {suggestions.length === 0 && (
                     <p className="text-xs text-gray-400 text-center italic">Join more activities to see suggestions!</p>
                 )}
              </div>
           </div>

           {/* Online Users */}
           <div>
              <div className="flex justify-between items-center mb-4 px-2">
                 <p className="font-bold text-gray-500 text-sm flex items-center gap-2">
                     Active Now <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 </p>
              </div>
              <div className="space-y-3">
                 {onlineUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-center px-2 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition" onClick={() => openChat(user)}>
                       <div className="flex items-center gap-3 relative">
                          <div className="relative">
                             <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                             <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-green-500' : 'bg-orange-400'}`}></span>
                          </div>
                          <div>
                             <p className="font-bold text-xs text-gray-900">{user.name}</p>
                             <p className="text-gray-400 text-[10px] capitalize">{user.status}</p>
                          </div>
                       </div>
                       <MessageCircle size={14} className="text-gray-300 hover:text-primary" />
                    </div>
                 ))}
              </div>
           </div>
           
           {/* Footer */}
           <div className="px-2 text-xs text-gray-300 space-y-2">
              <p>About • Help • Press • API • Jobs • Privacy • Terms</p>
              <p>© 2025 CHAT RX INSTA FROM SUCONNECT</p>
           </div>
        </div>
      </div>

      {/* Mini Chat Window */}
      {activeChatUser && (
         <div className="fixed bottom-0 right-4 md:right-10 w-80 bg-white rounded-t-xl shadow-2xl border border-gray-200 z-50 flex flex-col animate-slide-up">
             <div className="bg-primary text-white p-3 rounded-t-xl flex justify-between items-center cursor-pointer" onClick={() => setActiveChatUser(null)}>
                 <div className="flex items-center gap-2">
                     <div className="relative">
                         <img src={activeChatUser.avatar} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                         <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-primary"></span>
                     </div>
                     <div>
                         <p className="font-bold text-sm">{activeChatUser.name}</p>
                         <p className="text-[10px] opacity-80">Active Now</p>
                     </div>
                 </div>
                 <div className="flex gap-2">
                     <button className="hover:text-white/80"><Minimize2 size={16} /></button>
                     <button onClick={(e) => { e.stopPropagation(); setActiveChatUser(null); }} className="hover:text-white/80"><X size={16} /></button>
                 </div>
             </div>
             
             <div className="h-64 bg-gray-50 p-3 overflow-y-auto flex flex-col gap-2" ref={miniChatScrollRef}>
                 {chatHistory.map((msg, i) => {
                     const isMe = msg.senderName === currentUser.name;
                     return (
                         <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[80%] p-2 rounded-lg text-xs ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                                 {msg.text}
                             </div>
                         </div>
                     )
                 })}
             </div>

             <div className="p-2 bg-white border-t border-gray-100">
                 <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                     <input 
                        type="text" 
                        placeholder="Message..." 
                        className="flex-1 bg-transparent text-sm outline-none py-1"
                        value={miniChatInput}
                        onChange={(e) => setMiniChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMiniMessage()}
                        autoFocus
                     />
                     <button 
                        onClick={handleSendMiniMessage} 
                        disabled={!miniChatInput.trim()}
                        className="text-primary font-bold text-xs disabled:opacity-50"
                    >
                        Send
                    </button>
                 </div>
             </div>
         </div>
      )}
    </div>
  );
};

export default ChatRXInsta;
