import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { SurpriseConfig, DEFAULT_CONFIG } from "./types";
import SurpriseCanvas from "./components/SurpriseCanvas";
import AudioPlayer from "./components/AudioPlayer";
import InterfaceWelcome from "./components/InterfaceWelcome";
import InterfaceCountdown from "./components/InterfaceCountdown";
import InterfaceLetter from "./components/InterfaceLetter";

export default function App() {
  const [activeInterface, setActiveInterface] = useState<1 | 2 | 3>(1);
  const [config, setConfig] = useState<SurpriseConfig>(DEFAULT_CONFIG);
  const [autoplayTrigger, setAutoplayTrigger] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  // 1. Initial configuration loading (Decode link hash or parse localStorage)
  useEffect(() => {
    // A: Try parsing URL search parameter
    try {
      const params = new URLSearchParams(window.location.search);
      const encodedConfig = params.get("c");
      if (encodedConfig) {
        // base64 decode and URL decode
        const decodedStr = decodeURIComponent(atob(encodedConfig));
        const parsed = JSON.parse(decodedStr);
        
        // Reconstruct full verified configuration object
        const finalObj: SurpriseConfig = {
          recipientName: parsed.r || DEFAULT_CONFIG.recipientName,
          senderName: parsed.s || DEFAULT_CONFIG.senderName,
          birthdayDate: parsed.d || DEFAULT_CONFIG.birthdayDate,
          letterParagraphs: parsed.l || DEFAULT_CONFIG.letterParagraphs,
          musicUrl: parsed.m || DEFAULT_CONFIG.musicUrl,
          theme: parsed.t || DEFAULT_CONFIG.theme
        };
        setConfig(finalObj);
        return; // Prioritize query params over localStorage
      }
    } catch (e) {
      console.warn("Invalid config payload in URL, falling back.", e);
    }

    // B: Fallback to localStorage
    try {
      const local = localStorage.getItem("birthday_surprise_config_v2");
      if (local) {
        setConfig(JSON.parse(local));
      }
    } catch (err) {
      console.warn("Error reading localStorage", err);
    }
  }, []);

  // Update configuration and persist locally
  const handleUpdateConfig = (newConfig: SurpriseConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem("birthday_surprise_config_v2", JSON.stringify(newConfig));
    } catch (err) {
      console.warn("Saving to localstorage failed", err);
    }
  };

  const handleEnterExperience = () => {
    setAutoplayTrigger(true); // Triggers standard music playback
    setBurstCount(prev => prev + 1); // Launch introductory petals!
    setActiveInterface(2); // Progress to countdown card
  };

  const triggerCelebrateBurst = () => {
    setBurstCount(prev => prev + 1);
  };

  // Aesthetic theme container classes (smooth royal slate, starry dusk, warm rose velvet)
  const getThemeBackgroundClass = () => {
    switch (config.theme) {
      case "royal":
        // Gold / Champagne Luxury theme
        return "from-[#FAF6EE] via-[#FFFDF9] to-[#F5ECE0]";
      case "lavender":
        // Lavender / Lilac theme
        return "from-[#FAF5FF] via-[#FFF9FF] to-[#F1E4FF]";
      case "emerald":
        // Emerald / Mint theme
        return "from-[#F4FBF7] via-[#FFFDFB] to-[#E6F4EA]";
      case "rose":
      default:
        // Soft Sunset twilight / Classic rose red theme
        return "from-[#FFF9F9] via-[#FFF2F2] to-[#FFEAEA]";
    }
  };

  return (
    <div 
      id="root-surprise-display-canvas"
      className={`relative w-screen h-screen overflow-hidden bg-gradient-to-tr ${getThemeBackgroundClass()} flower-bg text-[#4A2C2A] select-none transition-all duration-1000 flex flex-col justify-between`}
    >
      {/* 1. HTML5 Canvas Particles System (Behind layouts) */}
      <SurpriseCanvas 
        intensity={activeInterface === 3 ? "festive" : "dreamy"} 
        burstOnTrigger={burstCount}
        theme={config.theme}
      />

      {/* Ambient background blur glows styled professionally */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-[#FF7B89]/10 filter blur-3xl ambient-glow" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#D4AF37]/10 filter blur-3xl ambient-glow" style={{ animationDelay: "3s" }} />

      {/* 3. Main Stage Container (Centers cards and remains perfectly responsive) */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center relative p-3 sm:p-6 z-20">
        <AnimatePresence mode="wait">
          {activeInterface === 1 && (
            <InterfaceWelcome 
              key="welcome"
              config={config} 
              onEnter={handleEnterExperience} 
            />
          )}

          {activeInterface === 2 && (
            <InterfaceCountdown 
              key="countdown"
              config={config} 
              onOpenPresent={() => setActiveInterface(3)}
              triggerBurst={triggerCelebrateBurst}
            />
          )}

          {activeInterface === 3 && (
            <InterfaceLetter 
              key="letter"
              config={config} 
              onReset={() => {
                setActiveInterface(2);
                triggerCelebrateBurst();
              }}
              triggerBurst={triggerCelebrateBurst}
            />
          )}
        </AnimatePresence>
      </main>

      {/* 4. Atmosphere Ambient Music Player Bottom Bar */}
      <AudioPlayer 
        musicUrl={config.musicUrl} 
        autoplayTriggered={autoplayTrigger}
        theme={config.theme}
      />

      {/* Elegant design status stamp - No telemetry, simple literal badge */}
      <footer className="w-full text-center py-2.5 z-20 pointer-events-none select-none text-[9px] uppercase tracking-widest font-mono text-[#7B6A68]/80">
        {config.theme === "royal" ? "Champagne Collection" : "Rose Garden Edition"} • Crafted with Love by Xtian
      </footer>
    </div>
  );
}

