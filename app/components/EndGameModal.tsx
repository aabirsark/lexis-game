"use client";

import React from "react";
import { WordItem } from "../types/game";

interface EndGameModalProps {
  status: "VICTORY" | "GAME_OVER";
  playerName: string;
  wordItem: WordItem;
  wrongCount: number;
  streak: number;
  onPlayAgain: () => void;
  onSpinNewWheel: () => void;
}

export default function EndGameModal({
  status,
  playerName,
  wordItem,
  wrongCount,
  streak,
  onPlayAgain,
  onSpinNewWheel,
}: EndGameModalProps) {
  const isVictory = status === "VICTORY";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-purple-950/95 via-black to-black border-2 shadow-2xl text-center overflow-hidden ${
          isVictory
            ? "border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]"
            : "border-red-600 shadow-[0_0_50px_rgba(229,9,20,0.6)]"
        }`}
      >
        {/* Decorative Top Glow */}
        <div
          className={`absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isVictory ? "bg-emerald-500/20" : "bg-red-600/30"
          }`}
        />

        {/* Mascot Icon */}
        <div className="text-5xl sm:text-6xl mb-2 animate-bounce">
          {isVictory ? "👑" : "💀"}
        </div>

        {/* Title */}
        <span
          className={`text-xs font-gothic tracking-widest uppercase font-bold block ${
            isVictory ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {isVictory ? "MORTAL TRIUMPH" : "THE EXECUTIONER'S TOLL"}
        </span>

        <h2
          className={`text-3xl sm:text-4xl font-spooky tracking-wide mt-1 ${
            isVictory
              ? "text-emerald-400 glow-green"
              : "text-red-500 glow-red animate-pulse"
          }`}
        >
          {isVictory
            ? `${playerName} Escaped The Gallows!`
            : `${playerName}'s Soul Was Claimed!`}
        </h2>

        {/* Word Reveal Section */}
        <div className="my-5 p-4 rounded-2xl bg-black/60 border border-purple-900/60 text-center">
          <span className="text-[10px] font-gothic tracking-widest text-gray-400 uppercase block mb-1">
            THE HIDDEN MYSTERY WAS:
          </span>
          <span className="text-2xl sm:text-3xl font-gothic font-black text-orange-400 tracking-wider glow-orange block">
            {wordItem.word}
          </span>
          <span className="text-xs text-purple-300 mt-1 inline-block">
            {wordItem.category} • {wordItem.subgenre}
          </span>

          {wordItem.funFact && (
            <div className="mt-3 pt-3 border-t border-purple-900/40 text-xs text-gray-300 italic">
              💡 <span className="text-gray-400">Tombstone Lore:</span> &ldquo;{wordItem.funFact}&rdquo;
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-center">
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
            <span className="text-[10px] font-gothic text-gray-400 uppercase block">
              MISTAKES MADE
            </span>
            <span className="text-xl font-bold font-gothic text-yellow-400">
              {wrongCount} / 6
            </span>
          </div>
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
            <span className="text-[10px] font-gothic text-gray-400 uppercase block">
              SURVIVAL STREAK
            </span>
            <span className="text-xl font-bold font-gothic text-orange-400">
              {streak} 🔥
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onSpinNewWheel}
            className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-black font-gothic font-bold text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl box-glow-orange cursor-pointer"
          >
            🎡 Spin Wheel Again
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3.5 px-5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/60 font-gothic font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            🔄 Next Mystery ({wordItem.category})
          </button>
        </div>
      </div>
    </div>
  );
}
