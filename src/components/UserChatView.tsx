import React, { useState, useEffect } from "react";
import { Send, User as UserIcon, Clock, MessageSquareHeart, CheckCheck } from "lucide-react";
import { User, ChatMessage } from "../types";

interface UserChatViewProps {
  currentUser: User | null;
}

export default function UserChatView({ currentUser }: UserChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [nutritionist, setNutritionist] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch a nutritionist and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        
        // Fetch nutritionist
        const nutRes = await fetch("/api/nutritionists", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const nutData = await nutRes.json();
        
        let targetNutritionist = null;
        if (nutData && nutData.length > 0) {
          targetNutritionist = nutData[0]; // Just use the first one for now
          setNutritionist(targetNutritionist);
        }

        // Fetch messages if nutritionist found
        if (targetNutritionist && currentUser) {
          const msgRes = await fetch(`/api/messages/${targetNutritionist.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const msgData = await msgRes.json();
          setMessages(msgData || []);
        }
      } catch (error) {
        console.error("Failed to fetch chat data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      if (!isLoading) {
        fetchData();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !nutritionist || !currentUser) return;

    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: nutritionist.id,
          text: newMessage
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!nutritionist) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto mt-8">
        <UserIcon className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No Nutritionist Available</h3>
        <p className="text-slate-500 mt-2">Currently, there are no nutritionists assigned to your profile. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white dark:bg-slate-950/80 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-300">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 p-6 flex items-center justify-between text-white shrink-0 shadow-md z-10 relative">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
         <div className="flex items-center space-x-4 relative z-10">
           <div className="h-14 w-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-xl shadow-inner backdrop-blur-md">
             {nutritionist.name.charAt(0)}
           </div>
           <div>
             <h2 className="text-xl font-extrabold tracking-tight flex items-center">
               {nutritionist.name}
               <span className="ml-2 px-2 py-0.5 bg-green-900/40 text-green-100 text-[10px] uppercase font-bold rounded-full border border-green-400/30">
                 Nutritionist
               </span>
             </h2>
             <p className="text-green-100/80 text-xs font-medium flex items-center mt-1">
               <span className="w-1.5 h-1.5 bg-green-300 rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_rgba(134,239,172,0.8)]"></span>
               Online and ready to help
             </p>
           </div>
         </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col space-y-4">
        <div className="text-center">
          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium rounded-full">
            Conversation with your nutritionist is private
          </span>
        </div>
        
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[80%] ${isMe ? 'self-end' : 'self-start'}`}
            >
              <div 
                className={`p-4 rounded-2xl shadow-sm text-sm ${
                  isMe 
                    ? 'bg-green-600 text-white rounded-tr-sm border border-green-500' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200 dark:border-slate-700'
                }`}
              >
                {msg.text}
              </div>
              <span className={`text-[10px] text-slate-400 mt-1 flex items-center ${isMe ? 'justify-end' : 'justify-start'}`}>
                {isMe && <CheckCheck className="h-3 w-3 mr-1 text-blue-500" />}
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquareHeart className="h-12 w-12 opacity-20 mb-3" />
            <p>Send a message to start the conversation.</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-5 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0 relative z-10">
        <form onSubmit={handleSendMessage} className="flex space-x-3 items-center">
          <input
            type="text"
            required
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask your nutritionist for advice..."
            className="flex-1 px-5 py-3.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-slate-800 dark:text-white transition-all shadow-inner font-medium placeholder:text-slate-400"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="p-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 text-white rounded-2xl shadow-lg shadow-green-600/30 transition-all flex items-center justify-center cursor-pointer active:scale-95"
          >
            <Send className="h-5 w-5 -ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
