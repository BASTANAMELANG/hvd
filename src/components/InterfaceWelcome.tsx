import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Stars, Gift, Cake, PartyPopper } from "lucide-react";
import { SurpriseConfig } from "../types";

interface WelcomeProps {
  config: SurpriseConfig;
  onEnter: () => void;
  key?: string | number;
}

// Interactive Floating Birthday Balloon
const FloatingBalloon = ({ 
  baseColor, 
  shineColor = "#ffffff", 
  shadowColor, 
  delay, 
  left, 
  xOffset,
  size = 58
}: { 
  baseColor: string; 
  shineColor?: string; 
  shadowColor: string; 
  delay: number; 
  left: string; 
  xOffset: number[];
  size?: number;
  key?: React.Key;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ y: "115dvh", opacity: 0, rotate: 0 }}
      animate={{ 
        y: ["115dvh", "-25dvh"],
        opacity: [0, 1, 1, 0],
        x: xOffset,
        rotate: [-12, 12, -6, 6, -12]
      }}
      transition={{ 
        duration: 17,
        repeat: Infinity,
        delay: delay,
        ease: "linear"
      }}
      whileHover={{ 
        scale: 1.15,
        rotate: [0, -15, 15, 0],
        zIndex: 30,
        transition: { duration: 0.6, ease: "easeInOut" }
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="absolute cursor-pointer z-10 select-none touch-none filter drop-shadow-lg"
      style={{ left }}
    >
      <div className="relative flex flex-col items-center">
        {/* Balloon balloon bubble with 3D glossy radial gradient */}
        <div 
          className="rounded-t-full rounded-b-[44px] relative transition-transform duration-300"
          style={{ 
            width: `${size}px`, 
            height: `${size * 1.3}px`,
            background: `radial-gradient(circle at 35% 30%, ${shineColor} 0%, ${baseColor} 55%, ${shadowColor} 100%)`,
          }}
        >
          {/* Main intense highlight shine */}
          <div className="absolute top-2.5 left-3.5 w-4 h-6 bg-white/45 rounded-full blur-[0.6px] rotate-[26deg]" />
          
          {/* Subtle reflection overlay rim */}
          <div className="absolute inset-2.5 border-t-2 border-l border-white/20 rounded-full pointer-events-none" />
        </div>

        {/* Balloon Knot (Triangle) */}
        <div 
          className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px]"
          style={{ 
            borderBottomColor: baseColor,
            marginTop: "-2px",
            zIndex: 2
          }}
        />

        {/* Dangling wavy string */}
        <motion.svg 
          width="24" 
          height="80" 
          viewBox="0 0 24 80" 
          className="opacity-60 -mt-1.5 pointer-events-none"
          animate={hovered ? {
            rotate: [0, -25, 25, -12, 12, 0],
            scaleX: [1, 1.25, 0.75, 1.15, 1],
          } : {
            rotate: [-5, 5, -5],
          }}
          transition={hovered ? {
            duration: 1.2,
            ease: "easeInOut"
          } : {
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        >
          <path 
            d="M12,0 C17,17 7,34 17,51 C7,64 14,74 12,80" 
            fill="none" 
            stroke="#7B6A68" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </motion.svg>
      </div>
    </motion.div>
  );
};

export default function InterfaceWelcome({ config, onEnter }: WelcomeProps) {
  const getThemeGlassClass = () => {
    switch (config.theme) {
      case "royal":
        return "bg-white/75 border-amber-200 shadow-amber-100/30 text-[#4A2C2A]";
      case "lavender":
        return "bg-white/75 border-fuchsia-200 shadow-fuchsia-100/30 text-[#4A2C2A]";
      case "emerald":
        return "bg-white/75 border-emerald-200 shadow-emerald-100/30 text-[#4A2C2A]";
      case "rose":
      default:
        return "bg-white/75 border-[#FFD1D1] shadow-pink-100/30 text-[#4A2C2A]";
    }
  };

  const getAccentTextClass = () => {
    switch (config.theme) {
      case "royal": return "text-amber-500";
      case "lavender": return "text-fuchsia-500";
      case "emerald": return "text-emerald-500";
      case "rose":
      default: return "text-[#FF7B89]";
    }
  };

  const getGradientBtnClass = () => {
    switch (config.theme) {
      case "royal":
        return "from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#4A2C2A] shadow-md shadow-amber-200/50";
      case "lavender":
        return "from-fuchsia-400 via-purple-400 to-indigo-500 hover:from-fuchsia-550 hover:to-indigo-600 text-white shadow-md shadow-fuchsia-200/50";
      case "emerald":
        return "from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-550 hover:to-emerald-600 text-white shadow-md shadow-emerald-200/50";
      case "rose":
      default:
        return "from-[#FF7B89] via-pink-400 to-rose-400 hover:from-rose-500 hover:to-rose-600 text-white shadow-md shadow-pink-200/50";
    }
  };

  // Determine balloon properties based on theme
  const getThemeBalloons = () => {
    switch (config.theme) {
      case "royal":
        return [
          { base: "#D4AF37", shadow: "#A67C00", shine: "#FFF8E7", delay: 0, left: "7%", xOffset: [0, 18, -12, 8, 0] },
          { base: "#FBBF24", shadow: "#B45309", shine: "#FFFBEB", delay: 4, left: "84%", xOffset: [0, -22, 12, -7, 0] },
          { base: "#F97316", shadow: "#C2410C", shine: "#FFF7ED", delay: 2, left: "19%", xOffset: [0, 22, -18, 12, 0] },
          { base: "#EAB308", shadow: "#854D0E", shine: "#FEF08A", delay: 6, left: "74%", xOffset: [0, -18, 18, -12, 0] }
        ];
      case "lavender":
        return [
          { base: "#C084FC", shadow: "#7E22CE", shine: "#FAF5FF", delay: 0, left: "7%", xOffset: [0, 18, -12, 8, 0] },
          { base: "#E879F9", shadow: "#A21CAF", shine: "#FDF4FF", delay: 4, left: "84%", xOffset: [0, -22, 12, -7, 0] },
          { base: "#818CF8", shadow: "#4338CA", shine: "#EEF2FF", delay: 2, left: "19%", xOffset: [0, 22, -18, 12, 0] },
          { base: "#F472B6", shadow: "#BE185D", shine: "#FDF2F8", delay: 6, left: "74%", xOffset: [0, -18, 18, -12, 0] }
        ];
      case "emerald":
        return [
          { base: "#34D399", shadow: "#047857", shine: "#ECFDF5", delay: 0, left: "7%", xOffset: [0, 18, -12, 8, 0] },
          { base: "#2DD4BF", shadow: "#0F766E", shine: "#F0FDFA", delay: 4, left: "84%", xOffset: [0, -22, 12, -7, 0] },
          { base: "#22D3EE", shadow: "#0369A1", shine: "#ECFEFF", delay: 2, left: "19%", xOffset: [0, 22, -18, 12, 0] },
          { base: "#4ADE80", shadow: "#15803D", shine: "#F0FDF4", delay: 6, left: "74%", xOffset: [0, -18, 18, -12, 0] }
        ];
      case "rose":
      default:
        return [
          { base: "#FF7B89", shadow: "#D93D50", shine: "#FFF1F2", delay: 0, left: "7%", xOffset: [0, 18, -12, 8, 0] },
          { base: "#F472B6", shadow: "#BE185D", shine: "#FDF2F8", delay: 4, left: "84%", xOffset: [0, -22, 12, -7, 0] },
          { base: "#FDA4AF", shadow: "#E11D48", shine: "#FFF5F5", delay: 2, left: "19%", xOffset: [0, 22, -18, 12, 0] },
          { base: "#FB7185", shadow: "#BE123C", shine: "#FFF1F2", delay: 6, left: "74%", xOffset: [0, -18, 18, -12, 0] }
        ];
    }
  };

  const balloons = getThemeBalloons();

  return (
    <motion.div
      id="welcome-interface-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 z-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial from-white/10 via-white/50 to-[#FFF9F9]/80 pointer-events-none" />

      {/* Decorative Floating Balloons - visible on all screens with auto-safe margins */}
      {balloons.map((b, i) => (
        <FloatingBalloon 
          key={i}
          baseColor={b.base} 
          shadowColor={b.shadow} 
          shineColor={b.shine} 
          delay={b.delay} 
          left={b.left} 
          xOffset={b.xOffset} 
        />
      ))}

      {/* Main Luxury Greeting Card Container */}
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
        className={`relative w-full max-w-lg px-6 py-12 sm:px-12 sm:py-16 rounded-3xl border backdrop-blur-md shadow-2xl text-center flex flex-col items-center justify-center ${getThemeGlassClass()}`}
      >
        {/* Sparkle and design boundaries */}
        <div className="absolute top-4 left-4 text-neutral-400/60 font-mono text-[9px] uppercase tracking-widest hidden sm:block">
          Birthday Presentation
        </div>
        <div className="absolute bottom-4 right-4 text-neutral-400/60 font-mono text-[9px] uppercase tracking-widest hidden sm:block">
          Click below to open
        </div>

        {/* Ambient Ring */}
        <div 
          className="absolute inset-1 rounded-[22px] border border-pink-100/40 pointer-events-none scale-98" 
        />

        {/* Decorative Top Accent with Cake, Gift, and Poppers */}
        <div className="mb-5 flex gap-4.5 items-center justify-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className={`opacity-80 ${getAccentTextClass()}`}
          >
            <PartyPopper className="h-6 w-6" />
          </motion.div>

          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="flex gap-1.5 items-center justify-center text-rose-400"
          >
            <Cake className={`h-11 w-11 ${getAccentTextClass()}`} />
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.4 }}
            className={`opacity-80 ${getAccentTextClass()}`}
          >
            <Gift className="h-6 w-6" />
          </motion.div>
        </div>

        {/* Cursive Recipient Header */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-cursive text-4xl sm:text-5xl text-[#4A2C2A] mb-3"
        >
          Dearest {config.recipientName}
        </motion.p>

        {/* Serif Display Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="font-serif-display text-2.5xl sm:text-3.5xl font-bold tracking-wider uppercase leading-snug mb-5 text-[#4A2C2A]"
        >
          A Magnificent Birthday <br />
          <span className={`bg-gradient-to-r ${config.theme === "royal" ? "from-amber-600 to-yellow-600" : "from-[#FF7B89] to-pink-500"} bg-clip-text text-transparent`}>
            Surprise Awaits
          </span>
        </motion.h1>

        {/* Explanation Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="text-[#7B6A68] text-xs sm:text-sm tracking-wide font-light max-w-sm leading-relaxed mb-9"
        >
          Unveil lovely drifting paper-craft heart animations, a charming digital music box, and a locked gift envelope. Tap below to begin the birthday timeline!
        </motion.p>

        {/* The Action Button */}
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 15 }}
          onClick={onEnter}
          id="enter-surprise-journey-btn"
          className={`relative px-8 py-4 font-sans-body uppercase tracking-widest text-xs font-bold rounded-full bg-gradient-to-r shadow-lg hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer z-20 ${getGradientBtnClass()}`}
        >
          <Heart className="h-4.5 w-4.5 fill-current animate-pulse text-white/90" />
          <span>Enter surprise</span>
          <Stars className="h-4.5 w-4.5 text-white/90" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
