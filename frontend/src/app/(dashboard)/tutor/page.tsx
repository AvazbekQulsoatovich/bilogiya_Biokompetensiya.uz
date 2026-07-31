"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Send, Loader2, User } from "lucide-react";

export default function TutorPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Assalomu alaykum! Men BioEdu ning sun'iy idrok yordamchisiman. Biologiya bo'yicha qanday savolingiz bor?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/tutor/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: `Xato: ${data.error || 'Nomalum xatolik'}` }]);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'ai', text: `Tarmoq xatosi: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <div className="p-3 bg-primary-500/10 rounded-2xl">
          <BrainCircuit className="w-8 h-8 text-primary-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Yordamchi</h1>
          <p className="text-foreground/60 mt-1">Sizning virtual biologiya ustozingiz</p>
        </div>
      </div>

      <div className="glass rounded-3xl border border-border/50 flex flex-col overflow-hidden flex-grow relative shadow-lg">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary z-10" />
        
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-green-600 text-white'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'glass border border-border/50 rounded-tl-none text-foreground/90'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 max-w-[80%]"
            >
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-green-600 text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl glass border border-border/50 rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-background/50 border-t border-border/50 shrink-0 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Savolingizni shu yerga yozing..."
              className="w-full pl-6 pr-16 py-4 rounded-full bg-background border-2 border-border focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 p-3 bg-primary-600 text-white rounded-full hover:bg-primary-500 disabled:bg-primary-600/50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
