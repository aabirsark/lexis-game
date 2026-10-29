"use client";

import React, { useState } from "react";
import { soundManager } from "../utils/audio";

interface SpookyAudioControlsProps {
  playerName?: string;
  onResetGame?: () => void;
}

export default function SpookyAudioControls({
  playerName,
  onResetGame,
}: SpookyAudioControlsProps) {
  const [muted, setMuted] = useState(soundManager.isMuted());

  const handleToggleMute = () => {
    const nextState = soundManager.toggleMuted();
    setMuted(nextState);
  };

  return (
    <header className="w-full max-w-5xl mx-auto flex items-center justify-between p-3 sm:p-4 z-20">
      {/* Brand Logo / Return */}
      <div className="flex items-center gap-2">
        <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,117,24,0.8)]">
          🎃
        </span>
        <button
          onClick={onResetGame}
          className="text-left font-spooky text-xl sm:text-2xl text-orange-400 hover:text-orange-300 tracking-wider glow-orange transition-colors cursor-pointer"
          title="Return to crypt entrance"
        >
          LEXIS GAME
        </button>
      </div>

      {/* Right Controls: Player Badge & Audio Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {playerName && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/50 text-xs text-purple-200">
            <span>👤</span>
            <span className="font-semibold text-orange-300 max-w-[120px] truncate">
              {playerName}
            </span>
          </div>
        )}

        {/* Audio Mute/Unmute */}
        <button
          onClick={handleToggleMute}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-gothic tracking-wider transition-all duration-200 cursor-pointer ${
            muted
              ? "bg-zinc-900/80 border-zinc-700 text-zinc-400 hover:text-zinc-200"
              : "bg-purple-950/80 border-purple-600/70 text-orange-300 shadow-[0_0_10px_rgba(255,117,24,0.3)] hover:scale-105"
          }`}
          title={muted ? "Unmute Spooky Sounds" : "Mute Sounds"}
          aria-label={muted ? "Unmute Spooky Sounds" : "Mute Sounds"}
        >
          <span>{muted ? "🔇" : "🔊"}</span>
          <span className="hidden xs:inline">{muted ? "MUTED" : "SOUND ON"}</span>
        </button>
      </div>
    </header>
  );
}
