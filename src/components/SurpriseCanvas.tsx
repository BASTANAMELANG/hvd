import React, { useEffect, useRef } from "react";
import { HeartOrFlower } from "../types";

interface CanvasProps {
  intensity?: "gentle" | "dreamy" | "festive";
  burstOnTrigger?: number; // Increment this from parent to trigger a major celebratory burst
  theme?: "royal" | "rose" | "lavender" | "emerald";
}

export default function SurpriseCanvas({ intensity = "dreamy", burstOnTrigger = 0, theme = "rose" }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<HeartOrFlower[]>([]);
  const nextIdRef = useRef(0);
  const burstTrackerRef = useRef(burstOnTrigger);

  // Theme-specific colors for hearts/flowers
  const getColors = () => {
    switch (theme) {
      case "royal":
        return {
          hearts: ["#fbbf24", "#f59e0b", "#d97706", "#fef08a"], // Gold/Champagne
          petals: ["#818cf8", "#6366f1", "#4f46e5", "#c7d2fe"], // Indigo/Royal Blue
          sparkles: ["#ffffff", "#fef08a", "#ffe4e6"],
        };
      case "lavender":
        return {
          hearts: ["#c084fc", "#a855f7", "#8b5cf6", "#e9d5ff"], // Lavender/Violet
          petals: ["#f472b6", "#ec4899", "#fbcfe8", "#f43f5e"], // Hot Pink
          sparkles: ["#ffffff", "#e9d5ff", "#c084fc"],
        };
      case "emerald":
        return {
          hearts: ["#34d399", "#10b981", "#059669", "#a7f3d0"], // Emerald
          petals: ["#fbbf24", "#f59e0b", "#fbcfe8", "#f43f5e"], // Accent Amber/Rose
          sparkles: ["#ffffff", "#fef08a", "#6ee7b7"],
        };
      case "rose":
      default:
        return {
          hearts: ["#f43f5e", "#fda4af", "#ec4899", "#ffe4e6"], // Roses/Soft Pinks
          petals: ["#fb7185", "#f43f5e", "#fda4af", "#ffe4e6"], // Soft rose petals
          sparkles: ["#ffffff", "#fef08a", "#fda4af"],
        };
    }
  };

  const createParticle = (x: number, y: number, isBurst = false): HeartOrFlower => {
    const palette = getColors();
    const typeRand = Math.random();
    let type: "heart" | "rose" | "cherry" | "star" = "heart";
    let colorList = palette.hearts;

    if (typeRand < 0.4) {
      type = "heart";
      colorList = palette.hearts;
    } else if (typeRand < 0.75) {
      type = Math.random() > 0.5 ? "rose" : "cherry";
      colorList = palette.petals;
    } else {
      type = "star";
      colorList = palette.sparkles;
    }

    const randomColor = colorList[Math.floor(Math.random() * colorList.length)];
    const size = isBurst 
      ? Math.random() * 12 + 6 
      : Math.random() * 15 + 8;

    return {
      id: nextIdRef.current++,
      x,
      y,
      size,
      type,
      color: randomColor,
      speedY: isBurst ? (Math.random() * 4 - 2) : (Math.random() * 1.2 + 0.5), // falls or flies
      speedX: isBurst ? (Math.random() * 4 - 2) : (Math.random() * 0.6 - 0.3),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() * 0.02 - 0.01) * (isBurst ? 3 : 1),
      opacity: Math.random() * 0.4 + 0.6,
    };
  };

  // Click/Touch burst handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const clickX = ((clientX - rect.left) / rect.width) * 100;
    const clickY = ((clientY - rect.top) / rect.height) * 100;

    // Spawn 15-20 particles at coordinate
    const newBurst: HeartOrFlower[] = [];
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      const p = createParticle(clickX, clickY, true);
      // Give initial radial push
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
      const force = Math.random() * 2.5 + 1.2;
      p.speedX = Math.cos(angle) * force;
      p.speedY = Math.sin(angle) * force;
      newBurst.push(p);
    }

    particlesRef.current = [...particlesRef.current, ...newBurst];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Populate initial background particles
    const initialCount = intensity === "gentle" ? 25 : intensity === "dreamy" ? 55 : 85;
    const initialParticles: HeartOrFlower[] = [];
    for (let i = 0; i < initialCount; i++) {
      initialParticles.push({
        ...createParticle(Math.random() * 100, Math.random() * 100, false),
        // stagger them vertically
        y: Math.random() * 100
      });
    }
    particlesRef.current = initialParticles;

    // Drawing helpers
    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      // Cardioid mapping drawing
      c.moveTo(0, -size / 4);
      c.bezierCurveTo(-size / 2, -size / 1.2, -size, -size / 3, -size, size / 6);
      c.bezierCurveTo(-size, size / 1.5, -size / 3, size * 1.1, 0, size * 1.4);
      c.bezierCurveTo(size / 3, size * 1.1, size, size / 1.5, size, size / 6);
      c.bezierCurveTo(size, -size / 3, size / 2, -size / 1.2, 0, -size / 4);
      c.closePath();
      c.fill();
    };

    const drawRosePetal = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-size / 2, -size / 2, -size, 0, -size / 5, size);
      c.bezierCurveTo(size / 3, size * 1.2, size, size / 2, size, 0);
      c.bezierCurveTo(size / 2, -size / 2, 0, 0, 0, 0);
      c.closePath();
      c.fill();
    };

    const drawCherryPetal = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-size / 2, -size / 3, -size / 2, -size, 0, -size * 1.1);
      c.bezierCurveTo(size / 2, -size, size / 2, -size / 3, 0, 0);
      c.closePath();
      c.fill();
      
      // Draw split indentation
      c.strokeStyle = "rgba(0,0,0,0.15)";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(0, -size * 0.75);
      c.stroke();
    };

    const drawStar = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.lineTo(0, -size);
        c.lineTo(size / 3, 0);
      }
      c.closePath();
      c.fill();
    };

    // Main animation ticker loop
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let particles = particlesRef.current;

      // Maintain standard level density if falling off has depleted counts
      const targetCount = intensity === "gentle" ? 25 : intensity === "dreamy" ? 55 : 85;
      if (particles.filter(p => p.speedY > 0 && p.y <= 100).length < targetCount) {
        // Add random falling particle at the top
        particles.push(createParticle(Math.random() * 100, -5, false));
      }

      particles = particles.map(p => {
        // Convert screen percentage to canvas offset pixels
        const px = (p.x / 100) * canvas.width;
        let py = (p.y / 100) * canvas.height;

        // Apply motion updates
        py += p.speedY;
        const newXPercent = p.x + p.speedX;
        const newYPercent = (py / canvas.height) * 100;
        const newRotation = p.rotation + p.rotationSpeed;

        // Age out bursts slightly quicker
        let newOpacity = p.opacity;
        if (p.speedY !== 0 && Math.abs(p.speedY) > 1.5) {
          // It belongs to a tap-triggered burst - deplete opacity
          newOpacity -= 0.012;
        }

        return {
          ...p,
          x: newXPercent,
          y: newYPercent,
          rotation: newRotation,
          opacity: newOpacity,
        };
      }).filter(p => {
        // Cleanup off-screen/faded particles
        return p.y < 120 && p.y > -20 && p.x > -20 && p.x < 120 && p.opacity > 0;
      });

      // Render remaining particles
      particles.forEach(p => {
        const px = (p.x / 100) * canvas.width;
        const py = (p.y / 100) * canvas.height;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Shadow glow for sparkles/stars
        if (p.type === "star") {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
        }

        if (p.type === "heart") {
          drawHeart(ctx, p.size);
        } else if (p.type === "rose") {
          drawRosePetal(ctx, p.size);
        } else if (p.type === "cherry") {
          drawCherryPetal(ctx, p.size);
        } else {
          drawStar(ctx, p.size);
        }

        ctx.restore();
      });

      particlesRef.current = particles;
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, theme]);

  // Major burst observer trigger launched from parent
  useEffect(() => {
    if (burstOnTrigger > burstTrackerRef.current) {
      burstTrackerRef.current = burstOnTrigger;
      
      const newBurst: HeartOrFlower[] = [];
      // Unleash 65-80 celebratory particles from the center/lower half
      const particleCount = 75;
      for (let i = 0; i < particleCount; i++) {
        const startX = 50 + (Math.random() * 20 - 10);
        const startY = 60 + (Math.random() * 20 - 10);
        const p = createParticle(startX, startY, true);
        
        // Broad upward explosive arch
        const angle = -Math.PI / 2 + (Math.random() * 1.5 - 0.75); // Facing upward
        const force = Math.random() * 5 + 3;
        p.speedX = Math.cos(angle) * force;
        p.speedY = Math.sin(angle) * force;
        p.size = Math.random() * 14 + 8;
        newBurst.push(p);
      }
      particlesRef.current = [...particlesRef.current, ...newBurst];
    }
  }, [burstOnTrigger]);

  return (
    <canvas
      id="surprise-particle-canvas"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-pointer z-10 select-none block"
      onClick={handleCanvasClick}
      onTouchStart={handleCanvasClick}
    />
  );
}
