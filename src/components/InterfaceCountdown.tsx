import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Unlock, Sparkles, Clock, AlertCircle } from "lucide-react";
import { SurpriseConfig } from "../types";

interface CountdownProps {
  config: SurpriseConfig;
  onOpenPresent: () => void;
  triggerBurst: () => void;
  key?: string | number;
}

export default function InterfaceCountdown({ config, onOpenPresent, triggerBurst }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: false });
  const [wiggle, setWiggle] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Parse target date and maintain timer loop
  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(config.birthdayDate).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return true; // Over
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
      return false;
    };

    calculateTime();
    const interval = setInterval(() => {
      const isOver = calculateTime();
      if (isOver) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [config.birthdayDate]);

  const handlePresentClick = () => {
    if (timeLeft.isOver) {
      // Trigger major celebratory explosion & open up letter!
      triggerBurst();
      onOpenPresent();
    } else {
      // Trigger wiggle animation & show patient hint
      setWiggle(true);
      setShowHint(true);
      triggerBurst(); // mini sparkle
      setTimeout(() => setWiggle(false), 500);
      setTimeout(() => setShowHint(false), 3500);
    }
  };

  const getThemeColors = () => {
    switch (config.theme) {
      case "royal":
        return {
          cardBg: "bg-white/75 border-amber-200 shadow-xl shadow-amber-100/30 text-[#4A2C2A]",
          accentText: "text-amber-600 font-bold",
          goldText: "from-[#4A2C2A] via-[#85603F] to-[#4A2C2A]",
          ribbon: "fill-amber-400",
          box: "fill-amber-500",
          boxCap: "fill-amber-600 font-bold",
          ringColor: "border-amber-200/40"
        };
      case "lavender":
        return {
          cardBg: "bg-white/75 border-fuchsia-200 shadow-xl shadow-fuchsia-100/30 text-[#4A2C2A]",
          accentText: "text-fuchsia-600 font-bold",
          goldText: "from-[#4A2C2A] via-[#7C4D80] to-[#4A2C2A]",
          ribbon: "fill-fuchsia-400",
          box: "fill-fuchsia-500",
          boxCap: "fill-fuchsia-600",
          ringColor: "border-fuchsia-200/40"
        };
      case "emerald":
        return {
          cardBg: "bg-white/75 border-emerald-200 shadow-xl shadow-emerald-100/30 text-[#4A2C2A]",
          accentText: "text-emerald-600 font-bold",
          goldText: "from-[#4A2C2A] via-[#437A5D] to-[#4A2C2A]",
          ribbon: "fill-emerald-400",
          box: "fill-emerald-500",
          boxCap: "fill-emerald-600",
          ringColor: "border-emerald-200/40"
        };
      case "rose":
      default:
        return {
          cardBg: "bg-white/75 border-[#FFD1D1] shadow-xl shadow-pink-100/30 text-[#4A2C2A]",
          accentText: "text-[#FF7B89] font-bold",
          goldText: "from-[#4A2C2A] via-[#FF7B89] to-[#4A2C2A]",
          ribbon: "fill-[#FF7B89]",
          box: "fill-[#FFE2E2]",
          boxCap: "fill-[#FFD1D1]",
          ringColor: "border-pink-300/35"
        };
    }
  };

  const colors = getThemeColors();

  // Helper formatting to zero-pad
  const pad = (num: number) => num.toString().padStart(2, "0");

  return (
    <motion.div
      id="countdown-interface-container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 z-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial from-white/10 via-white/50 to-[#FFF9F9]/80 pointer-events-none" />

      {/* Main Glass Screen Card */}
      <div className={`relative w-full max-w-2xl px-4 py-8 sm:p-10 rounded-3xl border backdrop-blur-md shadow-2xl text-center flex flex-col items-center justify-between overflow-hidden ${colors.cardBg}`}>
        
        {/* Subtle Decorative Outline Ring */}
        <div className={`absolute inset-1 rounded-[22px] border ${colors.ringColor} pointer-events-none`} />

        {/* Small floating birthday cake and candle decorations in corner of card */}
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#FFF9F9] border border-pink-100 rounded-full shadow-md flex items-center justify-center opacity-80 animate-bounce hidden sm:flex">
          <span className="text-2xl">🍰</span>
        </div>
        <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-[#FFF9F9] border border-pink-100 rounded-full shadow-md flex items-center justify-center opacity-80 animate-bounce hidden sm:flex" style={{ animationDelay: "1s" }}>
          <span className="text-2xl">🎈</span>
        </div>

        {/* Header - Recipient Name & Message */}
        <div className="relative mb-6">
          <div className="flex items-center justify-center gap-1.5 mb-1 justify-center">
            <span className="text-sm">🎉</span>
            <span className={`text-[9px] uppercase font-mono tracking-widest ${colors.accentText} block`}>
              The Birthday Timeline
            </span>
            <span className="text-sm">🎉</span>
          </div>
          <h2 className="font-cursive text-4xl text-[#4A2C2A] font-medium leading-tight">
            For Sweet {config.recipientName}
          </h2>
          {timeLeft.isOver ? (
            <div className="mt-2 p-1 bg-pink-50 border border-pink-200 rounded-2xl flex items-center justify-center gap-2 max-w-sm mx-auto shadow-sm">
              <p className="text-[#FF7B89] text-xs sm:text-sm font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 animate-pulse">
                <Sparkles className="h-4.5 w-4.5 text-[#FF7B89]" /> UNLOCKED! OPEN YOUR GIFT NOW! 🎂
              </p>
            </div>
          ) : (
            <p className="text-[#7B6A68] text-xs font-light tracking-wide mt-1.5 max-w-md mx-auto">
              Your magical gift box is locked for your special day. It will instantly unlock with music when the clock strikes!
            </p>
          )}
        </div>

        {/* 1. Grid Countdown Timer (Vibrant countdown-box styles with pink shadows) */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md w-full mb-8 relative px-2">
          {[
            { label: "Days", value: pad(timeLeft.days), emoji: "🗓️" },
            { label: "Hours", value: pad(timeLeft.hours), emoji: "⏰" },
            { label: "Mins", value: pad(timeLeft.minutes), emoji: "⌛" },
            { label: "Secs", value: pad(timeLeft.seconds), emoji: "🎈" },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white/90 rounded-xl sm:rounded-2xl border border-pink-100 p-2.5 sm:p-5 flex flex-col items-center relative overflow-hidden shadow-md transition-all hover:scale-105"
            >
              <div className="absolute top-1 right-1 text-[8px] sm:text-[10px] opacity-40">{item.emoji}</div>
              {/* Digit with premium serif feel */}
              <span className={`font-serif-display text-2.5xl sm:text-4.5xl font-extrabold tracking-tight bg-gradient-to-b ${colors.goldText} bg-clip-text text-transparent`}>
                {item.value}
              </span>
              {/* Metric Label */}
              <span className="text-[8px] sm:text-[10px] uppercase font-mono tracking-widest text-[#7B6A68] mt-1 opacity-75 font-semibold">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* 2. Interactive Graphic Present Box with customizable SVG and lock */}
        <div className="relative flex flex-col items-center justify-center min-h-[220px]">
          <motion.div
            animate={wiggle ? {
              rotate: [0, -7, 7, -5, 5, 0],
              x: [0, -4, 4, -3, 3, 0],
            } : timeLeft.isOver ? {
              scale: [1, 1.03, 1],
              rotate: [0, 1, -1, 0]
            } : {}}
            transition={{
              duration: wiggle ? 0.5 : 3,
              repeat: timeLeft.isOver ? Infinity : 0,
              repeatType: "reverse"
            }}
            onClick={handlePresentClick}
            className="cursor-pointer select-none group relative max-w-[190px]"
          >
            {/* Pulsating back glows */}
            <div className={`absolute -inset-4 bg-radial from-[#FF7B89]/20 to-transparent rounded-full filter blur-xl transition-all duration-350 opacity-40 group-hover:opacity-60 scale-110 ${timeLeft.isOver ? "animate-pulse" : ""}`} />

            {/* Custom SVG Gift Ribbon Box */}
            <svg 
              viewBox="0 0 200 200" 
              className={`w-40 h-40 drop-shadow-2xl relative select-none z-10 transition-transform ${timeLeft.isOver ? "hover:scale-105 active:scale-95" : ""}`}
            >
              {/* Ribbon Bow elements */}
              <path d="M60,65 C40,40 85,25 95,65 C105,25 150,40 130,65 Z" className={colors.ribbon} />
              <circle cx="95" cy="65" r="9" className="fill-[#FF7B89]" />

              {/* Gift Cover Cap */}
              <rect x="42" y="70" width="106" height="24" rx="4" className={colors.boxCap} />
              
              {/* Box Base body */}
              <rect x="50" y="93" width="90" height="75" rx="3" className={colors.box} />

              {/* Vertical Ribbon band */}
              <rect x="88" y="70" width="14" height="98" className="fill-[#FF7B89]/40" />
              {/* Horizontal Ribbon band */}
              <rect x="42" y="79" width="106" height="7" className="fill-[#FF7B89]/40" />

              {/* Delicate Star sparkles overlay */}
              {timeLeft.isOver && (
                <>
                  <circle cx="65" cy="115" r="3" className="fill-[#FF7B89]/60 sparkle-slow" style={{ animationDelay: "0.2s" }} />
                  <circle cx="120" cy="140" r="2.5" className="fill-[#FF7B89]/80 sparkle-slow" style={{ animationDelay: "1.2s" }} />
                  <circle cx="125" cy="100" r="2" className="fill-[#FF7B89]/50 sparkle-slow" style={{ animationDelay: "0.5s" }} />
                </>
              )}
            </svg>

            {/* Locked vs. Opened Status Icon hanging on core ribbon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[2px] z-20">
              <AnimatePresence mode="wait">
                {timeLeft.isOver ? (
                  <motion.div
                    key="unlocked"
                    initial={{ scale: 0.6, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1.1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="p-2.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 shadow-lg animate-bounce"
                  >
                    <Unlock className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="locked"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="p-2.5 rounded-full bg-amber-50 border border-amber-300 text-amber-600 shadow-lg"
                  >
                    <Lock className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Locked patience helper callouts */}
          <div className="h-10 mt-2 relative">
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-4 py-1.5 bg-white border border-pink-100 rounded-lg text-[10px] text-amber-700 shadow-md font-mono flex items-center gap-1"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  <span>Opens when the countdown ends! ({config.birthdayDate.replace("T", " ")})</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Lock Hint Banner or Trigger Button */}
        <div className="w-full mt-6">
          {timeLeft.isOver ? (
            <motion.button
              onClick={handlePresentClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg transition-all"
            >
              Click Gift Box to Open!
            </motion.button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-1.5 text-[#7B6A68] text-[10px] uppercase font-mono tracking-widest">
                <Clock className="h-3.5 w-3.5 text-[#FF7B89]" />
                <span>Target lock: {new Date(config.birthdayDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
