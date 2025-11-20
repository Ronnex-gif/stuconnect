import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Image as ImageIcon, Mic, Circle, Loader2 } from 'lucide-react';
import { subscribeToMessages, sendMessageToFirestore, auth } from '../services/firebase';
import { UserProfile } from '../types';

interface MessagesProps {
    chatHistory: any[];
    setChatHistory: React.Dispatch<React.SetStateAction<any[]>>;
    onlineUsers: any[];
    currentUser: UserProfile;
}

const Messages: React.FC<MessagesProps> = ({ chatHistory, setChatHistory, onlineUsers, currentUser }) => {
  const [activeChat, setActiveChat] = useState<number>(1); // Keeping chat rooms active state for UI
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Setup Realtime Listener
  useEffect(() => {
      setLoadingMessages(true);
      const unsubscribe = subscribeToMessages((msgs) => {
          setChatHistory(msgs);
          setLoadingMessages(false);
      });
      return () => unsubscribe();
  }, [setChatHistory]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
      if(scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [chatHistory, loadingMessages]);

  const contacts = [
    { id: 1, name: 'Global Classroom Chat', lastMsg: 'Everyone: Join us!', time: 'Now', unread: 0, avatar: 'https://ui-avatars.com/api/?name=Global+Class&background=random', type: 'group' },
    { id: 2, name: 'Physics Group', lastMsg: 'Sarah: Did you check question 4?', time: '2m', unread: 3, avatar: 'https://ui-avatars.com/api/?name=Physics+Group&background=random', type: 'group' },
    { id: 3, name: 'Coding Club', lastMsg: 'Admin: Meeting postponed.', time: '1d', unread: 1, avatar: 'https://ui-avatars.com/api/?name=Coding+Club&background=random', type: 'group' },
  ];

  const handleSendMessage = async () => {
      if(!inputText.trim() || !auth.currentUser) return;
      
      const text = inputText;
      setInputText(''); // Optimistic clear

      await sendMessageToFirestore(text, currentUser.name, auth.currentUser.uid);
  };

  // Filter chat history to show messages relevant to "Global Chat" (simplification for this demo)
  // In a full app, messages would have a `chatId` field.
  const currentMessages = chatHistory; 

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-gray-200 overflow-hidden animate-fade-in shadow-sm">
      
      {/* Sidebar List */}
      <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-200 bg-white">
           <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">Messages</h2>
           </div>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
             <input 
               type="text" 
               placeholder="Search chats..." 
               className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
             />
           </div>
        </div>

        {/* Online Users Bar */}
        <div className="p-3 border-b border-gray-100 overflow-x-auto">
            <div className="flex gap-3">
                {onlineUsers.map(u => (
                    <div key={u.id} className="flex flex-col items-center relative">
                        <div className="relative">
                            <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${u.status === 'online' ? 'bg-green-500' : 'bg-red-400'}`}></span>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 truncate w-12 text-center">{u.name.split(' ')[0]}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              onClick={() => setActiveChat(contact.id)}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-gray-100 ${activeChat === contact.id ? 'bg-primary/5 border-r-4 border-primary' : ''}`}
            >
              <div className="relative">
                <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                {contact.type === 'group' && (
                  <div className="absolute -bottom-1 -right-1 bg-gray-200 rounded-full p-[2px] border border-white">
                    <div className="h-2 w-2 bg-gray-600 rounded-full"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                   <h4 className={`text-sm font-semibold truncate ${activeChat === contact.id ? 'text-primary' : 'text-gray-800'}`}>{contact.name}</h4>
                   <span className="text-xs text-gray-400">{contact.time}</span>
                </div>
                <p className={`text-xs truncate ${contact.unread > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && (
                <div className="bg-primary text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-white">
         {/* Chat Header */}
         <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
               <img src={contacts.find(c => c.id === activeChat)?.avatar} alt="" className="h-8 w-8 rounded-full" />
               <div>
                  <h3 className="font-bold text-gray-800">{contacts.find(c => c.id === activeChat)?.name}</h3>
                  <p className="text-xs text-green-500 flex items-center gap-1"><Circle size={6} fill="currentColor" /> Live Chat</p>
               </div>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
               <button className="hover:text-primary"><Phone size={20} /></button>
               <button className="hover:text-primary"><Video size={20} /></button>
               <button className="hover:text-gray-600"><MoreVertical size={20} /></button>
            </div>
         </div>

         {/* Messages */}
         <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4" ref={scrollRef}>
            {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-primary" />
                </div>
            ) : currentMessages.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">No messages yet. Start the conversation!</div>
            ) : (
                currentMessages.map((msg) => {
                    const isMe = msg.senderName === currentUser.name; // Simple name check for demo, implies unique names or use UIDs
                    return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-gray-400 mb-1 px-1">{msg.senderName}</span>
                            <div className={`max-w-md px-4 py-3 shadow-sm ${
                                isMe 
                                ? 'bg-primary text-white rounded-2xl rounded-br-none' 
                                : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none'
                            }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>{msg.time}</p>
                            </div>
                        </div>
                    );
                })
            )}
         </div>

         {/* Input */}
         <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl">
               <button className="p-2 text-gray-500 hover:text-primary transition"><ImageIcon size={20} /></button>
               <input 
                 type="text" 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                 placeholder="Type a message..." 
                 className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 outline-none"
               />
               <button className="p-2 text-gray-500 hover:text-primary transition"><Mic size={20} /></button>
               <button 
                 onClick={handleSendMessage}
                 disabled={!inputText.trim()}
                 className="bg-primary text-white p-2 rounded-lg shadow-md hover:bg-primary/90 transition disabled:opacity-50"
               >
                   <Send size={18} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Messages;