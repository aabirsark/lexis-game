"use client";

import React, { useState, useRef, useEffect } from "react";
import { Category, Subgenre } from "../types/game";
import { CATEGORY_CONFIG } from "../data/gameData";
import { soundManager } from "../utils/audio";

interface WheelOfFateProps {
  playerName: string;
  onSpinComplete: (category: Category, subgenre: Subgenre) => void;
}

interface Sector {
  category: Category;
  label: string;
  subgenres: Subgenre[];
  color: string;
  borderColor: string;
  icon: string;
  themeNote: string;
  startAngle: number;
  endAngle: number;
}

const SECTORS: Sector[] = [
  {
    category: "BOOKS",
    label: "BOOKS",
    subgenres: ["Classical", "Horror"],
    color: "#6b21a8",
    borderColor: "#a855f7",
    icon: "📖",
    themeNote: "Classical / Horror",
    startAngle: 0,
    endAngle: 120,
  },
  {
    category: "CHARACTERS",
    label: "CHARACTERS",
    subgenres: ["Fictional"],
    color: "#065f46",
    borderColor: "#10b981",
    icon: "🎭",
    themeNote: "Fictional Legends",
    startAngle: 120,
    endAngle: 240,
  },
  {
    category: "MOVIES",
    label: "MOVIES",
    subgenres: ["Horror", "Sci-Fi"],
    color: "#9a3412",
    borderColor: "#f97316",
    icon: "🎬",
    themeNote: "Horror / Sci-Fi",
    startAngle: 240,
    endAngle: 360,
  },
];

