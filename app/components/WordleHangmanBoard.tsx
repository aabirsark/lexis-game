"use client";

import React from "react";
import { WordItem } from "../types/game";
import { CATEGORY_CONFIG } from "../data/gameData";

interface WordleHangmanBoardProps {
  wordItem: WordItem;
  guessedLetters: Set<string>;
  wrongLetters: Set<string>;
  lastFeedback: { type: "correct" | "wrong"; letter: string } | null;
  isGameOver?: boolean;
}

export default function WordleHangmanBoard({
  wordItem,
  guessedLetters,
  wrongLetters,
  lastFeedback,
  isGameOver = false,
}: WordleHangmanBoardProps) {
  const categoryInfo = CATEGORY_CONFIG[wordItem.category];

  // Split target word into individual words for responsive wrapping
  const targetWords = wordItem.word.toUpperCase().split(" ");

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Clue Box / Parchment */}
      <div className="w-full p-4 sm:p-5 rounded-2xl bg-black/65 border-2 border-purple-900/60 backdrop-blur-md shadow-2xl relative overflow-hidden box-glow-purple">
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-purple-900/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">{categoryInfo.icon}</span>
            <span
              className="font-gothic font-bold text-xs sm:text-sm tracking-wider uppercase"
              style={{ color: categoryInfo.color }}
            >
              {categoryInfo.label} • {wordItem.subgenre}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/50 text-purple-300">
            Difficulty: {wordItem.difficulty}
          </span>
        </div>

        {/* The Clue Text */}
        <div className="flex items-start gap-3 mt-1">
          <span className="text-xl sm:text-2xl mt-0.5 animate-pulse">📜</span>
          <div>
            <span className="text-[11px] font-gothic tracking-widest text-orange-400 font-semibold block uppercase">
              THE CRYPTIC CLUE:
            </span>
            <p className="text-sm sm:text-base text-gray-200 font-ui leading-relaxed italic mt-0.5">
              &ldquo;{wordItem.clue}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Guess Feedback Banner */}
      {lastFeedback && (
        <div
          key={lastFeedback.letter + lastFeedback.type + Date.now()}
          className={`w-full py-2 px-4 rounded-xl text-center text-xs sm:text-sm font-gothic font-bold tracking-wider transition-all duration-300 ${
            lastFeedback.type === "correct"
              ? "bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 glow-green animate-bounce"
              : "bg-red-950/80 border border-red-500/70 text-red-300 glow-red animate-shake"
          }`}
        >
          {lastFeedback.type === "correct" ? (
            <span>✨ The letter &apos;{lastFeedback.letter}&apos; shines true upon the tablets!</span>
          ) : (
            <span>⚡ Curse! &apos;{lastFeedback.letter}&apos; is false — the noose tightens!</span>
          )}
        </div>
      )}

      {/* Wordle-Style Letter Tiles Display */}
      <div className="w-full flex flex-wrap justify-center items-center gap-x-6 gap-y-3 py-3 px-2">
        {targetWords.map((word, wordIdx) => (
          <div key={wordIdx} className="flex gap-1.5 sm:gap-2">
            {word.split("").map((char, charIdx) => {
              const isAlphabet = /^[A-Z]$/.test(char);
              const isRevealed = guessedLetters.has(char) || isGameOver;

              if (!isAlphabet) {
                // Punctuation like apostrophe or dash
                return (
                  <div
                    key={charIdx}
                    className="flex items-end justify-center w-4 sm:w-6 text-xl sm:text-2xl font-bold text-orange-400"
                  >
                    {char}
                  </div>
                );
              }

              return (
                <div
                  key={charIdx}
                  className={`relative flex items-center justify-center font-gothic font-black rounded-xl transition-all duration-300 ${
                    // Tile dimensions
                    "w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-lg sm:text-2xl"
                  } ${
                    isRevealed
                      ? isGameOver && !guessedLetters.has(char)
                        ? "bg-red-950/80 border-2 border-red-500 text-red-300 glow-red animate-tile-reveal"
                        : "bg-gradient-to-b from-emerald-600 to-emerald-800 border-2 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.7)] animate-tile-reveal"
                      : "bg-black/80 border-2 border-orange-500/40 text-transparent shadow-inner hover:border-orange-500/70"
                  }`}
                >
                  {isRevealed ? (
                    <span className="filter drop-shadow-md">{char}</span>
                  ) : (
                    <span className="w-4 h-1 bg-orange-500/50 rounded-full mt-6" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Graveyard of Wrong Letters (Hidden & Locked) */}
      <div className="w-full flex flex-col items-center justify-center py-2 px-3 rounded-xl bg-black/40 border border-purple-950/60">
        <span className="text-[10px] font-gothic tracking-widest text-gray-500 uppercase flex items-center gap-1">
          <span>🪦</span> Graveyard of Banished Letters ({wrongLetters.size})
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5 min-h-[32px]">
          {wrongLetters.size === 0 ? (
            <span className="text-xs text-gray-600 italic">No fallen letters yet</span>
          ) : (
            Array.from(wrongLetters).map((letter) => (
              <span
                key={letter}
                className="px-2.5 py-1 rounded-md bg-red-950/60 border border-red-800/50 text-red-400 font-gothic font-bold text-xs flex items-center gap-1 shadow-sm line-through opacity-80"
              >
                <span>💀</span> {letter}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
