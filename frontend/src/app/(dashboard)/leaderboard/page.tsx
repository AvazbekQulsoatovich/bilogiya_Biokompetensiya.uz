"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/leaderboard`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-foreground/40">{index + 1}</span>;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-yellow-500/10 rounded-2xl">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Reyting Jadvali</h1>
          <p className="text-foreground/60 mt-1">Eng faol o'quvchilar ro'yxati</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass rounded-3xl border border-border/50 overflow-hidden shadow-lg">
          <div className="p-6 bg-background/50 border-b border-border/50 grid grid-cols-12 gap-4 font-bold text-foreground/60 uppercase tracking-wider text-sm">
            <div className="col-span-2 text-center">O'rin</div>
            <div className="col-span-7">Foydalanuvchi</div>
            <div className="col-span-3 text-right">XP Ballari</div>
          </div>
          
          <div className="divide-y divide-border/30">
            {users.map((user, index) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 grid grid-cols-12 gap-4 items-center transition-colors hover:bg-background/30 ${index < 3 ? 'bg-primary-500/5' : ''}`}
              >
                <div className="col-span-2 flex justify-center">
                  {getRankIcon(index)}
                </div>
                <div className="col-span-7 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-amber-600 text-white' : 'bg-primary-100 text-primary-700'}`}>
                    {user.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-foreground/50">{user.level}-daraja</p>
                  </div>
                </div>
                <div className="col-span-3 flex justify-end items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xl font-black">{user.xp}</span>
                </div>
              </motion.div>
            ))}
            
            {users.length === 0 && (
              <div className="p-12 text-center text-foreground/50">
                Hali reytingda hech kim yo'q
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
