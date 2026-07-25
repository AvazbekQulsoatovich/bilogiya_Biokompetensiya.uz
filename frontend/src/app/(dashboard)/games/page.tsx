"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Trophy, RotateCcw, Play } from "lucide-react";
import confetti from "canvas-confetti";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [activeGame, setActiveGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Game state
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/games");
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = (game: any) => {
    setActiveGame(game);
    try {
      const parsedCards = JSON.parse(game.contentJson);
      initializeCards(parsedCards);
    } catch (e) {
      console.error("Invalid game data");
    }
  };

  const initializeCards = (cardsData: any[]) => {
    const shuffledCards = [...cardsData, ...cardsData]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, uniqueId: Math.random() }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
  };

  const restartCurrentGame = () => {
    if (activeGame) startGame(activeGame);
  };

  const handleCardClick = (index: number) => {
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const firstIndex = newFlipped[0];
      const secondIndex = newFlipped[1];

      if (cards[firstIndex].id === cards[secondIndex].id) {
        setSolved(prev => {
          const newSolved = [...prev, firstIndex, secondIndex];
          if (newSolved.length === cards.length) {
            setTimeout(() => {
              confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }, 500);
          }
          return newSolved;
        });
        setFlipped([]);
        setDisabled(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex justify-center mt-20">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  // If no game is selected, show list of games
  if (!activeGame) {
    return (
      <div className="p-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-2xl">
            <Gamepad2 className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">O'yinlar</h1>
            <p className="text-foreground/60 mt-1">O'ynash orqali bilimlaringizni mustahkamlang.</p>
          </div>
        </div>

        {games.length === 0 ? (
          <div className="glass p-12 text-center rounded-3xl border border-border/50">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
            <h2 className="text-2xl font-bold mb-2">Hozircha o'yinlar yo'q</h2>
            <p className="text-foreground/60">Tez orada adminlar tomonidan yangi o'yinlar qo'shiladi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(game => (
              <div key={game.id} className="glass p-6 rounded-3xl border border-border/50 flex flex-col hover:border-indigo-500/50 transition-all group">
                <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                <p className="text-foreground/60 mb-6 flex-1">{game.description}</p>
                <button
                  onClick={() => startGame(game)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Play className="w-5 h-5 fill-current" />
                  O'ynash
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Game UI
  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveGame(null)}
            className="p-3 glass rounded-xl border border-border hover:bg-foreground/5 transition-all"
          >
            ← Orqaga
          </button>
          <div>
            <h1 className="text-3xl font-bold">{activeGame.title}</h1>
            <p className="text-foreground/60 mt-1">{activeGame.description}</p>
          </div>
        </div>

        <button 
          onClick={restartCurrentGame}
          className="flex items-center gap-2 bg-background border-2 border-border hover:border-indigo-500 hover:text-indigo-500 px-5 py-2.5 rounded-xl transition-all font-bold"
        >
          <RotateCcw className="w-5 h-5" /> Qaytadan
        </button>
      </div>

      <div className="glass p-8 rounded-3xl border border-border/50 shadow-lg relative min-h-[400px]">
        <AnimatePresence>
          {solved.length === cards.length && cards.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md z-10 rounded-3xl"
            >
              <Trophy className="w-24 h-24 text-yellow-500 mb-6 drop-shadow-xl" />
              <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">G'alaba!</h2>
              <p className="text-xl text-foreground/60 mb-8 font-medium">Barcha juftliklarni topdingiz.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveGame(null)}
                  className="glass hover:bg-foreground/5 px-8 py-3 rounded-xl font-bold text-lg transition-all"
                >
                  Boshqa o'yinlar
                </button>
                <button 
                  onClick={restartCurrentGame}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Yana o'ynash
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || solved.includes(index);
            return (
              <motion.div
                key={card.uniqueId}
                whileHover={{ scale: isFlipped ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(index)}
                className={`relative aspect-square cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${isFlipped ? '' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20'}`}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                  className="w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute w-full h-full backface-hidden" style={{ backfaceVisibility: "hidden" }}>
                    <div className="w-full h-full flex items-center justify-center border-4 border-white/20 rounded-2xl">
                      <Gamepad2 className="w-10 h-10 text-white/50" />
                    </div>
                  </div>
                  
                  <div className="absolute w-full h-full backface-hidden bg-background border-2 border-border rounded-2xl flex flex-col items-center justify-center p-2" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <span className="text-4xl mb-2">{card.emoji}</span>
                    <span className="font-bold text-xs text-center leading-tight">{card.name}</span>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
