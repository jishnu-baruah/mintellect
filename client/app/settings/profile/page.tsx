"use client"
import { useEffect, useState, useCallback } from "react"
import { useProfileChecklist, useProfileStatus } from "@/hooks/useProfileChecklist"
import { GlassCard } from "@/components/ui/glass-card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { RippleButton } from "@/components/ui/ripple-button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Lock, Bell, Shield, CreditCard } from "lucide-react"
import { Wallet, Send } from "lucide-react"
import { useWallet } from "@/hooks/useWallet"

interface ProfileRequirement {
  key: string;
  label: string;
  required: boolean;
  link?: string;
};

type ChecklistItem = {
  key: string;
  label: string;
  completed: boolean;
  link?: string;
};

function SettingsTabBar() {
  const pathname = usePathname();
  const tabs = [
    { href: "/settings/profile", label: "Profile", icon: User },
    { href: "/settings/security", label: "Security", icon: Lock },
    { href: "/settings/notifications", label: "Notifications", icon: Bell },
    { href: "/settings/privacy", label: "Privacy", icon: Shield },
    { href: "/settings/billing", label: "Billing", icon: CreditCard },
  ];
  return (
    <nav className="flex w-full overflow-x-auto bg-gradient-to-r from-black/90 to-gray-900/80 px-2 py-2 gap-0 sticky top-0 z-30 rounded-b-xl shadow-sm">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              "flex flex-col items-center justify-center px-4 py-2 min-w-[72px] text-xs font-medium rounded-xl transition-all duration-200 " +
              (active
                ? "bg-mintellect-primary/10 text-mintellect-primary shadow"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60")
            }
            scroll={false}
          >
            <tab.icon className={"h-5 w-5 mb-0.5 " + (active ? "text-mintellect-primary" : "")} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function ProfileSettings() {
  // SWR hooks for profile and checklist
  const { profileComplete, checking, walletConnected, walletAddress, refresh: refreshProfile } = useProfileStatus();
  const { checklist, allComplete, loading, error, isNewUser, refresh: refreshChecklist } = useProfileChecklist();

  // Profile form state
  const [form, setForm] = useState<Record<string, string>>({
    firstName: "",
    lastName: "",
    email: "",
    institution: "",
    bio: "",
    avatarUrl: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Handler for form field changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  // Handler for save button
  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append("wallet", walletAddress || "");
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("institution", form.institution);
      formData.append("bio", form.bio);
      if (avatarFile) formData.append("avatar", avatarFile);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/profile/profile`, {
        method: "POST",
        body: formData,
        headers: { "x-wallet": walletAddress }
      });
      
      if (!res.ok) throw new Error("Failed to save profile");
      
      setSaveSuccess(true);
      
      // Invalidate caches to refresh profile status and checklist
      setTimeout(() => {
        refreshProfile();
        refreshChecklist();
      }, 100);
      
    } catch (err) {
      setSaveError("Could not save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [form, avatarFile, walletAddress, refreshProfile, refreshChecklist]);

  // Prefill form with existing profile data - only run once when wallet connects
  useEffect(() => {
    if (!walletConnected || !walletAddress || hasInitialized) return;
    
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/profile/profile?wallet=${walletAddress}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        
        const data = await res.json();
        console.log("Fetched profile data:", data);
        
        if (data && data.profile) {
          setForm({
            firstName: data.profile.name?.split(' ')[0] || "",
            lastName: data.profile.name?.split(' ').slice(1).join(' ') || "",
            email: data.profile.mail || "",
            institution: data.profile.institution || "",
            bio: data.profile.bio || "",
            avatarUrl: data.profile.avatar || ""
          });
        }
        setHasInitialized(true);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setHasInitialized(true); // Mark as initialized even on error to prevent infinite retries
      }
    };

    fetchProfile();
  }, [walletConnected, walletAddress, hasInitialized]);

  // Show cached content immediately if available
  if (checking && !profileComplete) return <div className="flex items-center justify-center h-[60vh]"><span className="text-lg text-gray-400">Checking profile status...</span></div>;

  if (!walletConnected || !walletAddress) {
    const { connectWallet, isLoading } = useWallet();
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
        <span className="text-lg text-yellow-400">Connect your wallet to use Mintellect.</span>
        <RippleButton
          onClick={() => { if (!walletConnected) connectWallet(); }}
          disabled={isLoading || walletConnected}
          className="flex items-center gap-2 w-full max-w-[220px] justify-center px-4 py-1.5 rounded-full border border-mintellect-primary shadow-sm bg-mintellect-primary text-white hover:bg-mintellect-primary/80 transition font-medium text-base"
        >
          <Wallet className="w-4 h-4" />
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </RippleButton>
      </div>
    );
  }

  return (
    <>
      {!isNewUser && <SettingsTabBar />}
      <GlassCard>
        <h2 className="text-xl font-bold mb-6">Profile</h2>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <Avatar className="w-24 h-24 rounded-full bg-mintellect-primary/20">
                <AvatarImage
                  src={form.avatarUrl || ""}
                  alt={form.firstName || "Avatar"}
                  className="w-24 h-24 object-cover"
                />
                <AvatarFallback className="text-mintellect-primary text-3xl font-bold">
                  {form.firstName ? form.firstName[0] : "A"}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute bottom-0 right-0 bg-mintellect-primary text-white p-1 rounded-full"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
              </button>
              <input
                id="avatar-upload"
                name="avatar"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setForm(prev => ({ ...prev, avatarUrl: url }));
                    setAvatarFile(file);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checklist.filter((req: ChecklistItem) => !["avatar", "wallet", "telegram", "twitter"].includes(req.key)).map((req: ChecklistItem) => (
                <div key={req.key}>
                  <label className="block text-sm font-medium mb-1">
                    {req.label}
                    <span className="text-gray-400 ml-1">(required)</span>
                  </label>
                  <input
                    name={req.key}
                    value={form[req.key] || ""}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary"
                    placeholder={`Enter ${req.label.toLowerCase()}`}
                    required={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-mintellect-primary min-h-[100px]" placeholder="Brief professional description" />
        </div>
        {saveError && <div className="text-red-400 mb-4 text-center">{saveError}</div>}
        {saveSuccess && <div className="text-green-400 mb-4 text-center">Profile saved successfully!</div>}
        {/* Checklist Section (now after bio) */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Get Started Checklist</h3>
          <ul className="space-y-6">
            <li className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <span className="font-medium text-gray-200">Connect your wallet to unlock Mintellect features.</span>
                <div className="text-gray-400 text-sm mb-2">Your wallet is required for publishing, minting, and accessing exclusive content.</div>
              </div>
              <RippleButton
                disabled={walletConnected}
                onClick={() => {}}
                className={`flex items-center gap-2 w-full max-w-[220px] justify-center px-4 py-1.5 rounded-full border border-mintellect-primary shadow-sm text-white transition font-medium text-base ${walletConnected ? 'bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed' : 'bg-mintellect-primary hover:bg-mintellect-primary/80'}`}
              >
                <Wallet className="w-4 h-4" />
                {walletConnected ? "Wallet Connected" : "Connect Wallet"}
              </RippleButton>
            </li>
            <li className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <span className="font-medium text-gray-200">Join our Telegram community.</span>
                <div className="text-gray-400 text-sm mb-2">Get updates, support, and connect with other researchers.</div>
              </div>
              <a href="https://t.me/mintellect_community" target="_blank" rel="noopener noreferrer" className="w-full max-w-[220px]">
                <RippleButton
                  className="flex items-center gap-2 w-full justify-center px-3 py-1.5 rounded-full border border-mintellect-primary shadow-sm bg-mintellect-primary text-white hover:bg-mintellect-primary/80 transition font-medium text-base"
                >
                  <Send className="w-4 h-4" />
                  Join Telegram
                </RippleButton>
              </a>
            </li>
            <li className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <span className="font-medium text-gray-200">Follow us on X for news and announcements.</span>
                <div className="text-gray-400 text-sm mb-2">Stay informed about platform updates and research highlights.</div>
              </div>
              <a href="https://x.com/_Mintellect_" target="_blank" rel="noopener noreferrer" className="w-full max-w-[220px]">
                <RippleButton
                  className="flex items-center gap-2 w-full justify-center px-3 py-1.5 rounded-full border border-mintellect-primary shadow-sm bg-mintellect-primary text-white hover:bg-mintellect-primary/80 transition font-medium text-base"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.53 3H21.5L14.5 10.68L22.75 21H16.44L11.38 14.53L5.77 21H1.8L9.13 12.82L1.25 3H7.73L12.32 9.01L17.53 3ZM16.46 19.13H18.19L7.36 4.76H5.49L16.46 19.13Z" fill="currentColor"/>
                  </svg>
                  Follow on X
                </RippleButton>
              </a>
            </li>
          </ul>
        </div>
        {/* End Checklist Section */}
        <div className="flex justify-end">
          <RippleButton onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</RippleButton>
        </div>
        <div className="flex justify-end mt-12">
          <a href="/settings/security" className="flex items-center gap-2 px-4 py-1.5 border border-gray-700 rounded-full text-gray-200 hover:bg-gray-800 transition font-normal text-sm">
            <span>Security</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </GlassCard>
    </>
  );
}