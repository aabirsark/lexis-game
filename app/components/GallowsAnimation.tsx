"use client";

import React from "react";

interface GallowsAnimationProps {
  wrongCount: number; // 0 to 6
  maxLives?: number; // Default 6
  isGameOver?: boolean;
  isVictory?: boolean;
}

export default function GallowsAnimation({
  wrongCount,
  maxLives = 6,
  isGameOver = false,
  isVictory = false,
}: GallowsAnimationProps) {
  const livesLeft = Math.max(0, maxLives - wrongCount);

  return (
    <div className="relative flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-black/60 border border-purple-900/50 backdrop-blur-md shadow-2xl box-glow-purple overflow-hidden">
      {/* Dynamic lightning flash when game over */}
      {isGameOver && (
        <div className="absolute inset-0 bg-white/20 pointer-events-none animate-lightning z-20" />
      )}

      {/* Top Status Bar: Remaining Souls / Lives */}
      <div className="w-full flex items-center justify-between mb-2 px-2 z-10 text-xs sm:text-sm">
        <span className="font-gothic text-orange-400 tracking-wider flex items-center gap-1">
          <span>🕯️</span> CURSE STATUS
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: maxLives }).map((_, i) => (
            <span
              key={i}
              className={`transition-all duration-500 transform ${
                i < livesLeft
                  ? "opacity-100 scale-100 filter drop-shadow-[0_0_6px_rgba(255,117,24,0.9)]"
                  : "opacity-25 grayscale scale-90"
              }`}
              title={i < livesLeft ? "Life intact" : "Life forfeited"}
            >
              💀
            </span>
          ))}
        </div>
      </div>

      {/* Gallows and Skeleton SVG */}
      <div className="relative w-64 h-72 sm:w-72 sm:h-80 flex items-center justify-center">
        <svg
          viewBox="0 0 260 300"
          className="w-full h-full select-none overflow-visible"
        >
          <defs>
            {/* Wood Texture Gradient */}
            <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a2e18" />
              <stop offset="50%" stopColor="#2c1a0e" />
              <stop offset="100%" stopColor="#1a0f08" />
            </linearGradient>

            {/* Bone Material Gradient */}
            <linearGradient id="boneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="70%" stopColor="#d1d5db" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>

            {/* Glowing Ectoplasm for eyes */}
            <radialGradient id="eyeGlowGreen">
              <stop offset="0%" stopColor="#39ff14" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <radialGradient id="eyeGlowRed">
              <stop offset="0%" stopColor="#ff0055" />
              <stop offset="60%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Scaffold Base Hillock / Ground with tombstones */}
          <path
            d="M 10 280 Q 130 265 250 280 L 250 300 L 10 300 Z"
            fill="#120c1a"
          />
          {/* Miniature Tombstone on ground */}
          <path
            d="M 25 280 L 25 260 Q 35 252 45 260 L 45 280 Z"
            fill="#1f182c"
            stroke="#3b2d4f"
            strokeWidth="1"
          />
          <text
            x="35"
            y="272"
            fill="#6b5b85"
            fontSize="7"
            fontFamily="serif"
            textAnchor="middle"
          >
            RIP
          </text>

          {/* Wooden Platform / Scaffold */}
          <rect
            x="30"
            y="245"
            width="190"
            height="15"
            rx="2"
            fill="url(#woodGrad)"
            stroke="#110904"
            strokeWidth="1.5"
          />
          {/* Platform support stilts */}
          <rect x="45" y="260" width="10" height="25" fill="#2c1a0e" />
          <rect x="195" y="260" width="10" height="25" fill="#2c1a0e" />

          {/* Trapdoor on platform (under the hanging victim) */}
          <g
            style={{
              transformOrigin: "145px 245px",
              transform: isGameOver ? "rotate(72deg)" : "rotate(0deg)",
              transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <rect
              x="145"
              y="245"
              width="45"
              height="15"
              fill="#22140a"
              stroke="#ff7518"
              strokeWidth={isGameOver ? "1.5" : "0.5"}
              strokeDasharray={isGameOver ? "none" : "2,2"}
            />
          </g>

          {/* Main Upright Gallows Post */}
          <rect
            x="60"
            y="30"
            width="16"
            height="215"
            rx="2"
            fill="url(#woodGrad)"
            stroke="#110904"
            strokeWidth="1.5"
          />

          {/* Horizontal Top Beam */}
          <rect
            x="50"
            y="25"
            width="135"
            height="16"
            rx="2"
            fill="url(#woodGrad)"
            stroke="#110904"
            strokeWidth="1.5"
          />

          {/* Diagonal Corner Brace */}
          <line
            x1="76"
            y1="68"
            x2="105"
            y2="41"
            stroke="#2c1a0e"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Carved occult runes on the upright beam that glow as lives drop */}
          <g
            fill="none"
            stroke={wrongCount > 0 ? "#ff7518" : "#3b2447"}
            strokeWidth="1.5"
            className="transition-colors duration-500"
            filter={wrongCount > 2 ? "url(#glowFilter)" : undefined}
          >
            <path d="M 68 80 L 68 95 M 64 85 L 72 90" />
            <path d="M 68 115 L 68 130 M 64 125 L 72 120" />
            <path d="M 68 150 L 68 165 M 65 155 L 71 160" />
          </g>

          {/* Perched Raven atop gallows */}
          <g transform="translate(56, 12)">
            {/* Raven Body */}
            <path
              d="M 5 13 Q -2 8 2 2 Q 8 2 12 7 Q 16 11 15 15 Z"
              fill="#0d0814"
            />
            {/* Beak */}
            <path d="M 12 5 L 16 7 L 12 9 Z" fill="#eab308" />
            {/* Glowing Eye */}
            <circle cx="10" cy="5" r="1.2" fill="#ff0033" />
          </g>

          {/* SWAYING NOOSE & VICTIM GROUP */}
          <g
            className={`origin-top transition-transform duration-700 ${
              isGameOver
                ? "animate-rope-sway"
                : wrongCount > 0
                ? "animate-pulse"
                : ""
            }`}
            style={{ transformOrigin: "168px 41px" }}
          >
            {/* The Hemp Rope */}
            <line
              x1="168"
              y1="41"
              x2="168"
              y2="85"
              stroke="#c29b62"
              strokeWidth="3.5"
              strokeDasharray="4,2"
            />
            {/* The Noose Loop */}
            <path
              d="M 168 85 C 160 85 155 102 168 108 C 181 102 176 85 168 85 Z"
              fill="none"
              stroke="#a27e48"
              strokeWidth="3"
            />
            {/* Rope Knot */}
            <rect
              x="165"
              y="84"
              width="6"
              height="8"
              rx="1.5"
              fill="#865d2c"
              stroke="#4a2e18"
              strokeWidth="0.8"
            />

            {/* STAGE 1: SKULL HEAD (wrongCount >= 1) */}
            {wrongCount >= 1 && (
              <g
                className="transition-all duration-500 animate-tile-reveal"
                filter="url(#glowFilter)"
              >
                {/* Skull Base */}
                <path
                  d="M 157 74 C 157 60 179 60 179 74 C 179 84 175 92 168 93 C 161 92 157 84 157 74 Z"
                  fill="url(#boneGrad)"
                  stroke="#374151"
                  strokeWidth="1.2"
                />
                {/* Jaw */}
                <path
                  d="M 162 92 L 162 98 L 174 98 L 174 92 Z"
                  fill="#d1d5db"
                  stroke="#374151"
                  strokeWidth="1"
                />
                {/* Teeth */}
                <line x1="165" y1="94" x2="165" y2="98" stroke="#4b5563" strokeWidth="1" />
                <line x1="168" y1="94" x2="168" y2="98" stroke="#4b5563" strokeWidth="1" />
                <line x1="171" y1="94" x2="171" y2="98" stroke="#4b5563" strokeWidth="1" />

                {/* Triangular Nose Cavity */}
                <path d="M 168 80 L 166 84 L 170 84 Z" fill="#111827" />

                {/* Glowing Eye Sockets */}
                <ellipse cx="163" cy="74" rx="3.5" ry="4" fill="#111827" />
                <ellipse cx="173" cy="74" rx="3.5" ry="4" fill="#111827" />

                {/* Flaming Pupils */}
                <circle
                  cx="163"
                  cy="74"
                  r="2"
                  fill={isGameOver ? "url(#eyeGlowRed)" : "url(#eyeGlowGreen)"}
                  className="animate-flicker"
                />
                <circle
                  cx="173"
                  cy="74"
                  r="2"
                  fill={isGameOver ? "url(#eyeGlowRed)" : "url(#eyeGlowGreen)"}
                  className="animate-flicker"
                />
              </g>
            )}

            {/* STAGE 2: SPINE & RIBCAGE (wrongCount >= 2) */}
            {wrongCount >= 2 && (
              <g className="transition-all duration-500 animate-tile-reveal">
                {/* Spine Column */}
                <line
                  x1="168"
                  y1="98"
                  x2="168"
                  y2="155"
                  stroke="url(#boneGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Rib pairs */}
                <path
                  d="M 156 112 C 160 106 176 106 180 112"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 154 122 C 159 116 177 116 182 122"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 156 132 C 160 127 176 127 180 132"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 159 141 C 162 137 174 137 177 141"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Pelvis */}
                <path
                  d="M 160 152 Q 168 158 176 152 Q 168 163 160 152 Z"
                  fill="url(#boneGrad)"
                  stroke="#4b5563"
                  strokeWidth="1"
                />
              </g>
            )}

            {/* STAGE 3: LEFT SKELETAL ARM (wrongCount >= 3) */}
            {wrongCount >= 3 && (
              <g className="transition-all duration-500 animate-tile-reveal">
                {/* Clavicle / Upper Arm */}
                <path
                  d="M 162 106 L 146 126 L 138 145"
                  fill="none"
                  stroke="url(#boneGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Clawed Hand Fingers */}
                <line x1="138" y1="145" x2="133" y2="152" stroke="#d1d5db" strokeWidth="1.8" />
                <line x1="138" y1="145" x2="137" y2="154" stroke="#d1d5db" strokeWidth="1.8" />
                <line x1="138" y1="145" x2="142" y2="152" stroke="#d1d5db" strokeWidth="1.8" />
              </g>
            )}

            {/* STAGE 4: RIGHT SKELETAL ARM (wrongCount >= 4) */}
            {wrongCount >= 4 && (
              <g className="transition-all duration-500 animate-tile-reveal">
                {/* Upper Arm & Forearm */}
                <path
                  d="M 174 106 L 190 126 L 198 145"
                  fill="none"
                  stroke="url(#boneGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Clawed Hand Fingers */}
                <line x1="198" y1="145" x2="194" y2="152" stroke="#d1d5db" strokeWidth="1.8" />
                <line x1="198" y1="145" x2="199" y2="154" stroke="#d1d5db" strokeWidth="1.8" />
                <line x1="198" y1="145" x2="203" y2="152" stroke="#d1d5db" strokeWidth="1.8" />
              </g>
            )}

            {/* STAGE 5: LEFT SKELETAL LEG (wrongCount >= 5) */}
            {wrongCount >= 5 && (
              <g className="transition-all duration-500 animate-tile-reveal">
                {/* Thigh & Shin */}
                <path
                  d="M 163 158 L 157 190 L 153 225"
                  fill="none"
                  stroke="url(#boneGrad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Knee Joint */}
                <circle cx="157" cy="190" r="2.5" fill="#e5e7eb" />
                {/* Foot Bony Toes */}
                <path
                  d="M 153 225 L 145 230"
                  stroke="#d1d5db"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* STAGE 6: RIGHT SKELETAL LEG (wrongCount >= 6 - COMPLETE HANGED MAN) */}
            {wrongCount >= 6 && (
              <g className="transition-all duration-500 animate-tile-reveal">
                {/* Thigh & Shin */}
                <path
                  d="M 173 158 L 179 190 L 183 225"
                  fill="none"
                  stroke="url(#boneGrad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Knee Joint */}
                <circle cx="179" cy="190" r="2.5" fill="#e5e7eb" />
                {/* Foot Bony Toes */}
                <path
                  d="M 183 225 L 191 230"
                  stroke="#d1d5db"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>
        </svg>

        {/* Victory Celebration Aura overlay if solved */}
        {isVictory && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl animate-fade-in">
            <span className="text-4xl animate-bounce">🕊️</span>
            <p className="font-gothic text-green-400 font-bold tracking-widest text-sm mt-2 glow-green">
              SOUL REDEEMED
            </p>
          </div>
        )}
      </div>

      {/* Stage Description Indicator */}
      <div className="w-full text-center mt-1 z-10">
        <p className="text-xs font-semibold tracking-wide text-gray-400">
          {wrongCount === 0 && (
            <span className="text-emerald-400">The gallows stands silent...</span>
          )}
          {wrongCount === 1 && (
            <span className="text-yellow-400">The skull manifests upon the noose!</span>
          )}
          {wrongCount === 2 && (
            <span className="text-amber-500">A bony ribcage knits together!</span>
          )}
          {wrongCount === 3 && (
            <span className="text-orange-500">The left claw reaches out!</span>
          )}
          {wrongCount === 4 && (
            <span className="text-red-400">Both arms rattle in torment!</span>
          )}
          {wrongCount === 5 && (
            <span className="text-rose-500 font-bold animate-pulse">
              ONE WRONG BREATH FROM ETERNAL DOOM!
            </span>
          )}
          {wrongCount >= 6 && (
            <span className="text-red-500 font-bold glow-red animate-pulse">
              THE TRAPDOOR DROPS — YOUR SOUL IS CLAIMED!
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