export default function WheelOfFate({
  playerName,
  onSpinComplete,
}: WheelOfFateProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [selectedResult, setSelectedResult] = useState<{
    category: Category;
    subgenre: Subgenre;
  } | null>(null);

  const prevAngleRef = useRef(0);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    soundManager.playSpinWhoosh();
    setIsSpinning(true);
    setSelectedResult(null);

    // Random chosen sector
    const chosenSectorIndex = Math.floor(Math.random() * SECTORS.length);
    const chosenSector = SECTORS[chosenSectorIndex];

    // Pick subgenre
    const randomSubgenre =
      chosenSector.subgenres[
        Math.floor(Math.random() * chosenSector.subgenres.length)
      ];

    // We want the wheel pointer (at top: 270 deg or 90 deg relative to rotation)
    // Pointer is at TOP (12 o'clock = 270 deg in canvas, or top arrow).
    // Let's align sector center to the top indicator (angle = 270 deg):
    const sectorCenter =
      (chosenSector.startAngle + chosenSector.endAngle) / 2;
    
    // Total spins: 5 to 7 full rotations + angle offset so top indicator lands inside chosenSector
    // Top arrow is at 0 degrees (top). So rotation + sectorCenter = 360 * N.
    // That means finalRotation = 360 * N + (360 - sectorCenter) + small random jitter inside sector (-30 to +30)
    const jitter = (Math.random() - 0.5) * 50;
    const fullSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const targetAngle = fullSpins + (360 - sectorCenter) + jitter;

    // Track ticks
    let currentAngle = currentRotation;
    const startTime = performance.now();
    const duration = 4500; // 4.5 seconds

    const animateWheel = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Ease out cubic / quint
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const angleNow = currentRotation + targetAngle * easeOut;
      setCurrentRotation(angleNow);

      // Sound tick when crossing 40 deg intervals
      if (Math.abs(angleNow - prevAngleRef.current) > 28) {
        soundManager.playTick();
        prevAngleRef.current = angleNow;
      }

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        // Spin finished!
        setIsSpinning(false);
        soundManager.playCorrect();
        setSelectedResult({
          category: chosenSector.category,
          subgenre: randomSubgenre,
        });

        // Auto advance after dramatic announcement
        setTimeout(() => {
          onSpinComplete(chosenSector.category, randomSubgenre);
        }, 1800);
      }
    };

    requestAnimationFrame(animateWheel);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-4 sm:p-8 z-10">
      {/* Title Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-950/80 border border-purple-600/50 text-xs tracking-widest text-purple-300 font-gothic mb-2 shadow-lg">
          <span>🔮</span> WHEEL OF DARK DESTINY
        </div>
        <h2 className="text-3xl sm:text-5xl font-spooky text-orange-400 glow-orange tracking-wider">
          Spin To Seal Your Fate
        </h2>
        <p className="text-sm sm:text-base text-gray-300 mt-1">
          Mortal <span className="text-orange-400 font-semibold">{playerName}</span>, 
          the gallows awaits. Which realm of darkness will test your wit?
        </p>
      </div>

      {/* Wheel Container */}
      <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center my-4">
        {/* Outer Gothic Ring with Glow */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-600/60 box-glow-orange pointer-events-none z-10" />
        <div className="absolute -inset-3 rounded-full border border-purple-500/30 animate-pulse pointer-events-none" />

        {/* Pointer Arrow at TOP */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <div className="w-8 h-10 sm:w-10 sm:h-12 text-red-500 filter drop-shadow-[0_0_10px_rgba(255,0,0,0.9)] animate-bounce">
            <svg viewBox="0 0 40 50" fill="currentColor">
              <path d="M 20 50 L 5 15 Q 20 0 35 15 Z" />
            </svg>
          </div>
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full -mt-2 shadow-[0_0_8px_yellow]" />
        </div>

        {/* Rotating Wheel SVG */}
        <div
          className="w-full h-full rounded-full overflow-hidden shadow-2xl transition-transform"
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transition: isSpinning ? "none" : "transform 0.1s linear",
          }}
        >
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full select-none"
          >
            <defs>
              <radialGradient id="wheelCenterGrad">
                <stop offset="0%" stopColor="#2c124d" />
                <stop offset="80%" stopColor="#110524" />
                <stop offset="100%" stopColor="#05010b" />
              </radialGradient>
              <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="50%" stopColor="#854d0e" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>

            {/* SECTOR 1: BOOKS (0 to 120 deg) */}
            <path
              d="M 200 200 L 400 200 A 200 200 0 0 1 100 373.2 Z"
              fill="#581c87"
              stroke="#a855f7"
              strokeWidth="3"
            />
            {/* BOOKS Text and Icon */}
            <g transform="rotate(60 200 200)">
              <text
                x="310"
                y="195"
                fill="#f5d0fe"
                fontSize="22"
                fontWeight="bold"
                fontFamily="var(--font-spooky), cursive"
                letterSpacing="2"
                textAnchor="middle"
              >
                BOOKS
              </text>
              <text
                x="310"
                y="218"
                fill="#e9d5ff"
                fontSize="11"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                Classical / Horror
              </text>
              <text x="365" y="206" fontSize="24" textAnchor="middle">
                📖
              </text>
            </g>

            {/* SECTOR 2: CHARACTERS (120 to 240 deg) */}
            <path
              d="M 200 200 L 100 373.2 A 200 200 0 0 1 100 26.8 Z"
              fill="#064e3b"
              stroke="#10b981"
              strokeWidth="3"
            />
            {/* CHARACTERS Text and Icon */}
            <g transform="rotate(180 200 200)">
              <text
                x="310"
                y="195"
                fill="#a7f3d0"
                fontSize="20"
                fontWeight="bold"
                fontFamily="var(--font-spooky), cursive"
                letterSpacing="2"
                textAnchor="middle"
              >
                CHARACTERS
              </text>
              <text
                x="310"
                y="218"
                fill="#d1fae5"
                fontSize="11"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                Fictional
              </text>
              <text x="365" y="206" fontSize="24" textAnchor="middle">
                🎭
              </text>
            </g>

            {/* SECTOR 3: MOVIES (240 to 360 deg) */}
            <path
              d="M 200 200 L 100 26.8 A 200 200 0 0 1 400 200 Z"
              fill="#7c2d12"
              stroke="#f97316"
              strokeWidth="3"
            />
            {/* MOVIES Text and Icon */}
            <g transform="rotate(300 200 200)">
              <text
                x="310"
                y="195"
                fill="#fed7aa"
                fontSize="22"
                fontWeight="bold"
                fontFamily="var(--font-spooky), cursive"
                letterSpacing="2"
                textAnchor="middle"
              >
                MOVIES
              </text>
              <text
                x="310"
                y="218"
                fill="#ffedd5"
                fontSize="11"
                fontFamily="sans-serif"
                textAnchor="middle"
              >
                Horror / Sci-Fi
              </text>
              <text x="365" y="206" fontSize="24" textAnchor="middle">
                🎬
              </text>
            </g>

            {/* Sector Divider Spikes */}
            <line x1="200" y1="200" x2="400" y2="200" stroke="#facc15" strokeWidth="4" />
            <line x1="200" y1="200" x2="100" y2="373.2" stroke="#facc15" strokeWidth="4" />
            <line x1="200" y1="200" x2="100" y2="26.8" stroke="#facc15" strokeWidth="4" />

            {/* Rim Studs / Occult Rivets */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const cx = 200 + 190 * Math.cos(angle);
              const cy = 200 + 190 * Math.sin(angle);
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill="url(#goldRimGrad)"
                  stroke="#451a03"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
        </div>

        {/* Center Spin Hub & Skull Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          aria-label="Spin Wheel of Fate"
          className={`absolute z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-purple-950 via-black to-zinc-950 border-4 border-amber-500 shadow-2xl flex flex-col items-center justify-center transition-all duration-300 ${
            isSpinning
              ? "scale-95 opacity-90 cursor-not-allowed"
              : "hover:scale-105 hover:border-orange-400 cursor-pointer animate-pulse-glow"
          }`}
        >
          <span className="text-2xl sm:text-3xl">💀</span>
          <span className="text-xs sm:text-sm font-spooky text-orange-400 font-bold tracking-wider mt-1 glow-orange">
            {isSpinning ? "SPINNING..." : "SPIN!"}
          </span>
        </button>
      </div>

      {/* Outcome Banner (Dramatic reveal before page transition) */}
      {selectedResult && (
        <div className="mt-4 p-4 rounded-xl bg-purple-950/90 border-2 border-orange-500 text-center animate-tile-reveal box-glow-orange max-w-md w-full">
          <p className="text-xs tracking-widest text-orange-300 font-gothic">
            THE WHEEL HAS DECREED:
          </p>
          <h3 className="text-2xl sm:text-3xl font-spooky text-yellow-300 glow-orange mt-1">
            {selectedResult.category} — {selectedResult.subgenre}
          </h3>
          <p className="text-xs text-gray-300 mt-1 animate-pulse">
            Summoning the gallows puzzle...
          </p>
        </div>
      )}

      {/* Manual Spin Trigger button for mobile / clear accessibility */}
      {!selectedResult && (
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={`mt-4 px-8 py-3 rounded-full font-gothic tracking-wider font-bold text-sm sm:text-base uppercase transition-all duration-300 shadow-xl flex items-center gap-2 ${
            isSpinning
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-black hover:from-orange-500 hover:to-red-500 hover:scale-105 box-glow-orange cursor-pointer"
          }`}
        >
          <span>🎡</span>
          <span>{isSpinning ? "The Wheel is Turning..." : "Spin The Wheel Of Fate"}</span>
        </button>
      )}

      {/* Category Overview Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-6 text-center text-xs">
        <div className="p-2 sm:p-3 rounded-lg bg-purple-950/40 border border-purple-800/40 backdrop-blur-sm">
          <div className="text-base sm:text-xl">📖</div>
          <div className="font-gothic font-bold text-purple-300 mt-1">BOOKS</div>
          <div className="text-[10px] text-gray-400">Classical / Horror</div>
        </div>
        <div className="p-2 sm:p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 backdrop-blur-sm">
          <div className="text-base sm:text-xl">🎭</div>
          <div className="font-gothic font-bold text-emerald-300 mt-1">CHARACTERS</div>
          <div className="text-[10px] text-gray-400">Fictional</div>
        </div>
        <div className="p-2 sm:p-3 rounded-lg bg-orange-950/40 border border-orange-800/40 backdrop-blur-sm">
          <div className="text-base sm:text-xl">🎬</div>
          <div className="font-gothic font-bold text-orange-300 mt-1">MOVIES</div>
          <div className="text-[10px] text-gray-400">Horror / Sci-Fi</div>
        </div>
      </div>
    </div>
  );
}
