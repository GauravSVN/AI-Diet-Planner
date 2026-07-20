import React, { useState, useEffect } from "react";
import { Users, Search, Activity, FileText, CheckCircle, Clock, ChevronRight, MessageSquare, Plus, Brain, X, Send, CheckCheck, Save, Target, Droplet, Flame } from "lucide-react";
import { User, ChatMessage } from "../types";

interface NutritionistDashboardViewProps {
  currentUser?: User | null;
}

export default function NutritionistDashboardView({ currentUser }: NutritionistDashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<User[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  
  // Modals state
  const [selectedClientPlan, setSelectedClientPlan] = useState<any>(null);
  const [selectedClientProgress, setSelectedClientProgress] = useState<any>(null);
  const [selectedClientChat, setSelectedClientChat] = useState<User | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  
  const [editedPlan, setEditedPlan] = useState<any>(null);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("/api/clients", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setClients(data || []);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const fetchMessages = async () => {
      if (!selectedClientChat) return;
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`/api/messages/${selectedClientChat.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setChatHistory(data || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (selectedClientChat) {
      fetchMessages();
      interval = setInterval(fetchMessages, 5000);
    }
    
    return () => clearInterval(interval);
  }, [selectedClientChat]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invitation sent to ${inviteEmail}!`);
    setInviteEmail("");
    setIsInviteModalOpen(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedClientChat || !currentUser) return;
    
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedClientChat.id,
          text: chatMessage
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setChatHistory([...chatHistory, data.message]);
        setChatMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleReviewPlanClick = async (client: User) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/nutritionist/client/${client.id}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSelectedClientPlan({ ...client, ...data });
      setEditedPlan(data.dietPlan);
    } catch (e) {
      console.error("Failed to load details", e);
    }
  };

  const handleTrackProgressClick = async (client: User) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/nutritionist/client/${client.id}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSelectedClientProgress({ ...client, progressLogs: data.progressLogs });
    } catch (e) {
      console.error("Failed to load progress", e);
    }
  };

  const handleSavePlan = async () => {
    if (!editedPlan) return;
    setIsSavingPlan(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/nutritionist/client/${selectedClientPlan.id}/dietplan`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editedPlan)
      });
      if (res.ok) {
        alert("Diet plan customized & updated successfully!");
        setSelectedClientPlan(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingPlan(false);
    }
  };

  const filteredClients = clients.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 dark:from-slate-900 dark:via-slate-800 dark:to-green-950 p-6 sm:p-8 rounded-3xl border border-green-500/30 dark:border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-semibold">
            <Brain className="h-4 w-4" />
            <span>Nutritionist Portal</span>
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Client Assessments</h2>
          <p className="text-emerald-50 dark:text-slate-300 text-sm max-w-xl">Customize AI-generated plans, monitor client progress, and provide expert human-in-the-loop feedback.</p>
        </div>
        <div className="relative z-10 flex space-x-4">
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shadow-lg">
            <span className="block text-3xl font-black text-white">{clients.length}</span>
            <span className="text-xs text-emerald-50 dark:text-slate-300 uppercase font-bold tracking-wider mt-1 block">Active Clients</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-950/80 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-slate-800 dark:text-white transition-all font-medium"
            />
          </div>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md shadow-green-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            <span>Invite Client</span>
          </button>
        </div>

        {/* Client List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {isLoading ? (
            <div className="col-span-full p-8 text-center text-slate-500">Loading clients...</div>
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div key={client.id} className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10 hover:border-green-300 dark:hover:border-green-700/50 transition-all duration-300 flex flex-col">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 flex items-center justify-center text-green-700 dark:text-green-300 text-xl font-bold shadow-inner shrink-0">
                    {client.name?.charAt(0) || 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">{client.name || 'Unknown'}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1 truncate">
                      {client.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Joined Date</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Status</span>
                    <span className="font-bold text-green-600 dark:text-green-400 flex items-center"><Activity className="h-3 w-3 mr-1"/> Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button 
                    onClick={() => handleReviewPlanClick(client)}
                    className="col-span-1 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 font-semibold rounded-xl text-xs transition-colors border border-green-200 dark:border-green-800/50 flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Diet Plan</span>
                  </button>
                  <button 
                    onClick={() => handleTrackProgressClick(client)}
                    className="col-span-1 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-semibold rounded-xl text-xs transition-colors border border-blue-200 dark:border-blue-800/50 flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Target className="h-4 w-4" />
                    <span>Progress</span>
                  </button>
                  <button 
                    onClick={() => setSelectedClientChat(client)}
                    className="col-span-2 py-2.5 mt-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Message Client</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-slate-500">
              No clients found.
            </div>
          )}
        </div>
      </div>

      {/* Invite Client Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsInviteModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="h-6 w-6" /></div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Invite New Client</h3>
            </div>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="client@example.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-slate-800 dark:text-white transition-all"/>
              <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"><CheckCircle className="h-5 w-5" /><span>Send Invitation</span></button>
            </form>
          </div>
        </div>
      )}

      {/* Diet Plan Customization Modal */}
      {selectedClientPlan && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-700 font-bold">{selectedClientPlan.name.charAt(0)}</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Customize Diet Plan</h3>
                  <p className="text-xs text-slate-500">For {selectedClientPlan.name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClientPlan(null)} className="text-slate-400 hover:text-slate-700 p-2 cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {!editedPlan ? (
                <div className="text-center p-8 text-slate-500">No active diet plan found for this client. They need to complete the assessment.</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Calories</label>
                      <input type="number" value={editedPlan.dailyCalories || 0} onChange={(e) => setEditedPlan({...editedPlan, dailyCalories: Number(e.target.value)})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-white"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Protein (g)</label>
                      <input type="number" value={editedPlan.proteinGrams || 0} onChange={(e) => setEditedPlan({...editedPlan, proteinGrams: Number(e.target.value)})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-white"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Carbs (g)</label>
                      <input type="number" value={editedPlan.carbsGrams || 0} onChange={(e) => setEditedPlan({...editedPlan, carbsGrams: Number(e.target.value)})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-white"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Fat (g)</label>
                      <input type="number" value={editedPlan.fatGrams || 0} onChange={(e) => setEditedPlan({...editedPlan, fatGrams: Number(e.target.value)})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-white"/>
                    </div>
                  </div>

                  <div>
                     <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center text-sm"><Droplet className="h-4 w-4 mr-2 text-blue-500"/> Water Intake (Liters)</h4>
                     <input type="number" step="0.1" value={editedPlan.waterIntakeLitres || 0} onChange={(e) => setEditedPlan({...editedPlan, waterIntakeLitres: Number(e.target.value)})} className="w-full sm:w-1/3 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-white"/>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30 text-sm">
                    <p className="font-bold text-orange-800 dark:text-orange-400 mb-1">Nutritionist Notes / Recommendations</p>
                    <textarea 
                      value={editedPlan.recommendations?.nutritionistNote || ""} 
                      onChange={(e) => setEditedPlan({...editedPlan, recommendations: {...(editedPlan.recommendations||{}), nutritionistNote: e.target.value}})}
                      placeholder="Add custom advice here..."
                      className="w-full mt-2 p-3 bg-white dark:bg-slate-950 border border-orange-200 dark:border-orange-800/50 rounded-lg focus:outline-none focus:border-orange-400 min-h-[100px]"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3 bg-white dark:bg-slate-900">
              <button onClick={() => setSelectedClientPlan(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer">Cancel</button>
              {editedPlan && (
                <button onClick={handleSavePlan} disabled={isSavingPlan} className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl flex items-center shadow-md shadow-green-600/20 disabled:opacity-50 cursor-pointer">
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingPlan ? "Saving..." : "Save Custom Plan"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Monitoring Modal */}
      {selectedClientProgress && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold">{selectedClientProgress.name.charAt(0)}</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Client Progress Log</h3>
                  <p className="text-xs text-slate-500">For {selectedClientProgress.name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClientProgress(null)} className="text-slate-400 hover:text-slate-700 p-2 cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {(!selectedClientProgress.progressLogs || selectedClientProgress.progressLogs.length === 0) ? (
                <div className="text-center p-8 text-slate-500">This client has not logged any progress data yet.</div>
              ) : (
                <div className="space-y-4">
                  {selectedClientProgress.progressLogs.map((log: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                      <div className="font-bold text-slate-700 dark:text-slate-200 w-full sm:w-auto">
                        <Clock className="h-4 w-4 inline-block mr-1 text-slate-400"/>
                        {new Date(log.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 uppercase font-bold">Weight</span>
                          <span className="font-bold text-slate-800 dark:text-white">{log.weight || '--'} kg</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 uppercase font-bold flex items-center"><Droplet className="h-3 w-3 mr-1 text-blue-500"/> Water</span>
                          <span className="font-bold text-slate-800 dark:text-white">{log.waterIntakeMl ? `${(log.waterIntakeMl/1000).toFixed(1)}L` : '--'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 uppercase font-bold flex items-center"><Flame className="h-3 w-3 mr-1 text-orange-500"/> Cal</span>
                          <span className="font-bold text-slate-800 dark:text-white">{log.caloriesConsumed || '--'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {selectedClientChat && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-0 relative animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-700 font-bold">{selectedClientChat.name.charAt(0)}</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">{selectedClientChat.name}</h3>
                  <p className="text-[10px] text-green-500 font-medium flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>Online</p>
                </div>
              </div>
              <button onClick={() => setSelectedClientChat(null)} className="text-slate-400 p-2 bg-white dark:bg-slate-800 rounded-full cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            
            <div className="p-6 h-64 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 flex flex-col space-y-4">
               <div className="text-center text-xs text-slate-400">Chat history is end-to-end encrypted</div>
               {chatHistory.map((msg) => {
                 const isClient = msg.senderId === selectedClientChat.id;
                 return (
                 <div key={msg.id} className={`flex flex-col max-w-[80%] ${isClient ? 'self-start' : 'self-end'}`}>
                   <div className={`p-3 rounded-2xl text-sm shadow-sm ${isClient ? "bg-white dark:bg-slate-800 text-slate-800 border border-slate-200 dark:text-slate-200 dark:border-slate-700" : "bg-green-600 text-white border border-green-500"}`}>
                      {msg.text}
                   </div>
                   <span className={`text-[10px] text-slate-400 mt-1 flex items-center ${isClient ? 'justify-start' : 'justify-end'}`}>
                     {!isClient && <CheckCheck className="h-3 w-3 mr-1 text-blue-500" />}
                     {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                 </div>
                 );
               })}
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex space-x-2">
              <input type="text" required value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none dark:text-white"/>
              <button onClick={handleSendMessage} className="p-3 bg-green-600 text-white rounded-full flex items-center justify-center cursor-pointer"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
