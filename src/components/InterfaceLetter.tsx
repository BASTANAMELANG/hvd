import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Stars, Mail, HeartOff, CornerDownLeft, Volume2, Sparkles, FastForward } from "lucide-react";
import { SurpriseConfig } from "../types";

interface LetterProps {
  config: SurpriseConfig;
  onReset: () => void;
  triggerBurst: () => void;
  key?: string | number;
}

export default function InterfaceLetter({ config, onReset, triggerBurst }: LetterProps) {
  const [clickedHearts, setClickedHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [stampClicked, setStampClicked] = useState(false);
  
  const [typedParas, setTypedParas] = useState<string[]>([]);
  const [activeParaIndex, setActiveParaIndex] = useState(0);
  const [activeParaText, setActiveParaText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  const timerRef = useRef<any>(null);

  // Restart typing effect when the letter is unfolded (stampClicked is true)
  useEffect(() => {
    if (!stampClicked) {
      setTypedParas([]);
      setActiveParaIndex(0);
      setActiveParaText("");
      setTypingComplete(false);
      return;
    }

    const paragraphs = config.letterParagraphs;
    if (!paragraphs || paragraphs.length === 0) {
      setTypingComplete(true);
      return;
    }

    let pIndex = 0;
    let charIndex = 0;
    let currentPara = paragraphs[0];
    let currentAccumulated = "";

    const typeChar = () => {
      if (pIndex >= paragraphs.length) {
        setTypingComplete(true);
        return;
      }

      currentPara = paragraphs[pIndex];
      if (charIndex < currentPara.length) {
        currentAccumulated += currentPara[charIndex];
        setActiveParaText(currentAccumulated);
        charIndex++;
        timerRef.current = setTimeout(typeChar, 30); // 30ms per character typing speed
      } else {
        // Current paragraph finished typing
        setTypedParas(prev => [...prev, currentPara]);
        setActiveParaText("");
        charIndex = 0;
        currentAccumulated = "";
        pIndex++;
        
        if (pIndex < paragraphs.length) {
          setActiveParaIndex(pIndex);
          // Wait slightly between paragraphs (600ms)
          timerRef.current = setTimeout(typeChar, 600);
        } else {
          setTypingComplete(true);
        }
      }
    };

    // Start with a slight delays
    timerRef.current = setTimeout(typeChar, 700);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stampClicked, config.letterParagraphs]);

  const handleSkipTyping = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid spawning click hearts on the skip button
    if (timerRef.current) clearTimeout(timerRef.current);
    setTypedParas(config.letterParagraphs);
    setActiveParaText("");
    setActiveParaIndex(config.letterParagraphs.length);
    setTypingComplete(true);
    triggerBurst();
  };

  const handleLetterBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Spawn a cute little heart right where the user taps inside the letter
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const id = Date.now() + Math.random();
    setClickedHearts(prev => [...prev, { id, x: clickX, y: clickY }]);
    triggerBurst(); // Spawn floating element in main canvas too!

    // Clear heart after animation resolves
    setTimeout(() => {
      setClickedHearts(prev => prev.filter(h => h.id !== id));
    }, 1400);
  };

  const getThemeStyles = () => {
    switch (config.theme) {
      case "royal":
        return {
          bg: "bg-white/75 border-amber-200 shadow-xl shadow-amber-100/30 text-[#4A2C2A]",
          accentText: "text-amber-600 font-semibold",
          accentBg: "bg-amber-400",
          accentBorder: "border-amber-200",
          envelopeSeal: "bg-amber-500 text-[#4A2C2A]",
          gradientText: "from-[#4A2C2A] to-[#85603F]",
          inkColor: "text-[#4A2C2A]",
        };
      case "lavender":
        return {
          bg: "bg-white/75 border-fuchsia-200 shadow-xl shadow-fuchsia-100/30 text-[#4A2C2A]",
          accentText: "text-fuchsia-600 font-semibold",
          accentBg: "bg-fuchsia-400",
          accentBorder: "border-fuchsia-200",
          envelopeSeal: "bg-fuchsia-500 text-white",
          gradientText: "from-[#4A2C2A] to-[#7C4D80]",
          inkColor: "text-[#4A2C2A]",
        };
      case "emerald":
        return {
          bg: "bg-white/75 border-emerald-200 shadow-xl shadow-emerald-100/30 text-[#4A2C2A]",
          accentText: "text-emerald-600 font-semibold",
          accentBg: "bg-emerald-400",
          accentBorder: "border-emerald-200",
          envelopeSeal: "bg-emerald-500 text-white",
          gradientText: "from-[#4A2C2A] to-[#437A5D]",
          inkColor: "text-[#4A2C2A]",
        };
      case "rose":
      default:
        return {
          bg: "bg-white/75 border-[#FFD1D1] shadow-xl shadow-pink-100/30 text-[#4A2C2A]",
          accentText: "text-[#FF7B89] font-semibold",
          accentBg: "bg-[#FF7B89]",
          accentBorder: "border-pink-200",
          envelopeSeal: "bg-[#FF7B89] text-white",
          gradientText: "from-[#4A2C2A] to-[#A83D48]",
          inkColor: "text-[#4A2C2A]",
        };
    }
  };

  const style = getThemeStyles();

  return (
    <motion.div
      id="letter-interface-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-6 z-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial from-white/10 via-white/50 to-[#FFF9F9]/80 pointer-events-none" />

      {/* Main Container - Keeps it inside boundaries for mobile */}
      <div className="relative w-full max-w-xl h-[85vh] h-[85dvh] flex flex-col items-center justify-center overflow-hidden">
        
        <AnimatePresence mode="wait">
          {!stampClicked ? (
            /* A: Enigmatic Envelope Cover */
            <motion.div
              key="envelope"
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.6 }}
              className={`relative w-full max-w-sm p-8 rounded-2xl border text-center flex flex-col items-center justify-center select-none shadow-2xl cursor-pointer ${style.bg}`}
              onClick={() => {
                setStampClicked(true);
                // Trigger celebratory chimes when seal is broken
                triggerBurst();
              }}
            >
              <div className="absolute inset-1 border border-pink-100/30 rounded-xl pointer-events-none" />

              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="mb-6 p-4 rounded-full bg-[#FFF9F9] border border-pink-100 text-[#FF7B89]"
              >
                <Mail className={`h-8 w-8 ${style.accentText}`} />
              </motion.div>

              <p className="text-[10px] uppercase font-mono tracking-widest text-[#7B6A68] mb-2 font-medium">Unread Correspondence</p>
              <h2 className="font-serif-display text-lg font-bold text-[#4A2C2A] mb-1 uppercase tracking-wider">A Letter for {config.recipientName}</h2>
              <p className="text-xs text-[#7B6A68] font-light mb-6">From {config.senderName}</p>

              {/* Glowing Heart wax seal */}
              <div className="relative flex items-center justify-center">
                <div className={`absolute h-14 w-14 rounded-full ${style.accentBg} filter blur-md opacity-35 animate-pulse`} />
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-11 w-11 rounded-full shadow-lg flex items-center justify-center font-bold relative z-10 ${style.envelopeSeal}`}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </motion.div>
              </div>

              <span className={`text-[9px] font-semibold font-mono uppercase tracking-widest mt-6 ${style.accentText}`}>
                Tap Seal to Unfold
              </span>
            </motion.div>
          ) : (
            /* B: Beautiful Handwritten Paper Scroll Letter */
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              onClick={handleLetterBackgroundClick}
              className={`relative w-full h-full p-5 sm:p-8 rounded-3xl border backdrop-blur-md shadow-2xl text-left flex flex-col justify-between overflow-hidden cursor-pointer ${style.bg}`}
            >
              {/* Delicate inside border */}
              <div className={`absolute inset-2 border ${style.accentBorder} rounded-2xl pointer-events-none`} />

              {/* Click-to-spawn hearts representation */}
              {clickedHearts.map(h => (
                <motion.div
                  key={h.id}
                  initial={{ scale: 0.4, opacity: 1, y: 0 }}
                  animate={{ scale: 1.4, opacity: 0, y: -80, rotate: Math.random() * 40 - 20 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  style={{ left: h.x, top: h.y }}
                  className="absolute pointer-events-none text-rose-500/85 z-40"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </motion.div>
              ))}

              {/* Letter Header */}
              <div className="relative border-b border-[#FFD1D1]/60 pb-3 flex justify-between items-center z-20">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#7B6A68]">Personal Scroll</span>
                  <h3 className="font-serif-display text-[#4A2C2A] text-sm font-semibold tracking-wide flex items-center gap-1.5">
                    <Stars className="h-3.5 w-3.5 text-[#FF7B89]" /> Anniversary Delivery
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-[#7B6A68]">Date Log: Locked Opened</span>
                </div>
              </div>

              {/* Scrollable Letter Parchment Content */}
              <div 
                className="flex-1 overflow-y-auto my-4 pr-1 pl-1 text-center sm:text-left custom-scroll select-text z-20"
                id="cursive-letter-body-scroller"
              >
                {/* Dearest Recipient Callout */}
                <p className={`font-cursive text-3.5xl sm:text-4xl ${style.inkColor} mb-4 text-center sm:text-left`}>
                  Dearest {config.recipientName},
                </p>

                {/* Paragraph loops with Typewriter Effect */}
                <div className="flex flex-col gap-4 font-cursive text-xl sm:text-2xl leading-relaxed text-[#5C4240]">
                  {/* Fully Typed paragraphs */}
                  {typedParas.map((para, i) => (
                    <motion.p 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-center sm:text-left px-1 whitespace-pre-wrap"
                    >
                      {para}
                    </motion.p>
                  ))}

                  {/* Actively Typing paragraph */}
                  {!typingComplete && activeParaText && (
                    <p className="text-center sm:text-left px-1 whitespace-pre-wrap text-[#FF7B89]">
                      {activeParaText}
                      <span className="inline-block w-2.5 h-6 ml-1 bg-[#FF7B89] rounded-full animate-ping align-middle" />
                    </p>
                  )}

                  {/* Skip Typewriter button */}
                  {!typingComplete && (
                    <div className="flex justify-center sm:justify-start mt-2">
                      <button
                        onClick={handleSkipTyping}
                        className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider font-mono text-[#FF7B89] bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-full transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <FastForward className="h-3 w-3" /> Skip typing
                      </button>
                    </div>
                  )}
                </div>

                {/* Letter Signature Block */}
                <div className="mt-8 border-t border-dashed border-pink-200/60 pt-4 flex flex-col items-center sm:items-end justify-center">
                  <p className="text-[10px] uppercase font-mono tracking-widest text-[#7B6A68] mb-1">Signed with devotion,</p>
                  <p className={`font-cursive text-3.5xl ${style.accentText}`}>
                    {config.senderName}
                  </p>
                </div>
              </div>

              {/* Footer Actions: Replay Surprise or Toggle Music hint */}
              <div className="pt-2 border-t border-[#FFD1D1]/60 flex items-center justify-between z-20 text-[10px] text-[#7B6A68] select-none">
                <span className="font-mono text-[9px] uppercase tracking-widest flex items-center gap-1">
                  <Stars className="h-3 w-3 text-rose-400" /> Tap anywhere to spark hearts
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Avoid spawning heart trigger
                    onReset();
                  }}
                  className="px-3 py-1 bg-[#FFF9F9] hover:bg-[#FFEAEA] border border-pink-100 text-[#4A2C2A] font-semibold uppercase rounded-md flex items-center gap-1 active:scale-95 transition-all text-[9.5px] shadow-sm cursor-pointer"
                >
                  <CornerDownLeft className="h-3.5 w-3.5 text-[#FF7B89]" />
                  <span>Interactive Map</span>
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
