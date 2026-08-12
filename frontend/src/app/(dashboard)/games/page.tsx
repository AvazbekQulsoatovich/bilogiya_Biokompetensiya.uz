"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Trophy, RotateCcw, Play, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [activeGame, setActiveGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // General game states
  const [parsedContent, setParsedContent] = useState<any[]>([]);
  const [isWon, setIsWon] = useState(false);

  // Memory Game states
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

  // Scramble Game states
  const [currentScrambleIdx, setCurrentScrambleIdx] = useState(0);
  const [scrambleInput, setScrambleInput] = useState("");
  const [scrambleError, setScrambleError] = useState("");

  // True/False Game states
  const [currentTFIdx, setCurrentTFIdx] = useState(0);
  const [tfScore, setTfScore] = useState(0);
  const [tfFeedback, setTfFeedback] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/games`);
      if (res.ok) {
        const data = await res.json();
        setGames(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = (game: any) => {
    setActiveGame(game);
    setIsWon(false);
    try {
      const parsed = JSON.parse(game.contentJson);
      setParsedContent(parsed);
      
      if (game.type === "MEMORY") {
        initializeMemory(parsed);
      } else if (game.type === "SCRAMBLE") {
        setCurrentScrambleIdx(0);
        setScrambleInput("");
        setScrambleError("");
      } else if (game.type === "TRUE_FALSE") {
        setCurrentTFIdx(0);
        setTfScore(0);
        setTfFeedback(null);
      }
    } catch (e) {
      console.error("Invalid game data");
    }
  };

  const winGame = () => {
    setIsWon(true);
    setTimeout(() => {
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    }, 100);
  };

  const restartCurrentGame = () => {
    if (activeGame) startGame(activeGame);
  };

  // --- MEMORY LOGIC ---
  const initializeMemory = (cardsData: any[]) => {
    const shuffledCards = [...cardsData, ...cardsData]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, uniqueId: Math.random() }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setDisabled(false);
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
            winGame();
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

  // --- SCRAMBLE LOGIC ---
  const handleScrambleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentWordObj = parsedContent[currentScrambleIdx];
    if (scrambleInput.trim().toUpperCase() === currentWordObj.word.toUpperCase()) {
      setScrambleError("");
      if (currentScrambleIdx + 1 >= parsedContent.length) {
        winGame();
      } else {
        setCurrentScrambleIdx(prev => prev + 1);
        setScrambleInput("");
      }
    } else {
      setScrambleError("Noto'g'ri, qayta urinib ko'ring!");
      setTimeout(() => setScrambleError(""), 2000);
    }
  };

  const scrambleWord = (word: string) => {
    let scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
    // Ensure it's actually scrambled
    while (scrambled === word && word.length > 1) {
      scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
    }
    return scrambled.toUpperCase();
  };

  // --- TRUE/FALSE LOGIC ---
  const handleTFAnswer = (answer: boolean) => {
    if (disabled) return;
    setDisabled(true);
    const currentQ = parsedContent[currentTFIdx];
    const isCorrect = currentQ.answer === answer;
    
    setTfFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setTfScore(prev => prev + 1);
    
    setTimeout(() => {
      setTfFeedback(null);
      setDisabled(false);
      if (currentTFIdx + 1 >= parsedContent.length) {
        winGame();
      } else {
        setCurrentTFIdx(prev => prev + 1);
      }
    }, 1500);
  };


  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex justify-center mt-20">
        <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  // --- GAME LIST VIEW ---
  if (!activeGame) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="bg-pink-500 rounded-[2.5rem] p-8 md:p-10 mb-10 text-white shadow-xl shadow-pink-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-3xl">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2">O'yinlar</h1>
              <p className="text-white/80 text-lg">O'ynash orqali bilimlaringizni mustahkamlang.</p>
            </div>
          </div>
        </div>

        {!Array.isArray(games) || games.length === 0 ? (
          <div className="glass p-12 text-center rounded-3xl border border-border/50">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
            <h2 className="text-2xl font-bold mb-2">Hozircha o'yinlar yo'q</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {games.map(game => (
              <div key={game.id} className="glass p-8 rounded-[2rem] border border-border/50 flex flex-col hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/10 transition-all group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-pink-400 opacity-0 group-hover:opacity-100 transition-all" />
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-pink-100 p-3 rounded-2xl">
                    <Gamepad2 className="w-6 h-6 text-pink-600" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-600 rounded-lg">
                    {game.type === 'MEMORY' ? 'Xotira' : game.type === 'SCRAMBLE' ? 'So\'z topish' : 'Faktlar'}
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-3">{game.title}</h3>
                <p className="text-foreground/60 mb-8 flex-1 leading-relaxed">{game.description}</p>
                <button
                  onClick={() => startGame(game)}
                  className="w-full bg-gray-900 hover:bg-pink-600 text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Boshlash
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- GAME PLAY VIEW ---
  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveGame(null)}
            className="px-5 py-2.5 bg-white shadow-sm rounded-xl border border-border hover:bg-gray-50 transition-all font-bold text-gray-600"
          >
            ← Orqaga
          </button>
          <div>
            <h1 className="text-3xl font-black">{activeGame.title}</h1>
            <span className="text-sm font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-lg mt-1 inline-block">
              {activeGame.type === 'MEMORY' ? 'Xotira O\'yini' : activeGame.type === 'SCRAMBLE' ? 'So\'z Topish O\'yini' : 'To\'g\'ri / Noto\'g\'ri'}
            </span>
          </div>
        </div>

        <button 
          onClick={restartCurrentGame}
          className="flex items-center gap-2 bg-white shadow-sm border border-border hover:border-pink-500 hover:text-pink-600 px-5 py-2.5 rounded-xl transition-all font-bold"
        >
          <RotateCcw className="w-5 h-5" /> Qaytadan
        </button>
      </div>

      <div className="glass p-8 md:p-12 rounded-[3rem] border border-border/50 shadow-2xl relative min-h-[500px] flex flex-col justify-center overflow-hidden">
        
        {/* VICTORY OVERLAY */}
        <AnimatePresence>
          {isWon && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl z-50 rounded-[3rem]"
            >
              <Trophy className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-2xl" />
              <h2 className="text-5xl font-black mb-4 text-gray-900">Ajoyib Natija!</h2>
              {activeGame.type === 'TRUE_FALSE' && (
                <p className="text-2xl font-bold text-green-600 mb-6">
                  {parsedContent.length} ta dan {tfScore} ta to'g'ri topdingiz!
                </p>
              )}
              <p className="text-xl text-gray-500 mb-10 font-medium">Barcha bosqichlarni muvaffaqiyatli yakunladingiz.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveGame(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-2xl font-black text-lg transition-all"
                >
                  Boshqa o'yinlar
                </button>
                <button 
                  onClick={restartCurrentGame}
                  className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-pink-500/20 transition-all hover:scale-105"
                >
                  Yana o'ynash
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- GAME 1: MEMORY --- */}
        {activeGame.type === 'MEMORY' && (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full max-w-4xl mx-auto">
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || solved.includes(index);
              return (
                <motion.div
                  key={card.uniqueId}
                  whileHover={{ scale: isFlipped ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(index)}
                  className={`relative aspect-square cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${isFlipped ? '' : 'bg-gradient-to-br from-pink-500 to-rose-600 shadow-xl shadow-pink-500/20'}`}
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
                    
                    <div className="absolute w-full h-full backface-hidden bg-white border-4 border-pink-100 rounded-2xl flex flex-col items-center justify-center p-2" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      {card.image ? (
                        <img src={card.image} alt={card.name} className="w-12 h-12 object-contain mb-2" />
                      ) : (
                        <span className="text-4xl mb-2">{card.emoji}</span>
                      )}
                      <span className="font-bold text-xs text-center leading-tight text-gray-700">{card.name}</span>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* --- GAME 2: SCRAMBLE --- */}
        {activeGame.type === 'SCRAMBLE' && !isWon && (
          <div className="max-w-2xl mx-auto w-full text-center">
            <div className="mb-4 inline-block bg-blue-50 text-blue-600 font-bold px-4 py-1.5 rounded-full text-sm">
              Bosqich {currentScrambleIdx + 1} / {parsedContent.length}
            </div>
            <h2 className="text-2xl font-bold text-gray-500 mb-8">{parsedContent[currentScrambleIdx]?.hint}</h2>
            
            <div className="flex justify-center flex-wrap gap-3 mb-12">
              {scrambleWord(parsedContent[currentScrambleIdx]?.word || "").split('').map((char, i) => (
                <div key={i} className="w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center text-3xl font-black text-gray-800 shadow-md">
                  {char}
                </div>
              ))}
            </div>

            <form onSubmit={handleScrambleSubmit} className="flex flex-col items-center w-full max-w-md mx-auto">
              <input 
                type="text" 
                value={scrambleInput}
                onChange={e => setScrambleInput(e.target.value.toUpperCase())}
                placeholder="To'g'ri so'zni yozing..."
                className="w-full bg-gray-50 border-4 border-gray-200 rounded-2xl px-6 py-4 text-center text-2xl font-black uppercase tracking-widest focus:border-pink-500 focus:outline-none transition-all mb-4"
              />
              {scrambleError && (
                <p className="text-red-500 font-bold mb-4">{scrambleError}</p>
              )}
              <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 text-white font-black text-xl py-4 rounded-2xl shadow-xl shadow-pink-500/20 transition-all hover:scale-105">
                Tekshirish
              </button>
            </form>
          </div>
        )}

        {/* --- GAME 3: TRUE / FALSE --- */}
        {activeGame.type === 'TRUE_FALSE' && !isWon && (
          <div className="max-w-3xl mx-auto w-full text-center">
            <div className="flex justify-between items-center mb-8 px-4">
              <span className="bg-gray-100 text-gray-600 font-bold px-4 py-2 rounded-xl">Savol {currentTFIdx + 1} / {parsedContent.length}</span>
              <span className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded-xl">Ochko: {tfScore}</span>
            </div>

            <div className="bg-white border-4 border-gray-100 p-10 rounded-[3rem] shadow-xl mb-10 relative overflow-hidden">
              <AnimatePresence>
                {tfFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm"
                  >
                    {tfFeedback === "correct" ? (
                      <CheckCircle2 className="w-32 h-32 text-green-500 drop-shadow-xl" />
                    ) : (
                      <XCircle className="w-32 h-32 text-red-500 drop-shadow-xl" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <h2 className="text-3xl md:text-4xl font-black text-gray-800 leading-tight">
                "{parsedContent[currentTFIdx]?.question}"
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
              <button 
                onClick={() => handleTFAnswer(true)}
                disabled={disabled}
                className="bg-green-500 hover:bg-green-400 text-white font-black text-2xl py-6 rounded-3xl shadow-xl shadow-green-500/20 transition-all hover:scale-105 disabled:opacity-50"
              >
                TO'G'RI
              </button>
              <button 
                onClick={() => handleTFAnswer(false)}
                disabled={disabled}
                className="bg-red-500 hover:bg-red-400 text-white font-black text-2xl py-6 rounded-3xl shadow-xl shadow-red-500/20 transition-all hover:scale-105 disabled:opacity-50"
              >
                NOTO'G'RI
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
