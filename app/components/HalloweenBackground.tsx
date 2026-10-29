"use client";

import React, { useEffect, useRef } from "react";

interface Bat {
  x: number;
  y: number;
  speed: number;
  size: number;
  wingPhase: number;
  wingSpeed: number;
  curve: number;
}

interface Ember {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
}

export default function HalloweenBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Bats
    const bats: Bat[] = Array.from({ length: 6 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.45) + 30,
      speed: 1.5 + Math.random() * 2,
      size: 10 + Math.random() * 12,
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: 0.15 + Math.random() * 0.1,
      curve: (Math.random() - 0.5) * 0.8,
    }));

    // Embers
    const emberColors = ["#ff7518", "#ff9d00", "#ff3b00", "#39ff14", "#a855f7"];
    const embers: Ember[] = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      speedY: 0.5 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: 0.2 + Math.random() * 0.7,
      color: emberColors[Math.floor(Math.random() * emberColors.length)],
    }));

    // Draw Bat SVG path
    const drawBat = (bat: Bat) => {
      ctx.save();
      ctx.translate(bat.x, bat.y);
      const flap = Math.sin(bat.wingPhase);

      ctx.fillStyle = "rgba(10, 5, 20, 0.9)";
      ctx.beginPath();
      // Body
      ctx.ellipse(0, 0, bat.size * 0.35, bat.size * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();

      // Left Wing
      ctx.beginPath();
      ctx.moveTo(-bat.size * 0.2, -bat.size * 0.1);
      ctx.quadraticCurveTo(
        -bat.size * 1.2,
        -bat.size * (0.8 + flap * 0.5),
        -bat.size * 1.8,
        flap * bat.size * 0.3
      );
      ctx.quadraticCurveTo(
        -bat.size * 1.1,
        bat.size * 0.4,
        -bat.size * 0.2,
        bat.size * 0.2
      );
      ctx.fill();

      // Right Wing
      ctx.beginPath();
      ctx.moveTo(bat.size * 0.2, -bat.size * 0.1);
      ctx.quadraticCurveTo(
        bat.size * 1.2,
        -bat.size * (0.8 + flap * 0.5),
        bat.size * 1.8,
        flap * bat.size * 0.3
      );
      ctx.quadraticCurveTo(
        bat.size * 1.1,
        bat.size * 0.4,
        bat.size * 0.2,
        bat.size * 0.2
      );
      ctx.fill();

      // Tiny red glowing eyes
      ctx.fillStyle = "#ff1a1a";
      ctx.beginPath();
      ctx.arc(-bat.size * 0.1, -bat.size * 0.4, 0.8, 0, Math.PI * 2);
      ctx.arc(bat.size * 0.1, -bat.size * 0.4, 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric vignette background
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.2,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, "#190a2a");
      bgGrad.addColorStop(0.5, "#0b0514");
      bgGrad.addColorStop(1, "#030107");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Huge Eerie Blood Moon
      const moonX = width * 0.82;
      const moonY = Math.min(height * 0.2, 140);
      const moonRadius = Math.min(width * 0.08, 70);

      // Moon outer eerie glow
      const moonGlow = ctx.createRadialGradient(
        moonX,
        moonY,
        moonRadius * 0.8,
        moonX,
        moonY,
        moonRadius * 3.5
      );
      moonGlow.addColorStop(0, "rgba(255, 150, 50, 0.35)");
      moonGlow.addColorStop(0.5, "rgba(255, 90, 0, 0.12)");
      moonGlow.addColorStop(1, "rgba(255, 90, 0, 0)");
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Moon disc
      const moonGrad = ctx.createRadialGradient(
        moonX - moonRadius * 0.3,
        moonY - moonRadius * 0.3,
        5,
        moonX,
        moonY,
        moonRadius
      );
      moonGrad.addColorStop(0, "#fff5e6");
      moonGrad.addColorStop(0.7, "#ffb366");
      moonGrad.addColorStop(1, "#e65c00");
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      // Moon craters
      ctx.fillStyle = "rgba(180, 70, 0, 0.18)";
      ctx.beginPath();
      ctx.arc(moonX - moonRadius * 0.2, moonY + moonRadius * 0.15, moonRadius * 0.25, 0, Math.PI * 2);
      ctx.arc(moonX + moonRadius * 0.3, moonY - moonRadius * 0.2, moonRadius * 0.18, 0, Math.PI * 2);
      ctx.arc(moonX + moonRadius * 0.1, moonY + moonRadius * 0.4, moonRadius * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Rising mystical embers
      embers.forEach((ember) => {
        ember.y -= ember.speedY;
        ember.x += ember.speedX + Math.sin(tick * 0.02 + ember.y * 0.01) * 0.3;

        if (ember.y < -20) {
          ember.y = height + 20;
          ember.x = Math.random() * width;
        }

        ctx.save();
        ctx.fillStyle = ember.color;
        ctx.globalAlpha = ember.opacity * (0.6 + 0.4 * Math.sin(tick * 0.05 + ember.x));
        ctx.shadowBlur = 10;
        ctx.shadowColor = ember.color;
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Animated Bats
      bats.forEach((bat) => {
        bat.x += bat.speed;
        bat.y += Math.sin(bat.x * 0.015) * bat.curve;
        bat.wingPhase += bat.wingSpeed;

        if (bat.x > width + 50) {
          bat.x = -50;
          bat.y = Math.random() * (height * 0.45) + 30;
        }

        drawBat(bat);
      });

      // Subtle fog layers at the bottom
      const fogGrad = ctx.createLinearGradient(0, height - 160, 0, height);
      fogGrad.addColorStop(0, "rgba(20, 10, 35, 0)");
      fogGrad.addColorStop(0.5, "rgba(35, 12, 50, 0.45)");
      fogGrad.addColorStop(1, "rgba(10, 3, 20, 0.95)");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, height - 160, width, 160);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Spiderweb top-left vector decoration */}
      <svg
        className="absolute top-0 left-0 w-36 h-36 md:w-56 md:h-56 opacity-25 text-purple-400 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0,0 L200,0 M0,0 L180,60 M0,0 L140,120 M0,0 L80,170 M0,0 L0,200" />
        <path d="M30,0 Q30,30 0,30" />
        <path d="M60,0 Q60,60 0,60" />
        <path d="M100,0 Q100,100 0,100" />
        <path d="M150,0 Q150,150 0,150" />
        <path d="M190,0 Q190,190 0,190" />
      </svg>

      {/* Spider hanging from web */}
      <div className="absolute top-0 right-12 md:right-32 flex flex-col items-center animate-float pointer-events-none opacity-40">
        <div className="w-[1px] h-20 md:h-32 bg-gray-500/50" />
        <div className="text-xl">🕷️</div>
      </div>
    </div>
  );
}
