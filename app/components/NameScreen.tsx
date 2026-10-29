"use client";

import React, { useState } from "react";
import { soundManager } from "../utils/audio";

interface NameScreenProps {
  onNameSubmit: (name: string) => void;
}

export default function NameScreen({ onNameSubmit }: NameScreenProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("The spirits require a name to seal your contract!");
      soundManager.playWrong();
      return;
    }
    soundManager.playCorrect();
    onNameSubmit(trimmed);
  };

  const handleRandomName = () => {
    const spookyNames = [
      "Lord Crowley",
      "Madame Raven",
      "Count Vladimir",
      "Witch Hazel",
      "Grim Shifter",
      "Victor Frankenstein",
      "Morgana Darke",
      "Specter Bones",
    ];
    const picked = spookyNames[Math.floor(Math.random() * spookyNames.length)];
    setName(picked);
    setError("");
    soundManager.playTick();
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center p-4 sm:p-8 z-10">
      {/* Decorative Jack-O'-Lantern Vectors */}
      <div className="flex items-center justify-center gap-6 mb-2">
        {/* Pumpkin Left */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 text-orange-500 filter drop-shadow-[0_0_12px_rgba(255,117,24,0.8)] animate-float">
          <svg viewBox="0 0 100 100" fill="currentColor">
            {/* Stem */}
            <path d="M 48 10 C 48 2 58 4 56 18 Z" fill="#22c55e" />
            {/* Pumpkin Body */}
            <ellipse cx="50" cy="55" rx="42" ry="36" fill="#ea580c" />
            <ellipse cx="50" cy="55" rx="28" ry="37" fill="#f97316" />
            <ellipse cx="50" cy="55" rx="14" ry="38" fill="#fb923c" />
            {/* Eyes */}
            <polygon points="32,45 42,45 37,35" fill="#090311" />
            <polygon points="58,45 68,45 63,35" fill="#090311" />
            {/* Nose */}
            <polygon points="46,55 54,55 50,48" fill="#090311" />
            {/* Wicked Grin */}
            <path
              d="M 28 66 Q 50 82 72 66 Q 64 74 50 72 Q 36 74 28 66 Z"
              fill="#090311"
            />
            {/* Teeth */}
            <rect x="38" y="66" width="5" height="5" fill="#fb923c" />
            <rect x="57" y="66" width="5" height="5" fill="#fb923c" />
          </svg>
        </div>

        {/* Center Title Badge */}
        <div className="text-center">
          <span className="text-[11px] sm:text-xs font-gothic tracking-widest text-orange-400 border border-orange-500/40 px-3 py-0.5 rounded-full bg-black/60 shadow-lg">
            WELCOME TO
          </span>
          <h1 className="text-4xl sm:text-6xl font-spooky text-orange-500 glow-orange tracking-wider mt-1">
            LEXIS GAME
          </h1>
          <p className="text-xs sm:text-sm font-gothic tracking-widest text-purple-300 -mt-1 glow-purple">
            THE HANGED MAN&apos;S CURSE
          </p>
        </div>

        {/* Pumpkin Right */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 text-orange-500 filter drop-shadow-[0_0_12px_rgba(255,117,24,0.8)] animate-float"
          style={{ animationDelay: "1s" }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor">
            {/* Stem */}
            <path d="M 48 10 C 48 2 40 4 44 18 Z" fill="#22c55e" />
            {/* Pumpkin Body */}
            <ellipse cx="50" cy="55" rx="42" ry="36" fill="#ea580c" />
            <ellipse cx="50" cy="55" rx="28" ry="37" fill="#f97316" />
            <ellipse cx="50" cy="55" rx="14" ry="38" fill="#fb923c" />
            {/* Eyes */}
            <polygon points="32,45 42,45 37,35" fill="#090311" />
            <polygon points="58,45 68,45 63,35" fill="#090311" />
            {/* Nose */}
            <polygon points="46,55 54,55 50,48" fill="#090311" />
            {/* Grin */}
            <path
              d="M 28 66 Q 50 82 72 66 Q 64 74 50 72 Q 36 74 28 66 Z"
              fill="#090311"
            />
            {/* Teeth */}
            <rect x="44" y="68" width="5" height="5" fill="#fb923c" />
            <rect x="52" y="68" width="5" height="5" fill="#fb923c" />
          </svg>
        </div>
      </div>

      {/* Crypt Entry Card */}
      <div className="w-full mt-6 p-6 sm:p-8 rounded-2xl bg-black/75 border-2 border-purple-800/60 backdrop-blur-md shadow-2xl box-glow-purple">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-gothic text-gray-200 tracking-wide">
              Who Dares Enter The Gallows?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Engrave your mortal name upon the executioner&apos;s ledger.
            </p>
          </div>

          {/* Name Input Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-orange-400 text-lg">
              💀
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter Player Name..."
              maxLength={24}
              autoFocus
              className="w-full pl-11 pr-24 py-3.5 bg-purple-950/40 border-2 border-purple-700/60 rounded-xl text-white placeholder-gray-500 font-ui text-base sm:text-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all shadow-inner"
            />
            <button
              type="button"
              onClick={handleRandomName}
              className="absolute inset-y-1.5 right-1.5 px-3 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold tracking-wider transition-colors border border-purple-600/40 cursor-pointer"
              title="Pick a random spooky pseudonym"
            >
              Random
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-xs sm:text-sm text-center font-semibold animate-shake">
              ⚠️ {error}
            </div>
          )}

          {/* Enter Crypt Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-black font-gothic font-bold text-base sm:text-lg tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl box-glow-orange cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Enter The Crypt</span>
            <span className="transition-transform group-hover:translate-x-1">⚰️</span>
          </button>
        </form>

        {/* Game Rules / Lore Preview */}
        <div className="mt-6 pt-5 border-t border-purple-900/40 text-center">
          <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
            <span className="text-orange-400 font-semibold">How it works:</span>{" "}
            Spin the 3-realm wheel of Books, Characters & Movies. Guess letters to reveal the secret word from cryptic clues. Each blunder summons another piece of the hanged skeleton!
          </p>
        </div>
      </div>
    </div>
  );
}
