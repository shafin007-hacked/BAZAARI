
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App';
import { Message, User, CallType, CallStatus } from '../types';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Search, 
  User as UserIcon,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Monitor,
  Lock,
  ShieldAlert,
  MessageSquare,
  SearchX
} from 'lucide-react';
import { supabase } from '../supabase';

const Messenger: React.FC = () => {
  const { user } = useAppContext();
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCalling, setIsCalling] = useState<CallType | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('ringing');
  const [isTabFocused, setIsTabFocused] = useState(true);

  const screenRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // In a real app, you'd fetch active conversations from Supabase 'messages' table grouped by contact
    const fetchChats = async () => {
      // Dummy search for users to simulate finding people to chat with
      const { data } = await supabase.from('profiles').select('*').limit(5);
      if (data) setChats(data.filter(u => u.id !== user?.id));
    };
    if (user) fetchChats();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat || !user) return;
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedChat.id}),and(sender_id.eq.${selectedChat.id},receiver_id.eq.${user.id})`)
        .order('timestamp', { ascending: true });
      if (data) setMessages(data as Message[]);
    };
    fetchMessages();
  }, [selectedChat, user]);

  const startCall = (type: CallType) => {
    setIsCalling(type);
    setCallStatus('ringing');
    setTimeout(() => setCallStatus('connected'), 2000);
  };

  const endCall = () => {
    setIsCalling(null);
    setCallStatus('ended');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user) return;

    const { data, error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedChat.id,
      content: newMessage
    }).select().single();

    if (!error && data) {
      setMessages([...messages, data as Message]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mt-4">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-black mb-4">Messages</h2>
          <div className="relative">
            <input type="text" placeholder="Search contacts..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 text-sm outline-none" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.length > 0 ? chats.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedChat(c as User)}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${selectedChat?.id === c.id ? 'bg-teal-50 dark:bg-teal-900/20' : 'hover:bg-slate-50'}`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border">
                {c.photo_url ? <img src={c.photo_url} className="rounded-full" /> : <UserIcon className="w-5 h-5 text-slate-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate text-sm">{c.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Online</p>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center">
              <SearchX className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active chats</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {selectedChat ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border">
                  <UserIcon className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white leading-tight">{selectedChat.name}</h3>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startCall('audio')} className="p-2.5 text-slate-500 hover:text-teal-600 rounded-xl"><Phone className="w-5 h-5" /></button>
                <button onClick={() => startCall('video')} className="p-2.5 text-slate-500 hover:text-teal-600 rounded-xl"><Video className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/30">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3.5 rounded-2xl text-sm font-medium shadow-sm ${m.senderId === user?.id ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-tl-none'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {messages.length === 0 && <p className="text-center text-slate-300 text-xs py-10 uppercase tracking-widest font-black">No messages yet</p>}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white dark:bg-slate-900 flex gap-3">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type message..." 
                className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-teal-500" 
              />
              <button type="submit" className="bg-teal-600 text-white p-3 rounded-2xl shadow-lg shadow-teal-600/20"><Send className="w-5 h-5" /></button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <MessageSquare className="w-10 h-10 text-slate-200" />
            <h3 className="text-xl font-black text-slate-800 dark:text-white">Bazaari Messenger</h3>
            <p className="text-slate-500 text-sm font-medium max-w-xs">Select a contact to start trading or negotiating deals.</p>
          </div>
        )}

        {isCalling && (
          <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center">
            <div className="text-center space-y-8">
               <div className="w-40 h-40 rounded-full border-4 border-teal-500 bg-slate-800 flex items-center justify-center mx-auto">
                 <UserIcon className="w-20 h-20 text-slate-600" />
               </div>
               <h4 className="text-white text-3xl font-black">{selectedChat?.name}</h4>
               <p className="text-teal-400 font-bold uppercase tracking-[0.3em] animate-pulse">{callStatus}...</p>
               <button onClick={endCall} className="p-5 bg-red-600 text-white rounded-2xl shadow-xl shadow-red-600/30">
                 <PhoneOff className="w-8 h-8" />
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
