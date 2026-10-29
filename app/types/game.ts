export type GameScreen =
  | "NAME_ENTRY"
  | "WHEEL_SPIN"
  | "THEME_REVEAL"
  | "PLAYING"
  | "GAME_OVER"
  | "VICTORY";

export type Category = "MOVIES" | "BOOKS" | "CHARACTERS";

export type MovieSubgenre = "Horror" | "Sci-Fi";
export type BookSubgenre = "Classical" | "Horror";
export type CharacterSubgenre = "Fictional";

export type Subgenre = MovieSubgenre | BookSubgenre | CharacterSubgenre;

export interface WordItem {
  id: string;
  word: string;
  clue: string;
  category: Category;
  subgenre: Subgenre;
  difficulty: "Easy" | "Medium" | "Hard";
  funFact?: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
}
