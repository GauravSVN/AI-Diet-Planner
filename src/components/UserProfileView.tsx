import React from "react";
import { 
  User as UserIcon, 
  Shield, 
  Laptop, 
  Settings, 
  Camera, 
  Mail, 
  Phone, 
  Calendar, 
  Lock, 
  Key, 
  Smartphone, 
  Trash2, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  LogOut,
  Loader2,
  Upload
} from "lucide-react";
import { User } from "../types";

interface UserProfileViewProps {
  currentUser: User | null;
  onUpdateProfile: (name: string, email: string) => Promise<void>;
}

export default function UserProfileView({ currentUser, onUpdateProfile }: UserProfileViewProps) {
  const [activeTab, setActiveTab] = React.useState<"overview" | "personal" | "security" | "sessions">("overview");
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(currentUser?.name || "");
  const [editEmail, setEditEmail] = React.useState(currentUser?.email || "");
  
  const [savedPhone, setSavedPhone] = React.useState("");
  const [savedDob, setSavedDob] = React.useState("");
  const [editPhone, setEditPhone] = React.useState("");
  const [editDob, setEditDob] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");

  React.useEffect(() => {
    if (isEditing) {
      setEditPhone(savedPhone);
      setEditDob(savedDob);
      setPhoneError("");
    }
  }, [isEditing, savedPhone, savedDob]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(false);
  const [revokedSessions, setRevokedSessions] = React.useState<string[]>([]);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);

  const coverInputRef = React.useRef<HTMLInputElement>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const importDataInputRef = React.useRef<HTMLInputElement>(null);
  
  const [coverImage, setCoverImage] = React.useState<string | null>(null);
  const [avatarImage, setAvatarImage] = React.useState<string | null>(null);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCoverImage(url);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatarImage(url);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Your data export is complete. Check your email for the download link.");
    }, 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsImporting(true);
      setTimeout(() => {
        setIsImporting(false);
        alert("Data imported successfully!");
        if (importDataInputRef.current) importDataInputRef.current.value = "";
      }, 2000);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AI";
  };

  const handleSaveProfile = async () => {
    const pureDigits = editPhone.replace(/\D/g, '');
    if (editPhone && pureDigits.length !== 10) {
      setPhoneError("Mobile number must be exactly 10 digits");
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateProfile(editName, editEmail);
      setSavedPhone(editPhone);
      setSavedDob(editDob);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "personal", label: "Personal Details", icon: UserIcon },
    { id: "security", label: "Security", icon: Shield },
    { id: "sessions", label: "Active Sessions", icon: Laptop },
  ] as const;

  if (!currentUser) return null;

  return (
    <div id="user-profile-tab" className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Cover Image & Profile Header */}
      <div className="bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-xl overflow-hidden group">
        <div 
          className={`h-40 sm:h-52 w-full relative ${!coverImage ? 'bg-gradient-to-r from-green-500 via-teal-600 to-emerald-700' : 'bg-cover bg-center'} group/cover cursor-pointer transition-all`}
          style={coverImage ? { backgroundImage: `url(${coverImage})` } : undefined}
          onClick={() => coverInputRef.current?.click()}
        >
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover/cover:bg-black/40"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300">
            <Camera className="h-10 w-10 text-white mb-2 drop-shadow-md" />
            <span className="text-white text-sm font-bold tracking-widest uppercase drop-shadow-md">Change Cover</span>
          </div>
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverUpload} />
        </div>
        
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between sm:-mt-12 -mt-16 sm:space-x-6 space-y-4 sm:space-y-0">
            <div 
              className="relative group/avatar cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              <div 
                className="h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-white dark:border-slate-950 bg-green-100 text-green-700 flex items-center justify-center text-4xl sm:text-5xl font-black shadow-lg overflow-hidden relative z-10 transition-transform duration-300 group-hover/avatar:scale-105 bg-cover bg-center"
                style={avatarImage ? { backgroundImage: `url(${avatarImage})` } : undefined}
              >
                {!avatarImage && getInitials(currentUser.name)}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full z-20"></div>
            </div>

            <div className="text-center sm:text-left flex-1 mb-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">{currentUser.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{currentUser.email}</p>
            </div>

            <div className="flex items-center space-x-3 mb-2">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800/50 text-green-700 dark:text-green-400 uppercase tracking-wider shadow-sm">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Layout with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-900/20"
                    : "bg-white dark:bg-slate-950/80 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-950/80 dark:backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-green-900/40 shadow-xl transition-all duration-300 relative overflow-hidden">
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <span>Account Overview</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-green-500/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400 mt-1 flex items-center space-x-1.5"><CheckCircle2 className="h-4 w-4" /> <span>Active</span></span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-green-500/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Joined</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">
                    {new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-green-500/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Role</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block capitalize">{currentUser.role}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-green-500/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verification</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center space-x-1.5"><Shield className="h-4 w-4" /> <span>Verified</span></span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
                <h4 className="text-sm font-bold text-green-800 dark:text-green-300 mb-2">Complete Your Profile Setup</h4>
                <div className="w-full bg-green-200/50 dark:bg-green-900/50 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-green-600 dark:bg-green-500 h-full w-[80%] rounded-full"></div>
                </div>
                <p className="text-xs text-green-700 dark:text-green-400 font-medium">Your profile is 80% complete. Add your phone number and secondary email for extra account recovery options.</p>
              </div>
            </div>
          )}

          {/* Personal Details Tab */}
          {activeTab === "personal" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-green-500" />
                  <span>Personal Details</span>
                </h3>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit Info
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-4 py-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md cursor-pointer flex items-center"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 focus:border-green-500 rounded-xl text-sm text-slate-800 dark:text-white transition-colors outline-none"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800/50 rounded-xl text-sm font-semibold text-slate-800 dark:text-white">
                      {currentUser.name}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 focus:border-green-500 rounded-xl text-sm text-slate-800 dark:text-white transition-colors outline-none"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800/50 rounded-xl text-sm font-semibold text-slate-800 dark:text-white">
                      {currentUser.email}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                    <Phone className="h-3 w-3" /> <span>Phone Number</span>
                  </label>
                  {isEditing ? (
                    <div className="space-y-1">
                      <input 
                        type="tel" 
                        maxLength={10}
                        value={editPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setEditPhone(val);
                          if (phoneError) setPhoneError("");
                        }}
                        placeholder="Enter 10 digit number"
                        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-black/40 border ${phoneError ? 'border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-green-500'} rounded-xl text-sm text-slate-800 dark:text-white transition-colors outline-none`}
                      />
                      {phoneError && <p className="text-[10px] text-red-500 font-bold">{phoneError}</p>}
                    </div>
                  ) : (
                    <div className="px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800/50 rounded-xl text-sm font-semibold text-slate-800 dark:text-white">
                      {savedPhone ? savedPhone : <span className="text-slate-500 dark:text-slate-400">Not provided</span>}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                    <Calendar className="h-3 w-3" /> <span>Date of Birth</span>
                  </label>
                  {isEditing ? (
                    <input 
                      type="date"
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 focus:border-green-500 rounded-xl text-sm text-slate-800 dark:text-white transition-colors outline-none cursor-text"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800/50 rounded-xl text-sm font-semibold text-slate-800 dark:text-white">
                      {savedDob ? new Date(savedDob).toLocaleDateString() : <span className="text-slate-500 dark:text-slate-400">Not provided</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Security & Authentication</span>
                </h3>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                        <Key className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">Account Password</h4>
                        <p className="text-xs text-slate-500 mt-1">Last changed 3 months ago. We recommend changing it periodically.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                      {isChangingPassword ? "Cancel" : "Change"}
                    </button>
                  </div>

                  {isChangingPassword && (
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50 space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full sm:max-w-md px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-green-500 rounded-xl text-sm text-slate-800 dark:text-white transition-colors outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full sm:max-w-md px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-green-500 rounded-xl text-sm text-slate-800 dark:text-white transition-colors outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full sm:max-w-md px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-green-500 rounded-xl text-sm text-slate-800 dark:text-white transition-colors outline-none" />
                      </div>
                      <div className="pt-2">
                        <button 
                          onClick={() => {
                            alert("Password successfully updated!");
                            setIsChangingPassword(false);
                          }}
                          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                        >
                          Save New Password
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center space-x-2">
                        <span>Two-Factor Authentication</span>
                        {is2FAEnabled ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] uppercase font-black rounded flex items-center space-x-1">
                            <CheckCircle2 className="h-2 w-2" />
                            <span>Enabled</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] uppercase font-black rounded flex items-center space-x-1">
                            <AlertTriangle className="h-2 w-2" />
                            <span>Disabled</span>
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">Add an extra layer of security to your account by enabling 2FA with an authenticator app.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    className={`px-4 py-2 text-xs font-bold text-white border border-transparent rounded-lg shadow-md transition-all cursor-pointer ${is2FAEnabled ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-rose-600 flex items-center space-x-2 mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Danger Zone</span>
                </h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input type="file" ref={importDataInputRef} className="hidden" accept=".json,.csv" onChange={handleImport} />
                  <button 
                    onClick={() => importDataInputRef.current?.click()}
                    disabled={isImporting || isExporting}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    <span>{isImporting ? "Importing..." : "Import Data"}</span>
                  </button>
                  <button 
                    onClick={handleExport}
                    disabled={isExporting || isImporting}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    <span>{isExporting ? "Exporting..." : "Export My Data"}</span>
                  </button>
                  <button 
                    onClick={() => {
                      const confirmText = prompt("Type 'DELETE' to confirm permanent account deletion.");
                      if (confirmText === "DELETE") alert("Account deletion request submitted.");
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-bold rounded-xl transition-colors cursor-pointer w-full sm:w-auto ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center space-x-2">
                  <Laptop className="h-5 w-5 text-green-500" />
                  <span>Active Sessions</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 -mt-4">
                These are the devices that have logged into your account. Revoke any sessions that you do not recognize.
              </p>

              <div className="space-y-4">
                {/* Current Session */}
                <div className="p-5 bg-green-50/50 dark:bg-green-950/10 rounded-2xl border border-green-200 dark:border-green-900/50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                      <Laptop className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center space-x-2">
                        <span>Windows • Chrome Browser</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] uppercase font-bold rounded">Current</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">New Delhi, India • IP: 192.168.1.1</p>
                    </div>
                  </div>
                </div>

                {/* Other Sessions */}
                {!revokedSessions.includes("iphone") && (
                  <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl border border-slate-100 dark:border-slate-700">
                        <Smartphone className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">iPhone 13 • Safari App</h4>
                        <p className="text-xs text-slate-500 mt-1">Lucknow, India • Last active: 2 hours ago</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setRevokedSessions(prev => [...prev, "iphone"]); alert("Session revoked successfully."); }}
                      className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
                    >
                      Revoke Access
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => { setRevokedSessions(prev => [...prev, "iphone"]); alert("Signed out of all other active sessions."); }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out of all other devices</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
