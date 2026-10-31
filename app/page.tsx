"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

import moviesData from "@/data/movies.json";
import booksData from "@/data/books.json";
import charactersData from "@/data/characters.json";

// --- CONTENT BANK loaded from 3 separate editable JSON files ---
export interface Entry {
  w: string;
  t: string;
  c: string;
}

const BANK: Record<string, Entry[]> = {
  movies: moviesData as Entry[],
  books: booksData as Entry[],
  characters: charactersData as Entry[],
};


const META: Record<string, { label: string; theme: string }> = {
  books: { label: "Books", theme: "Classic and horror" },
  characters: { label: "Characters", theme: "Fictional" },
  movies: { label: "Movies", theme: "Horror and sci-fi" },
};

const ORDER = ["books", "characters", "movies"];
const MAX = 6;
const PARTS = ["p-head", "p-body", "p-armL", "p-armR", "p-legL", "p-legR"];
const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export interface RewardOption {
  id: number;
  label: string;
  icon: string;
  isTryAgain: boolean;
}

export const REWARD_OPTIONS: RewardOption[] = [
  { id: 0, label: "Bookmark", icon: "🔖", isTryAgain: false },
  { id: 1, label: "3 sticker", icon: "✨", isTryAgain: false },
  { id: 2, label: "Badge", icon: "🎖️", isTryAgain: false },
  { id: 3, label: "Mug", icon: "☕", isTryAgain: false },
  { id: 4, label: "1 Sticker", icon: "⭐", isTryAgain: false },
  { id: 5, label: "2 Sticker", icon: "🌟", isTryAgain: false },
  { id: 6, label: "Try again", icon: "🔄", isTryAgain: true },
  { id: 7, label: "Try again", icon: "💀", isTryAgain: true },
];

const REWARD_SLICES = [
  { d: "M0 0 L 0.00 -172.00 A 172 172 0 0 1 121.62 -121.62 Z", fill: "url(#rw0)" },
  { d: "M0 0 L 121.62 -121.62 A 172 172 0 0 1 172.00 0.00 Z", fill: "url(#rw1)" },
  { d: "M0 0 L 172.00 0.00 A 172 172 0 0 1 121.62 121.62 Z", fill: "url(#rw2)" },
  { d: "M0 0 L 121.62 121.62 A 172 172 0 0 1 0.00 172.00 Z", fill: "url(#rw3)" },
  { d: "M0 0 L 0.00 172.00 A 172 172 0 0 1 -121.62 121.62 Z", fill: "url(#rw4)" },
  { d: "M0 0 L -121.62 121.62 A 172 172 0 0 1 -172.00 0.00 Z", fill: "url(#rw5)" },
  { d: "M0 0 L -172.00 0.00 A 172 172 0 0 1 -121.62 -121.62 Z", fill: "url(#rw6)" },
  { d: "M0 0 L -121.62 -121.62 A 172 172 0 0 1 0.00 -172.00 Z", fill: "url(#rw7)" },
];

interface SwarmBat {
  id: number;
  dx: string;
  dy: string;
  scale: number;
  rot: number;
  width: number;
  delay: string;
}

function getPoeticEpitaph(cat: string | null, word: string, playerName: string): string[] {
  const pName = playerName.trim() || "Mortal";
  if (cat === "movies") {
    return [
      "The silver reels in eternal darkness spin,",
      "Thy breath grows cold, the void walks in.",
      `Thou couldst not name “${word}” to save thy head,`,
      `Now ${pName} joins the choir of the dead.`,
    ];
  } else if (cat === "books") {
    return [
      "The final page in blood is bound,",
      "Beneath the weeping burial ground.",
      `The cursed verse was “${word}” all along,`,
      `Now silent sleeps ${pName} where shadows throng.`,
    ];
  } else {
    return [
      "A breathless silence chills the crypt,",
      "From mortal grasp the life-rope slipped.",
      `Thou couldst not summon “${word}” from the night,`,
      `And ${pName} hath vanished from mortal light.`,
    ];
  }
}

