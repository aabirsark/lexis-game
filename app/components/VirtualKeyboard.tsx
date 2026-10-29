"use client";

import React, { useEffect } from "react";
import { soundManager } from "../utils/audio";

interface VirtualKeyboardProps {
  onLetterPress: (letter: string) => void;
  correctLetters: Set<string>;
  wrongLetters: Set<string>;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function VirtualKeyboard({
  onLetterPress,
  correctLetters,
  wrongLetters,
  disabled = false,
}: VirtualKeyboardProps) {
  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        // Only trigger if not already guessed
        if (!correctLetters.has(key) && !wrongLetters.has(key)) {
          onLetterPress(key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, correctLetters, wrongLetters, onLetterPress]);

  const handleKeyClick = (letter: string) => {
    if (disabled) return;
    if (correctLetters.has(letter) || wrongLetters.has(letter)) return;
    onLetterPress(letter);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-1.5 sm:gap-2 select-none">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5 w-full">
          {row.map((letter) => {
            const isCorrect = correctLetters.has(letter);
            const isWrong = wrongLetters.has(letter);
            const isUsed = isCorrect || isWrong;

            return (
              <button
                key={letter}
                onClick={() => handleKeyClick(letter)}
                disabled={disabled || isUsed}
                className={`relative flex items-center justify-center font-gothic font-bold rounded-lg transition-all duration-200 ${
                  rowIndex === 2
                    ? "w-8 h-11 sm:w-10 sm:h-12 text-sm sm:text-base"
                    : "w-7 h-11 sm:w-9 sm:h-12 text-sm sm:text-base"
                } ${
                  isCorrect
                    ? "bg-emerald-600/90 text-white border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] scale-95"
                    : isWrong
                    ? "bg-red-950/40 text-red-700/50 border border-red-900/30 line-through opacity-30 cursor-not-allowed scale-90"
                    : disabled
                    ? "bg-zinc-800/50 text-zinc-600 border border-zinc-700/30 cursor-not-allowed"
                    : "bg-purple-950/70 hover:bg-purple-800 text-purple-100 border border-purple-700/60 hover:border-orange-400 hover:text-orange-300 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                }`}
              >
                {/* Visual marker if wrong: skull stamp */}
                {isWrong ? (
                  <span className="text-xs text-red-500">💀</span>
                ) : (
                  <span>{letter}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
