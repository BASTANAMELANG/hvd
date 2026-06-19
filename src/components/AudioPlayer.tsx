import React, { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX, Play, Pause, RefreshCw } from "lucide-react";

interface AudioPlayerProps {
  musicUrl: string;
  autoplayTriggered: boolean;
  theme?: "royal" | "rose" | "lavender" | "emerald";
}

// Built-in melodic chimes table for Happy Birthday in Web Audio Synth!
// Pair of [Note frequency (Hz), Duration (ms)]
const HAPPY_BIRTHDAY_MELODY = [
  [261.63, 300], [261.63, 100], [293.66, 400], [261.63, 400], [349.23, 400], [329.63, 800], // Happy birthday to you
  [261.63, 300], [261.63, 100], [293.66, 400], [261.63, 400], [392.00, 400], [349.23, 800], // Happy birthday to you
  [261.63, 300], [261.63, 100], [523.25, 400], [440.00, 400], [349.23, 400], [329.63, 400], [293.66, 800], // Happy birthday dear...
  [466.16, 300], [466.16, 100], [440.00, 400], [349.23, 400], [392.00, 400], [349.23, 800], // Happy birthday to you
];

export default function AudioPlayer({ musicUrl, autoplayTriggered, theme = "rose" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [audioSource, setAudioSource] = useState<"url" | "synth">("synth");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const noteIndexRef = useRef(0);

  // Initialize standard audio
  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Test if URL is streamable or has CORS issues
    audio.addEventListener("error", () => {
      console.warn("External MP3 load failed or blocked. Fallback to Music Box Synthesizer.");
      setAudioSource("synth");
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [musicUrl]);

  // Sync volume state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Procedural Web Audio Synth Box Player
  const playSynthNote = (freq: number, duration: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine"; // Pure bell chime
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Music box soft decay envelope
      gainNode.gain.setValueAtTime(isMuted ? 0 : volume * 0.22, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);

      // Add a higher-frequency harmonic overlay for bell chime texture
      const harmonicOsc = ctx.createOscillator();
      const harmonicGain = ctx.createGain();
      harmonicOsc.type = "sine";
      harmonicOsc.frequency.setValueAtTime(freq * 2, ctx.currentTime);
      harmonicGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.08, ctx.currentTime);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (duration * 0.8) / 1000);

      // Connections
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      harmonicOsc.connect(harmonicGain);
      harmonicGain.connect(ctx.destination);

      osc.start();
      harmonicOsc.start();

      osc.stop(ctx.currentTime + duration / 1000);
      harmonicOsc.stop(ctx.currentTime + duration / 1000);
    } catch (e) {
      console.error("Synthesizer error", e);
    }
  };

  const startSynthLoop = () => {
    if (synthIntervalRef.current) window.clearInterval(synthIntervalRef.current);
    noteIndexRef.current = 0;

    const runMelodyStep = () => {
      if (noteIndexRef.current >= HAPPY_BIRTHDAY_MELODY.length) {
        noteIndexRef.current = 0; // loop
      }
      const [freq, duration] = HAPPY_BIRTHDAY_MELODY[noteIndexRef.current];
      playSynthNote(freq, duration);
      
      // Schedule next note
      noteIndexRef.current++;
      const nextDelay = duration + 100;
      synthIntervalRef.current = window.setTimeout(runMelodyStep, nextDelay);
    };

    runMelodyStep();
  };

  const stopSynthLoop = () => {
    if (synthIntervalRef.current) {
      window.clearTimeout(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Manage Play Toggle
  const triggerPlay = () => {
    if (isPlaying) {
      // Pause
      if (audioSource === "url" && audioRef.current) {
        audioRef.current.pause();
      } else {
        stopSynthLoop();
      }
      setIsPlaying(false);
    } else {
      // Play
      setIsPlaying(true);
      if (audioSource === "url" && audioRef.current) {
        audioRef.current.play().catch(() => {
          // If browser blocker hits or network blocks, flip to chimes synth immediately
          console.log("CORS/Autoplay blocked MP3. Launching Chimes Synthesizer.");
          setAudioSource("synth");
          startSynthLoop();
        });
      } else {
        startSynthLoop();
      }
    }
  };

  const toggleSource = () => {
    // Stop whatever is playing
    if (isPlaying) {
      if (audioSource === "url" && audioRef.current) {
        audioRef.current.pause();
      } else {
        stopSynthLoop();
      }
    }

    const nextSource = audioSource === "url" ? "synth" : "url";
    setAudioSource(nextSource);

    // If already playing, spin up the new sound source immediately
    if (isPlaying) {
      if (nextSource === "url" && audioRef.current) {
        audioRef.current.play().catch(() => {
          setAudioSource("synth");
          startSynthLoop();
        });
      } else {
        startSynthLoop();
      }
    }
  };

  // Observe Autoplay state from Main Page
  useEffect(() => {
    if (autoplayTriggered && !isPlaying) {
      setIsPlaying(true);
      if (audioSource === "url" && audioRef.current) {
        audioRef.current.play().catch(() => {
          setAudioSource("synth");
          startSynthLoop();
        });
      } else {
        startSynthLoop();
      }
    }
  }, [autoplayTriggered]);

  const themeAccentClass = () => {
    switch (theme) {
      case "royal": return "text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100/50";
      case "lavender": return "text-fuchsia-800 bg-fuchsia-50 border-fuchsia-200 hover:bg-fuchsia-100/50";
      case "emerald": return "text-emerald-800 bg-emerald-50 border-emerald-200 hover:bg-emerald-100/50";
      case "rose":
      default: return "text-[#FF7B89] bg-[#FFF9F9] border-pink-100 hover:bg-[#FFEAEA]";
    }
  };

  const themeSliderClass = () => {
    switch (theme) {
      case "royal": return "accent-amber-500";
      case "lavender": return "accent-fuchsia-500";
      case "emerald": return "accent-emerald-500";
      case "rose":
      default: return "accent-[#FF7B89]";
    }
  };

  return (
    <div 
      id="bg-music-controls-container"
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-pink-250 shadow-md transition-all duration-300 group max-w-sm`}
    >
      {/* Dynamic Animated Music Icon */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleSource}
          title={audioSource === "url" ? "Switch to Chimes Web Synthesizer" : "Switch to Instrument Web Instrumental MP3"}
          className={`p-1 rounded-full border transition-all text-[11px] flex items-center gap-1 cursor-pointer ${themeAccentClass()}`}
        >
          <RefreshCw className="h-3 w-3 animate-spin-slow text-[#FF7B89]" />
          <span className="font-mono text-[8px] uppercase tracking-wider font-semibold">
            {audioSource === "url" ? "MP3" : "Chimes"}
          </span>
        </button>

        <button
          onClick={triggerPlay}
          id="audio-play-pause-btn"
          className="p-1.5 rounded-full bg-[#FFF9F9] border border-pink-100 text-[#FF7B89] hover:bg-[#FFEAEA] active:scale-95 transition-all cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 animate-pulse text-[#FF7B89]" />
          ) : (
            <Play className="h-3.5 w-3.5 text-[#FF7B89]" />
          )}
        </button>
      </div>

      {/* Title / Track Scroll */}
      <div className="hidden sm:flex flex-col select-none pr-1">
        <span className="text-[8px] uppercase font-mono tracking-widest text-[#7B6A68]">Atmosphere</span>
        <span className="text-[11px] font-semibold text-[#4A2C2A] max-w-[70px] overflow-hidden text-ellipsis whitespace-nowrap">
          {audioSource === "url" ? "Ambient Piano Loop" : "Nostalgic Chimes"}
        </span>
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-1.5 border-l border-pink-150 pl-1.5">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-[#7B6A68] hover:text-[#FF7B89] transition-all cursor-pointer"
        >
          {isMuted || volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className={`w-11 h-1 rounded-lg bg-pink-100/50 appearance-none cursor-pointer ${themeSliderClass()}`}
        />
      </div>
    </div>
  );
}