export default function LexisGamePage() {
  // Screen state: 'name' | 'wheel' | 'game'
  const [screen, setScreen] = useState<"name" | "wheel" | "game">("name");
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [wins, setWins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [played, setPlayed] = useState(0);
  const [muted, setMuted] = useState(false);

  // Wheel state
  const [wheelRot, setWheelRot] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [verdict, setVerdict] = useState("");
  const [pickedCat, setPickedCat] = useState<string | null>(null);

  // Round / Game state
  const [currentCat, setCurrentCat] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
  const [guessed, setGuessed] = useState<Record<string, boolean>>({});
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const [shatteredKeys, setShatteredKeys] = useState<Record<string, boolean>>({});

  // 60-Second Timer state
  const [timeLeft, setTimeLeft] = useState(60);

  // Reward Wheel state
  const [rewardWheelRot, setRewardWheelRot] = useState(0);
  const [isRewardSpinning, setIsRewardSpinning] = useState(false);
  const [rewardWon, setRewardWon] = useState<RewardOption | null>(null);
  const [rewardMessage, setRewardMessage] = useState("");
  const rewardWheelRef = useRef<SVGSVGElement>(null);

  // Jumpscare & Swarm state
  const [jumpscareActive, setJumpscareActive] = useState(false);
  const [swarmBats, setSwarmBats] = useState<SwarmBat[]>([]);

  // End card state
  const [endCardVisible, setEndCardVisible] = useState(false);
  const [endCardWon, setEndCardWon] = useState(false);

  // Used words tracker
  const usedRef = useRef<Record<string, string[]>>({ books: [], characters: [], movies: [] });
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const wheelRef = useRef<SVGSVGElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const victimRef = useRef<SVGGElement>(null);
  const dropRef = useRef<SVGGElement>(null);
  const srRef = useRef<HTMLDivElement>(null);

  // Audio Context Ref
  const acRef = useRef<AudioContext | null>(null);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // Screen Reader Announce
  const say = useCallback((msg: string) => {
    if (srRef.current) {
      srRef.current.textContent = "";
      setTimeout(() => {
        if (srRef.current) srRef.current.textContent = msg;
      }, 30);
    }
  }, []);

  // Audio helper
  const actx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!acRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) acRef.current = new AudioCtx();
    }
    if (acRef.current && acRef.current.state === "suspended") {
      acRef.current.resume().catch(() => {});
    }
    return acRef.current;
  }, []);

  const tone = useCallback(
    (f: number, d: number, type: OscillatorType = "sine", v = 0.06, slide = 0, delay = 0) => {
      if (muted) return;
      const a = actx();
      if (!a) return;
      const t = a.currentTime + delay;
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, t);
      if (slide) {
        o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
      }
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g);
      g.connect(a.destination);
      o.start(t);
      o.stop(t + d + 0.05);
    },
    [muted, actx]
  );

  const sfx = useRef({
    click: () => tone(320, 0.06, "square", 0.03),
    hit: () => {
      tone(520, 0.12, "triangle", 0.07);
      tone(780, 0.2, "triangle", 0.06, 0, 0.08);
    },
    miss: () => tone(190, 0.4, "sawtooth", 0.06, -130),
    win: () => {
      [392, 494, 587, 784].forEach((f, i) => {
        tone(f, 0.35, "triangle", 0.07, 0, i * 0.13);
      });
    },
    lose: () => {
      tone(230, 0.9, "sawtooth", 0.07, -180);
      tone(110, 1.3, "square", 0.04, -60, 0.25);
    },
    jumpscare: () => {
      // Violent discordant screech
      tone(440, 1.1, "sawtooth", 0.22, 1200);
      tone(180, 1.6, "square", 0.18, -140, 0.05);
      tone(70, 2.4, "sawtooth", 0.28, -40, 0.1);
      // Flurry of bat wings flutter
      for (let i = 0; i < 24; i++) {
        tone(300 + Math.random() * 250, 0.05, "triangle", 0.09, -150, i * 0.06);
      }
    },
    ticks: (dur: number) => {
      for (let i = 1; i <= 26; i++) {
        tone(900, 0.03, "square", 0.025, 0, dur * (1 - Math.pow(1 - i / 26, 1 / 3)));
      }
    },
    stop: () => {
      tone(330, 0.5, "triangle", 0.07);
      tone(660, 0.6, "triangle", 0.05, 0, 0.12);
    },
    rewardWin: () => {
      [523, 659, 784, 1046].forEach((f, i) => {
        tone(f, 0.35, "triangle", 0.08, 0, i * 0.1);
      });
    },
    rewardTryAgain: () => {
      tone(380, 0.28, "sawtooth", 0.06, -70);
      tone(260, 0.45, "triangle", 0.07, -80, 0.14);
    },
    heartbeat: (critical: boolean) => {
      if (muted) return;
      tone(critical ? 85 : 72, 0.09, "sine", critical ? 0.12 : 0.08, -25);
      tone(critical ? 95 : 80, 0.09, "sine", critical ? 0.1 : 0.06, -20, 0.13);
      if (critical) {
        tone(1200, 0.035, "triangle", 0.045, 0, 0.02);
      }
    },
  });

  // Toggle Mute
  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      if (!next) sfx.current.click();
      return next;
    });
  };

  // Pick fresh entry from pool
  const pickEntry = useCallback((k: string): Entry => {
    const pool = BANK[k];
    let used = usedRef.current[k] || [];
    let fresh = pool.filter((e) => used.indexOf(e.w) < 0);
    if (!fresh.length) {
      usedRef.current[k] = used = [];
      fresh = pool.slice();
    }
    const e = fresh[Math.floor(Math.random() * fresh.length)];
    used.push(e.w);
    return e;
  }, []);

  // End card show
  const showEndCard = useCallback((won: boolean) => {
    setEndCardWon(won);
    setRewardWon(null);
    setRewardMessage("");
    setIsRewardSpinning(false);
    setEndCardVisible(true);
  }, []);

  // Trigger Win
  const triggerWin = useCallback(
    (entry: Entry, wrongLen: number) => {
      setIsLocked(true);
      setWins((w) => w + 1);
      setStreak((s) => s + 1);
      sfx.current.win();

      const v = victimRef.current;
      if (v && wrongLen > 0) {
        v.classList.remove("sway");
        void v.getBoundingClientRect();
        v.classList.add("saved");
      }
      say("You win. The word was " + entry.w + ".");
      later(() => showEndCard(true), 1300);
    },
    [later, say, showEndCard]
  );

  // Trigger Lose with Jumpscare & Swarming Bats
  const triggerLose = useCallback(
    (entry: Entry) => {
      setIsLocked(true);
      setStreak(0);

      const v = victimRef.current;
      if (v) {
        v.classList.remove("sway");
        v.classList.add("dead");
      }
      const d = dropRef.current;
      if (d) d.classList.add("jolt");

      const sc = sceneRef.current;
      if (sc) {
        sc.classList.add("zap", "shake");
      }

      sfx.current.lose();
      sfx.current.jumpscare();

      // Generate 36 swarming bats bursting out from center of screen
      const bats: SwarmBat[] = Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = 65 + Math.random() * 45;
        const dx = `${(Math.cos(angle) * dist).toFixed(1)}vw`;
        const dy = `${(Math.sin(angle) * dist).toFixed(1)}vh`;
        return {
          id: i,
          dx,
          dy,
          scale: +(5.5 + Math.random() * 7).toFixed(1),
          rot: Math.floor(Math.random() * 360),
          width: Math.floor(75 + Math.random() * 85),
          delay: `${(Math.random() * 0.35).toFixed(2)}s`,
        };
      });

      setSwarmBats(bats);
      setJumpscareActive(true);

      say("You have been hanged. The word was " + entry.w + ".");
      later(() => {
        setJumpscareActive(false);
        showEndCard(false);
      }, 2600);
    },
    [later, say, showEndCard]
  );


  // Start round
  const startRound = useCallback(
    (k: string) => {
      clearAllTimers();
      const entry = pickEntry(k);
      setCurrentCat(k);
      setCurrentEntry(entry);
      setGuessed({});
      setWrongLetters([]);
      setShatteredKeys({});
      setIsLocked(false);
      setPlayed((p) => p + 1);
      setEndCardVisible(false);
      setTimeLeft(60);
      setRewardWon(null);
      setRewardMessage("");
      setIsRewardSpinning(false);

      // Reset gallows animations
      PARTS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("show");
      });
      const v = victimRef.current;
      if (v) {
        v.setAttribute("class", "");
        v.style.removeProperty("--sw");
      }
      const d = dropRef.current;
      if (d) d.setAttribute("class", "");
      const sc = sceneRef.current;
      if (sc) sc.classList.remove("zap", "shake", "hurt");

      setScreen("game");
      window.scrollTo(0, 0);

      const letters = entry.w.replace(/ /g, "").length;
      say("Round started. Category " + META[k].label + ". " + letters + " letters. Clue: " + entry.c);
    },
    [clearAllTimers, pickEntry, say]
  );

  // Letter guess logic
  const guess = useCallback(
    (L: string) => {
      if (isLocked || !currentEntry || guessed[L]) return;

      actx();
      setGuessed((prev) => ({ ...prev, [L]: true }));

      const word = currentEntry.w;
      if (word.indexOf(L) >= 0) {
        // Hit
        sfx.current.hit();
        const nextGuessed = { ...guessed, [L]: true };
        const cleanWord = word.replace(/ /g, "");
        const allRevealed = cleanWord.split("").every((ch) => nextGuessed[ch]);

        say("Correct. " + L + " appears in the word.");
        if (allRevealed) {
          triggerWin(currentEntry, wrongLetters.length);
        }
      } else {
        // Miss
        const nextWrong = [...wrongLetters, L];
        setWrongLetters(nextWrong);
        const c = nextWrong.length;

        // Key shatter
        sfx.current.miss();
        later(() => {
          setShatteredKeys((prev) => ({ ...prev, [L]: true }));
        }, 440);

        // Gallows animation updates
        const part = document.getElementById(PARTS[c - 1]);
        if (part) part.classList.add("show");

        const v = victimRef.current;
        if (v) {
          v.style.setProperty("--sw", (1 + c * 0.9) + "deg");
          v.classList.add("sway");
        }

        const sc = sceneRef.current;
        if (sc) {
          sc.classList.remove("hurt");
          void sc.offsetWidth;
          sc.classList.add("hurt");
        }

        say("Wrong. " + L + " is not in the word. " + (MAX - c) + " lives left.");
        if (c >= MAX) {
          triggerLose(currentEntry);
        }
      }
    },
    [isLocked, currentEntry, guessed, wrongLetters, actx, later, say, triggerWin, triggerLose]
  );

  // Handle Wheel Spin
  const spinWheel = useCallback(() => {
    if (isSpinning) return;
    actx();
    setIsSpinning(true);
    setVerdict("");
    setPickedCat(null);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const idx = Math.floor(Math.random() * 3);
    const centre = idx * 120 + 60 + (Math.random() - 0.5) * 70;
    const cur = ((wheelRot % 360) + 360) % 360;
    let delta = ((360 - centre) - cur) % 360;
    if (delta < 0) delta += 360;

    const dur = reduced ? 0.6 : 5.2;
    const nextRot = wheelRot + (reduced ? 1 : 5) * 360 + delta;
    setWheelRot(nextRot);

    const w = wheelRef.current;
    if (w) {
      w.style.transition = "transform " + dur + "s cubic-bezier(.12,.62,.1,1)";
      w.style.transform = "rotate(" + nextRot + "deg)";
    }

    if (!reduced) sfx.current.ticks(dur);

    later(() => {
      const k = ORDER[idx];
      sfx.current.stop();
      setIsSpinning(false);
      setPickedCat(k);
      setVerdict(META[k].label + ": " + META[k].theme);
      say("The wheel chose " + META[k].label + ". " + META[k].theme + ".");

      later(() => {
        startRound(k);
      }, reduced ? 500 : 1500);
    }, dur * 1000 + 150);
  }, [isSpinning, wheelRot, actx, later, say, startRound]);

  // Handle Reward Wheel Spin
  const spinRewardWheel = useCallback(() => {
    if (isRewardSpinning) return;
    actx();
    setIsRewardSpinning(true);
    setRewardMessage("");
    setRewardWon(null);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Pick an index between 0 and 7
    const idx = Math.floor(Math.random() * 8);
    const centre = idx * 45 + 22.5 + (Math.random() - 0.5) * 22;
    const cur = ((rewardWheelRot % 360) + 360) % 360;
    let delta = ((360 - centre) - cur) % 360;
    if (delta < 0) delta += 360;

    const dur = reduced ? 0.6 : 5.0;
    const nextRot = rewardWheelRot + (reduced ? 1 : 5) * 360 + delta;
    setRewardWheelRot(nextRot);

    const rw = rewardWheelRef.current;
    if (rw) {
      rw.style.transition = "transform " + dur + "s cubic-bezier(.12,.62,.1,1)";
      rw.style.transform = "rotate(" + nextRot + "deg)";
    }

    if (!reduced) sfx.current.ticks(dur);

    later(() => {
      const prize = REWARD_OPTIONS[idx];
      sfx.current.stop();
      setIsRewardSpinning(false);
      setRewardWon(prize);

      if (prize.isTryAgain) {
        sfx.current.rewardTryAgain();
        setRewardMessage("💀 The spirits tease thee: Try again! Spin once more!");
        say("Landed on Try again. You may spin the reward wheel again.");
      } else {
        sfx.current.rewardWin();
        setRewardMessage(`🏆 Thou hast claimed: ${prize.label} ${prize.icon}`);
        say("Congratulations! You won " + prize.label + "!");
      }
    }, dur * 1000 + 150);
  }, [isRewardSpinning, actx, rewardWheelRot, later, say]);

  // 60-Second Countdown timer with tension
  useEffect(() => {
    if (screen !== "game" || isLocked || endCardVisible || jumpscareActive || !currentEntry) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerLose(currentEntry);
          return 0;
        }

        const next = prev - 1;

        // Tension sound effects
        if (next <= 10) {
          sfx.current.heartbeat(true);
        } else if (next <= 20) {
          sfx.current.heartbeat(false);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, isLocked, endCardVisible, jumpscareActive, currentEntry, triggerLose]);

  // Reset verdict and prepare wheel
  const resetVerdict = useCallback(() => {
    setVerdict("");
    setPickedCat(null);
    setIsSpinning(false);
  }, []);

  // Form Submit for Name Entry
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actx();
    const v = name.replace(/\s+/g, " ").trim();
    if (!v) {
      setNameErr("The stone is blank. Carve a name first.");
      nameInputRef.current?.focus();
      return;
    }
    setNameErr("");
    setName(v);
    sfx.current.click();
    resetVerdict();
    setScreen("wheel");
    window.scrollTo(0, 0);
  };

  // Keyboard shortcut listener for letters
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (screen !== "game" || endCardVisible) return;
      if (/^[a-zA-Z]$/.test(e.key)) {
        guess(e.key.toUpperCase());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, endCardVisible, guess]);

  // Focus management on mount
  useEffect(() => {
    if (screen === "name") {
      nameInputRef.current?.focus({ preventScroll: true });
    }
  }, [screen]);

  // Ambient Embers Generation
  const [embers, setEmbers] = useState<
    Array<{ x: string; z: string; t: string; w: string; dx: string }>
  >([]);

  useEffect(() => {
    setEmbers(
      Array.from({ length: 22 }, () => ({
        x: (Math.random() * 100).toFixed(1),
        z: (2 + Math.random() * 3).toFixed(1),
        t: (7 + Math.random() * 8).toFixed(1),
        w: (-Math.random() * 12).toFixed(1),
        dx: ((Math.random() - 0.5) * 140).toFixed(0),
      }))
    );
  }, []);

  // Split current word into words and characters for Wordle / blanks display
  const wordTokens = currentEntry ? currentEntry.w.split(" ") : [];

  return (
    <>
      {/* Shared Vector Sprites from lexis-game.html */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <symbol id="pk" viewBox="0 0 32 32">
            <path d="M16 9 q-1 -5 4 -7" stroke="#6fb04a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="16" cy="19" rx="14" ry="11.5" fill="#ff7a1a" />
            <path d="M16 8 C9 12 9 26 16 30 M16 8 C23 12 23 26 16 30" stroke="#b53f05" strokeWidth="1.6" fill="none" />
            <path d="M8 16 l5 0 -2.5 5z M19 16 l5 0 -2.5 5z" fill="#2a0f03" />
            <path d="M9 24 l3 -2 2 2 2 -2 2 2 2 -2 3 2 q-8 5 -14 0z" fill="#2a0f03" />
          </symbol>
          <symbol id="bat" viewBox="-30 -14 60 28">
            <path d="M0 -4 C-4 -10 -10 -12 -14 -8 C-18 -12 -24 -12 -30 -6 C-24 -4 -22 2 -18 6 C-14 2 -10 2 -6 6 C-4 4 -2 4 0 8 C2 4 4 4 6 6 C10 2 14 2 18 6 C22 2 24 -4 30 -6 C24 -12 18 -12 14 -8 C10 -12 4 -10 0 -4Z M-3 -4 L-2 -11 L0 -5 L2 -11 L3 -4Z" />
          </symbol>
        </defs>
      </svg>

      {/* Atmospheric Background (Moon, Fog, Bats, Embers, Graveyard) */}
      <div className="sky" aria-hidden="true">
        <div className="moon" />
        <div className="fog" />
        <div className="fog two" />
        <div className="bat" style={{ "--y": "9%", "--s": "52px", "--d": "19s", "--dl": "-3s" } as React.CSSProperties}>
          <svg viewBox="-30 -14 60 28">
            <use href="#bat" />
          </svg>
        </div>
        <div className="bat" style={{ "--y": "20%", "--s": "34px", "--d": "26s", "--dl": "-14s" } as React.CSSProperties}>
          <svg viewBox="-30 -14 60 28">
            <use href="#bat" />
          </svg>
        </div>
        <div className="bat" style={{ "--y": "30%", "--s": "42px", "--d": "22s", "--dl": "-9s" } as React.CSSProperties}>
          <svg viewBox="-30 -14 60 28">
            <use href="#bat" />
          </svg>
        </div>
        <div id="embers">
          {embers.map((em, idx) => (
            <span
              key={idx}
              className="ember"
              style={
                {
                  "--x": `${em.x}%`,
                  "--z": `${em.z}px`,
                  "--t": `${em.t}s`,
                  "--w": `${em.w}s`,
                  "--dx": `${em.dx}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <svg className="graves" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice">
          <g fill="#05030a" stroke="#05030a">
            <path d="M0 220 L0 172 Q150 150 300 176 T620 168 T900 178 T1200 160 L1200 220Z" stroke="none" />
            <path d="M110 182 v-46 a20 20 0 0 1 40 0 v46z" stroke="none" />
            <path d="M250 184 v-34 a15 15 0 0 1 30 0 v34z" stroke="none" />
            <path d="M430 178 v-58 h-18 v-14 h18 v-18 h14 v18 h18 v14 h-18 v58z" stroke="none" />
            <path d="M690 176 v-40 a18 18 0 0 1 36 0 v40z" stroke="none" />
            <path d="M800 182 v-52 h-14 v-12 h14 v-14 h12 v14 h14 v12 h-14 v52z" stroke="none" />
            <path
              d="M1010 182 L1016 90 M1014 124 L1062 84 M1013 106 L972 70 M1016 92 L1034 48 M1062 84 L1090 78 M972 70 L950 72"
              fill="none"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path d="M1130 182 v-44 a20 20 0 0 1 40 0 v44z" stroke="none" />
          </g>
        </svg>
      </div>

      <main className="app">
        {/* Top Header Bar */}
        <header className="bar" id="topbar" hidden={screen === "name"}>
          <div className="brand">Lexis Game</div>
          <div className="chips">
            <span className="chip who" id="chipName">
              {name}
            </span>
            <span className="chip">
              Wins <b id="chipWins">{wins}</b>
            </span>
            <span className="chip">
              Streak <b id="chipStreak">{streak}</b>
            </span>
            <button
              className="icon-btn"
              id="mute"
              type="button"
              aria-pressed={muted}
              aria-label={muted ? "Unmute sound" : "Mute sound"}
              title="Sound"
              onClick={toggleMute}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 9v6h4l5 4V5L8 9z" />
                <path className="wave" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
              </svg>
            </button>
          </div>
        </header>

        {/* SCREEN 1: NAME */}
        {screen === "name" && (
          <section className="screen" id="s-name" aria-labelledby="logo">
            <div className="intro">
              <div>
                <p className="eyebrow">Hangman after dark</p>
                <h1 className="logo" id="logo">
                  L<span className="flick">e</span>xis<small>Game</small>
                </h1>
                <p className="lede">
                  Guess the word before the rope pulls tight. The graveyard keeps a long memory, and a short supply of pumpkins.
                </p>
                <p className="rules">Three doors. Six lives. One rope.</p>
              </div>
              <form className="stone" id="nameForm" noValidate onSubmit={handleNameSubmit}>
                <p className="rip">Here lies</p>
                <label htmlFor="nameInput">Carve your name</label>
                <input
                  id="nameInput"
                  ref={nameInputRef}
                  type="text"
                  maxLength={18}
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="Your name, mortal"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameErr) setNameErr("");
                  }}
                />
                <p className="err" id="nameErr" role="alert">
                  {nameErr}
                </p>
                <button className="btn" type="submit">
                  Enter the crypt
                </button>
              </form>
            </div>
          </section>
        )}

        {/* SCREEN 2: WHEEL */}
        {screen === "wheel" && (
          <section className="screen" id="s-wheel" aria-labelledby="fateTitle">
            <div className="fate">
              <h2 id="fateTitle">
                Welcome, <em id="fateName">{name}</em>
              </h2>
              <p>Spin the wheel of fate. It decides which door you open tonight.</p>
              <div className="wheelbox">
                <svg className="pointer" viewBox="0 0 40 56" aria-hidden="true">
                  <path d="M20 54 L4 14 A18 18 0 1 1 36 14Z" fill="#e0334a" stroke="#f2e8cf" strokeWidth="2" />
                  <circle cx="20" cy="16" r="6" fill="#0a0612" />
                </svg>
                {/* SVG Wheel matching exact sectors from lexis-game.html */}
                <svg
                  ref={wheelRef}
                  className="wheel"
                  id="wheel"
                  viewBox="-200 -200 400 400"
                  aria-hidden="true"
                  style={{ transformOrigin: "50% 50%" }}
                >
                  <defs>
                    <radialGradient id="gb" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#2a1458" />
                      <stop offset="1" stopColor="#6a3cc4" />
                    </radialGradient>
                    <radialGradient id="gc" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#8a2f05" />
                      <stop offset="1" stopColor="#ff8a2a" />
                    </radialGradient>
                    <radialGradient id="gm" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#0c2a12" />
                      <stop offset="1" stopColor="#3f9a3a" />
                    </radialGradient>
                  </defs>
                  <circle r="194" fill="#120a1f" stroke="#4b3d6b" strokeWidth="4" />
                  <circle r="176" fill="#0a0612" />
                  {/* BOOKS (0 to 120) */}
                  <path
                    d="M0 0 L0.00 -172.00 A172 172 0 0 1 148.96 86.00Z"
                    fill="url(#gb)"
                    stroke="#f2e8cf"
                    strokeOpacity=".4"
                    strokeWidth="2"
                  />
                  {/* CHARACTERS (120 to 240) */}
                  <path
                    d="M0 0 L148.96 86.00 A172 172 0 0 1 -148.96 86.00Z"
                    fill="url(#gc)"
                    stroke="#f2e8cf"
                    strokeOpacity=".4"
                    strokeWidth="2"
                  />
                  {/* MOVIES (240 to 360) */}
                  <path
                    d="M0 0 L-148.96 86.00 A172 172 0 0 1 0.00 -172.00Z"
                    fill="url(#gm)"
                    stroke="#f2e8cf"
                    strokeOpacity=".4"
                    strokeWidth="2"
                  />
                  {/* Labels */}
                  <text
                    className="wl"
                    transform="rotate(-30)"
                    x="54"
                    y="9"
                    textLength="80"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    BOOKS
                  </text>
                  <text
                    className="wl"
                    transform="rotate(90)"
                    x="54"
                    y="9"
                    textLength="106"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    CHARACTERS
                  </text>
                  <text
                    className="wl"
                    transform="rotate(210)"
                    x="54"
                    y="9"
                    textLength="86"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    MOVIES
                  </text>
                  {/* 24 Studs around rim */}
                  {Array.from({ length: 24 }).map((_, k) => {
                    const rad = (k * 15 * Math.PI) / 180;
                    const cx = (183 * Math.sin(rad)).toFixed(2);
                    const cy = (-183 * Math.cos(rad)).toFixed(2);
                    return <circle key={k} className="stud" cx={cx} cy={cy} r="3.6" fill="#ffb04a" />;
                  })}
                  {/* Center Skull Hub */}
                  <circle r="38" fill="#0a0612" stroke="#ffb04a" strokeWidth="4" />
                  <ellipse cx="0" cy="-3" rx="17" ry="15" fill="#f2e8cf" />
                  <rect x="-10" y="8" width="20" height="12" rx="2" fill="#f2e8cf" />
                  <ellipse cx="-6.5" cy="-3" rx="4.2" ry="5" fill="#0a0612" />
                  <ellipse cx="6.5" cy="-3" rx="4.2" ry="5" fill="#0a0612" />
                  <path d="M0 3 l-2.4 5 h4.8z" fill="#0a0612" />
                  <path d="M-5 13 v6 M0 13 v6 M5 13 v6" stroke="#0a0612" strokeWidth="1.6" />
                </svg>
              </div>
              <button
                className="btn"
                id="spinBtn"
                type="button"
                disabled={isSpinning}
                onClick={spinWheel}
              >
                Spin the wheel
              </button>
              <div className="verdict" id="verdict" aria-live="polite">
                {verdict}
              </div>
              <ul className="legend" id="legend">
                <li data-k="books" className={pickedCat === "books" ? "pick" : ""}>
                  <b>Books</b> classics and horror
                </li>
                <li data-k="characters" className={pickedCat === "characters" ? "pick" : ""}>
                  <b>Characters</b> fictional figures
                </li>
                <li data-k="movies" className={pickedCat === "movies" ? "pick" : ""}>
                  <b>Movies</b> horror and sci-fi
                </li>
              </ul>
            </div>
          </section>
        )}

        {/* SCREEN 3: CRYPT */}
        {screen === "game" && currentEntry && currentCat && (
          <section className="screen" id="s-game" aria-label="Hangman round">
            {/* Pulsing screen-edge vignette under high tension */}
            {timeLeft <= 20 && !isLocked && !endCardVisible && (
              <div
                className={`panic-vignette ${timeLeft <= 10 ? "critical" : ""}`}
                aria-hidden="true"
              />
            )}
            <div className="crypt">
              {/* Scene & Gallows */}
              <div className="scene" id="scene" ref={sceneRef}>
                <div className="scene-top">
                  <div className="lives" id="lives" role="img" aria-label={`${MAX - wrongLetters.length} lives remaining`}>
                    {Array.from({ length: MAX }).map((_, i) => (
                      <svg
                        key={i}
                        className={`pk ${i < wrongLetters.length ? "lost" : ""}`}
                        viewBox="0 0 32 32"
                      >
                        <use href="#pk" />
                      </svg>
                    ))}
                  </div>

                  <div className="tagline" id="catTag">
                    {META[currentCat].label} · {currentEntry.t}
                  </div>
                </div>

                <svg
                  className="gallows"
                  viewBox="0 0 320 340"
                  role="img"
                  aria-label="A gallows. A pumpkin-headed skeleton appears piece by piece with each wrong guess."
                >
                  <defs>
                    <linearGradient id="wood" x1="0" x2="1">
                      <stop offset="0" stopColor="#5a3e29" />
                      <stop offset="1" stopColor="#2c1d14" />
                    </linearGradient>
                    <radialGradient id="pump" cx=".4" cy=".35" r=".85">
                      <stop offset="0" stopColor="#ffb04a" />
                      <stop offset=".6" stopColor="#ff7a1a" />
                      <stop offset="1" stopColor="#a73a04" />
                    </radialGradient>
                  </defs>

                  {/* ground & scenery */}
                  <path d="M0 330 L0 306 Q80 292 160 304 T320 298 L320 340 L0 340Z" fill="#05030a" />
                  <path d="M248 306 v-44 a17 17 0 0 1 34 0 v44z" fill="#1c1430" stroke="#33274d" strokeWidth="2" />
                  <path d="M258 280 h14 M265 272 v16" stroke="#46386a" strokeWidth="2" />
                  <path d="M292 304 v-30 a12 12 0 0 1 24 0 v30z" fill="#171028" stroke="#2e2347" strokeWidth="2" />
                  <path
                    d="M20 306 l4 -14 4 14 4 -16 4 16 4 -12 4 12"
                    stroke="#0d2210"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* timber */}
                  <rect x="36" y="302" width="198" height="14" rx="2" fill="url(#wood)" />
                  <rect x="70" y="40" width="14" height="264" fill="url(#wood)" />
                  <rect x="70" y="40" width="152" height="14" rx="2" fill="url(#wood)" />
                  <path d="M84 108 L132 54" stroke="#3a281b" strokeWidth="10" strokeLinecap="square" />
                  <path d="M74 70 v40 M78 120 v60 M74 200 v70" stroke="#1d1209" strokeWidth="1.2" opacity=".7" />
                  <circle cx="77" cy="47" r="2.2" fill="#1d1209" />
                  <circle cx="212" cy="47" r="2.2" fill="#1d1209" />

                  {/* victim & drop */}
                  <g id="drop" ref={dropRef}>
                    <g id="victim" ref={victimRef}>
                      <line x1="190" y1="54" x2="190" y2="94" stroke="#c9a66b" strokeWidth="3.5" />
                      <path d="M184 88 q6 -5 12 0 q2 6 -6 8 q-8 -2 -6 -8z" fill="none" stroke="#c9a66b" strokeWidth="3" />

                      {/* Head */}
                      <g className="part" id="p-head">
                        <g className="pop">
                          <ellipse cx="190" cy="116" rx="25" ry="22" fill="url(#pump)" />
                          <path
                            d="M190 94 C178 100 175 132 190 138 M190 94 C202 100 205 132 190 138"
                            stroke="#a73a04"
                            strokeWidth="1.6"
                            fill="none"
                          />
                          <path d="M188 95 q-2 -7 5 -10" stroke="#6fb04a" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <polygon className="eye" points="173,108 185,108 179,119" />
                          <polygon className="eye" points="195,108 207,108 201,119" />
                          <path className="eye" d="M174 126 l6 5 5 -5 5 6 5 -6 5 5 6 -5 -1 8 q-15 8 -30 0z" />
                        </g>
                      </g>

                      {/* Body */}
                      <g className="part" id="p-body">
                        <line className="draw bone" pathLength={1} x1="190" y1="138" x2="190" y2="208" />
                        <path className="draw bone" pathLength={1} d="M176 152 Q190 160 204 152" />
                        <path className="draw bone" pathLength={1} d="M178 166 Q190 174 202 166" />
                        <path className="draw bone" pathLength={1} d="M180 180 Q190 187 200 180" />
                        <line className="draw bone" pathLength={1} x1="178" y1="208" x2="202" y2="208" />
                      </g>

                      {/* Left Arm */}
                      <g className="part" id="p-armL">
                        <path className="draw bone" pathLength={1} d="M190 148 L160 160 L152 192" />
                        <circle className="pop" cx="152" cy="196" r="4.5" fill="#f2e8cf" />
                      </g>

                      {/* Right Arm */}
                      <g className="part" id="p-armR">
                        <path className="draw bone" pathLength={1} d="M190 148 L220 160 L228 192" />
                        <circle className="pop" cx="228" cy="196" r="4.5" fill="#f2e8cf" />
                      </g>

                      {/* Left Leg */}
                      <g className="part" id="p-legL">
                        <path className="draw bone" pathLength={1} d="M184 208 L172 244 L168 270" />
                        <path className="draw bone" pathLength={1} d="M168 272 L156 276" />
                      </g>

                      {/* Right Leg */}
                      <g className="part" id="p-legR">
                        <path className="draw bone" pathLength={1} d="M196 208 L208 244 L212 270" />
                        <path className="draw bone" pathLength={1} d="M212 272 L224 276" />
                      </g>
                    </g>
                  </g>
                </svg>
                <div className="flash" />
              </div>

              {/* Play Area: Clue, Wordle Slots, Cursed letters, Keyboard */}
              <div className="play">
                <div className="parch">
                  <div className="k">
                    <span>The clue</span>
                    <span id="clueMeta">
                      {currentEntry.w.replace(/ /g, "").length} letters
                      {wordTokens.length > 1 ? ` · ${wordTokens.length} words` : ""}
                    </span>
                  </div>
                  <p id="clueText">{currentEntry.c}</p>
                </div>

                <div
                  className={`board ${
                    wordTokens.length > 0 &&
                    currentEntry.w.replace(/ /g, "").split("").every((ch) => guessed[ch])
                      ? "won"
                      : ""
                  }`}
                  id="board"
                  aria-label="Word to guess"
                >
                  {wordTokens.map((wd, wIdx) => (
                    <div key={wIdx} className="word">
                      {wd.split("").map((ch, cIdx) => {
                        const isRevealed = guessed[ch];
                        const isMissedAtEnd = endCardVisible && !endCardWon && !isRevealed;
                        return (
                          <span
                            key={cIdx}
                            className={`slot ${isRevealed ? "on" : ""} ${isMissedAtEnd ? "doom" : ""}`}
                            data-ch={ch}
                          >
                            {isRevealed || isMissedAtEnd ? ch : ""}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Cursed Letters Tray */}
                <div className="cursed" id="cursed">
                  <span className="lbl">Cursed letters</span>
                  {wrongLetters.length === 0 ? (
                    <span className="none">None yet. Choose wisely.</span>
                  ) : (
                    wrongLetters.map((L) => (
                      <span key={L} className="x">
                        {L}
                      </span>
                    ))
                  )}
                </div>

                {/* Keyboard */}
                <div className="keys" id="keys" role="group" aria-label="Letters">
                  {ROWS.map((row, rIdx) => (
                    <div key={rIdx} className="krow">
                      {row.split("").map((L) => {
                        const isGuessed = guessed[L];
                        const isHit = isGuessed && currentEntry.w.indexOf(L) >= 0;
                        const isMiss = isGuessed && currentEntry.w.indexOf(L) < 0;
                        const isGone = shatteredKeys[L];

                        return (
                          <button
                            key={L}
                            type="button"
                            className={`key ${isHit ? "hit" : ""} ${isMiss ? "miss" : ""} ${isGone ? "gone" : ""}`}
                            disabled={isLocked || isGuessed}
                            aria-label={`Letter ${L}`}
                            onClick={() => guess(L)}
                          >
                            {L}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LARGE SPOOKY BOTTOM TIMER ALTAR */}
            <div
              className={`spooky-timer-altar ${
                timeLeft <= 10 ? "panic" : timeLeft <= 20 ? "tense" : ""
              }`}
              role="timer"
              aria-live="polite"
              aria-label={`${timeLeft} seconds remaining`}
            >
              <div className="spooky-timer-topline">
                <span>⏳</span>
                <span className="status-phrase">
                  {timeLeft <= 10
                    ? "DEATH KNOCKS! THE NOOSE DROPS!"
                    : timeLeft <= 20
                    ? "THE NOOSE TIGHTENS!"
                    : "MORTAL SECONDS REMAINING"}
                </span>
              </div>

              <div className="spooky-timer-body">
                {/* Left Spooky Totem: Flickering Pumpkin */}
                <svg className="spooky-totem left" viewBox="0 0 32 32" aria-hidden="true">
                  <use href="#pk" />
                </svg>

                {/* Large Timer Digits */}
                <div className="spooky-timer-digits">
                  <span>{String(Math.floor(timeLeft / 60)).padStart(2, "0")}</span>
                  <span className="colon">:</span>
                  <span>{String(timeLeft % 60).padStart(2, "0")}</span>
                </div>

                {/* Right Spooky Totem: Mystic Skull */}
                <svg className="spooky-totem right" viewBox="0 0 32 32" aria-hidden="true">
                  <ellipse cx="16" cy="14" rx="11" ry="10" fill={timeLeft <= 10 ? "#e0334a" : "#f2e8cf"} />
                  <rect x="9" y="20" width="14" height="8" rx="2" fill={timeLeft <= 10 ? "#e0334a" : "#f2e8cf"} />
                  <circle cx="12" cy="14" r="3" fill="#0a0612" />
                  <circle cx="20" cy="14" r="3" fill="#0a0612" />
                  <polygon points="16,17 14,20 18,20" fill="#0a0612" />
                  <line x1="12" y1="23" x2="12" y2="28" stroke="#0a0612" strokeWidth="1.5" />
                  <line x1="16" y1="23" x2="16" y2="28" stroke="#0a0612" strokeWidth="1.5" />
                  <line x1="20" y1="23" x2="20" y2="28" stroke="#0a0612" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Altar Burning Fuse Bar */}
              <div className="altar-fuse">
                <div
                  className="altar-fuse-fill"
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
              </div>
            </div>
          </section>
        )}

        {/* END CARD MODAL */}
        {endCardVisible && currentEntry && (
          <div className="end" id="end" role="dialog" aria-modal="true" aria-labelledby="endTitle">
            <div className={`end-card ${endCardWon ? "win" : "lose"}`} id="endCard">
              <h2 id="endTitle">
                {endCardWon ? "The spirits approve" : "Hanged at midnight"}
              </h2>
              <p className="sub" id="endSub">
                {endCardWon
                  ? wrongLetters.length
                    ? `You cut the rope with ${MAX - wrongLetters.length} ${
                        MAX - wrongLetters.length === 1 ? "life" : "lives"
                      } to spare in ${60 - timeLeft}s.`
                    : "Not a single wrong step. The graveyard is impressed."
                  : `${name}, the word was:`}
              </p>
              <p className="the-word" id="endWord">
                {currentEntry.w}
              </p>

              {/* Poetic Funeral Epitaph on defeat */}
              {!endCardWon && (
                <div className="poem-box">
                  {getPoeticEpitaph(currentCat, currentEntry.w, name).map((line, idx) => (
                    <span key={idx} className="poem-line">
                      {line}
                    </span>
                  ))}
                </div>
              )}

              {/* REWARD WHEEL ON VICTORY */}
              {endCardWon && (
                <div className="reward-section">
                  <div className="reward-intro">
                    <span className="reward-tag">Victory Bounty</span>
                    <h3 className="reward-heading">The Wheel of Spoils</h3>
                    <p className="reward-desc">
                      Thou hast cheated the grave! Spin the wheel to claim thy reward.
                    </p>
                  </div>

                  <div className="reward-wheelbox">
                    <svg className="reward-pointer" viewBox="0 0 40 56" aria-hidden="true">
                      <path d="M20 54 L4 14 A18 18 0 1 1 36 14Z" fill="#ff7a1a" stroke="#f2e8cf" strokeWidth="2" />
                      <circle cx="20" cy="16" r="6" fill="#0a0612" />
                    </svg>

                    <svg
                      ref={rewardWheelRef}
                      className="reward-wheel"
                      viewBox="-200 -200 400 400"
                      aria-hidden="true"
                      style={{ transformOrigin: "50% 50%" }}
                    >
                      <defs>
                        <radialGradient id="rw0" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#8a2f05" />
                          <stop offset="100%" stopColor="#e66a00" />
                        </radialGradient>
                        <radialGradient id="rw1" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#3d1466" />
                          <stop offset="100%" stopColor="#8a3cc4" />
                        </radialGradient>
                        <radialGradient id="rw2" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#0c2a12" />
                          <stop offset="100%" stopColor="#289438" />
                        </radialGradient>
                        <radialGradient id="rw3" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#660a1d" />
                          <stop offset="100%" stopColor="#b81d3d" />
                        </radialGradient>
                        <radialGradient id="rw4" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#142854" />
                          <stop offset="100%" stopColor="#2e64c4" />
                        </radialGradient>
                        <radialGradient id="rw5" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#5c3804" />
                          <stop offset="100%" stopColor="#b37409" />
                        </radialGradient>
                        <radialGradient id="rw6" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#3d0d1b" />
                          <stop offset="100%" stopColor="#751934" />
                        </radialGradient>
                        <radialGradient id="rw7" cx="0" cy="0" r="172" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#221838" />
                          <stop offset="100%" stopColor="#4a3575" />
                        </radialGradient>
                      </defs>

                      <circle r="194" fill="#120a1f" stroke="#4b3d6b" strokeWidth="4" />
                      <circle r="176" fill="#0a0612" />

                      {/* 8 Sectors */}
                      {REWARD_SLICES.map((s, idx) => (
                        <path
                          key={idx}
                          d={s.d}
                          fill={s.fill}
                          stroke="#f2e8cf"
                          strokeOpacity=".35"
                          strokeWidth="2"
                        />
                      ))}

                      {/* 8 Labels with icons */}
                      {REWARD_OPTIONS.map((opt, idx) => {
                        const mid = idx * 45 + 22.5;
                        const isFlipped = mid > 90 && mid < 270;
                        return (
                          <g
                            key={idx}
                            transform={`rotate(${mid - 90}) translate(108, 0) ${
                              isFlipped ? "rotate(180)" : ""
                            }`}
                          >
                            <text
                              className="reward-wl"
                              x="0"
                              y="4"
                              textAnchor="middle"
                            >
                              {opt.label} {opt.icon}
                            </text>
                          </g>
                        );
                      })}

                      {/* 24 Studs around rim */}
                      {Array.from({ length: 24 }).map((_, k) => {
                        const rad = (k * 15 * Math.PI) / 180;
                        const cx = (183 * Math.sin(rad)).toFixed(2);
                        const cy = (-183 * Math.cos(rad)).toFixed(2);
                        return <circle key={k} className="stud" cx={cx} cy={cy} r="3.4" fill="#ffb04a" />;
                      })}

                      {/* Center gift medallion */}
                      <circle r="36" fill="#0a0612" stroke="#ffb04a" strokeWidth="3.5" />
                      <text x="0" y="8" textAnchor="middle" fontSize="24" fill="#f2e8cf">
                        🎁
                      </text>
                    </svg>
                  </div>

                  {/* Outcome Banner */}
                  {rewardMessage && (
                    <div
                      className={`reward-banner ${rewardWon?.isTryAgain ? "try-again" : "won"}`}
                      aria-live="polite"
                    >
                      {rewardMessage}
                    </div>
                  )}

                  {/* Reward Action Buttons */}
                  <div className="reward-acts">
                    {!rewardWon && (
                      <button
                        className="btn"
                        type="button"
                        disabled={isRewardSpinning}
                        onClick={spinRewardWheel}
                      >
                        {isRewardSpinning ? "Spinning..." : "Spin for reward"}
                      </button>
                    )}

                    {rewardWon?.isTryAgain && (
                      <button
                        className="btn"
                        type="button"
                        disabled={isRewardSpinning}
                        onClick={spinRewardWheel}
                      >
                        {isRewardSpinning ? "Spinning..." : "Spin again"}
                      </button>
                    )}

                    {rewardWon && !rewardWon.isTryAgain && (
                      <button
                        className="btn"
                        type="button"
                        onClick={() => {
                          sfx.current.click();
                          setEndCardVisible(false);
                          resetVerdict();
                          setScreen("wheel");
                        }}
                      >
                        Play next round
                      </button>
                    )}

                    <button
                      className="btn ghost"
                      type="button"
                      disabled={isRewardSpinning}
                      onClick={() => {
                        sfx.current.click();
                        setEndCardVisible(false);
                        resetVerdict();
                        setScreen("wheel");
                      }}
                    >
                      {rewardWon && !rewardWon.isTryAgain ? "Spin category wheel" : "Skip reward"}
                    </button>
                  </div>
                </div>
              )}

              <p className="stats" id="endStats">
                Wins {wins} · Streak {streak} · Rounds {played}
              </p>

              {/* Standard acts only shown on defeat */}
              {!endCardWon && (
                <div className="acts">
                  <button
                    className="btn"
                    id="againBtn"
                    type="button"
                    onClick={() => {
                      sfx.current.click();
                      setEndCardVisible(false);
                      resetVerdict();
                      setScreen("wheel");
                    }}
                  >
                    Spin again
                  </button>
                  <button
                    className="btn ghost"
                    id="renameBtn"
                    type="button"
                    onClick={() => {
                      sfx.current.click();
                      setEndCardVisible(false);
                      setWins(0);
                      setStreak(0);
                      setPlayed(0);
                      setName("");
                      setScreen("name");
                    }}
                  >
                    New name
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OVERWHELMING JUMPSCARE & BAT SWARM OVERLAY */}
        {jumpscareActive && (
          <div className="jumpscare-stage" aria-hidden="true">
            <div className="jumpscare-flash" />

            {/* Giant lunging pumpkin skull */}
            <div className="jumpscare-skull">
              <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_50px_#ff0033]">
                <defs>
                  <radialGradient id="jsPump" cx=".5" cy=".4" r=".6">
                    <stop offset="0%" stopColor="#fff3a1" />
                    <stop offset="35%" stopColor="#ff5500" />
                    <stop offset="75%" stopColor="#b3001e" />
                    <stop offset="100%" stopColor="#1a0005" />
                  </radialGradient>
                </defs>
                {/* Pumpkin Head */}
                <ellipse cx="100" cy="100" rx="85" ry="78" fill="url(#jsPump)" />
                {/* Grooves */}
                <path d="M100 22 C60 40 50 160 100 178 M100 22 C140 40 150 160 100 178" stroke="#4d000b" strokeWidth="4" fill="none" />
                {/* Stem */}
                <path d="M96 24 Q90 5 110 2" stroke="#448822" strokeWidth="12" fill="none" strokeLinecap="round" />
                {/* Glowing Demonic Eyes */}
                <polygon points="62,75 88,75 75,102" fill="#fff" filter="drop-shadow(0 0 10px #ff0000)" />
                <polygon points="138,75 112,75 125,102" fill="#fff" filter="drop-shadow(0 0 10px #ff0000)" />
                {/* Wicked Fanged Mouth */}
                <path d="M50 128 L64 140 L76 128 L88 142 L100 128 L112 142 L124 128 L136 140 L150 128 L142 152 Q100 175 58 152 Z" fill="#000" />
                <polygon points="64,128 70,136 76,128" fill="#fff" />
                <polygon points="88,128 94,136 100,128" fill="#fff" />
                <polygon points="112,128 118,136 124,128" fill="#fff" />
                <polygon points="70,146 76,138 82,146" fill="#fff" />
                <polygon points="94,146 100,138 106,146" fill="#fff" />
                <polygon points="118,146 124,138 130,146" fill="#fff" />
              </svg>
            </div>

            {/* Screaming Bat Swarm exploding outward toward player */}
            {swarmBats.map((bat) => (
              <div
                key={bat.id}
                className="screaming-bat"
                style={
                  {
                    "--bdx": bat.dx,
                    "--bdy": bat.dy,
                    "--bscale": bat.scale,
                    "--brot": `${bat.rot}deg`,
                    "--bw": `${bat.width}px`,
                    "--bdelay": bat.delay,
                  } as React.CSSProperties
                }
              >
                <svg viewBox="-30 -14 60 28">
                  <use href="#bat" />
                </svg>
              </div>
            ))}
          </div>
        )}

        <div className="sr" id="sr" ref={srRef} aria-live="polite" />
      </main>
    </>
  );
}

