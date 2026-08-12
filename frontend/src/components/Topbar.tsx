"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Topbar() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUserProfile(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Search */}
      <div className="flex-1 max-w-md relative hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Qidirish..."
          className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
        />
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-6 ml-auto">
        <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <button 
          onClick={() => router.push('/profile')}
          className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-2xl transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {userProfile?.name?.charAt(0) || "U"}
          </div>
          <span className="font-semibold text-sm text-gray-700 hidden sm:block">
            {userProfile?.name || "Umidjon"}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
        </button>
      </div>
    </div>
  );
}
