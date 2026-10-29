import { WordItem, Category, Subgenre } from "../types/game";

export const WORD_DATABASE: WordItem[] = [
  // --- MOVIES: HORROR ---
  {
    id: "m-h-1",
    word: "THE EXORCIST",
    clue: "A 1973 horror classic where two priests attempt to cast out a demon from a young possessed girl.",
    category: "MOVIES",
    subgenre: "Horror",
    difficulty: "Medium",
    funFact: "Nominated for 10 Oscars, becoming the first horror movie ever nominated for Best Picture.",
  },
  {
    id: "m-h-2",
    word: "THE SHINING",
    clue: "An isolated winter caretaker spirals into terrifying madness at the snowbound Overlook Hotel.",
    category: "MOVIES",
    subgenre: "Horror",
    difficulty: "Medium",
    funFact: "The infamous 'Here's Johnny!' scene took three days and 60 destroyed doors to film.",
  },
  {
    id: "m-h-3",
    word: "HALLOWEEN",
    clue: "A masked psychopath named Michael Myers escapes an asylum to stalk babysitters in Haddonfield.",
    category: "MOVIES",
    subgenre: "Horror",
    difficulty: "Easy",
    funFact: "Michael Myers's famous mask was actually an inverted Captain Kirk mask bought for under two dollars.",
  },
  {
    id: "m-h-4",
    word: "A QUIET PLACE",
    clue: "A post-apocalyptic horror world where blind extraterrestrial predators hunt entirely by sound.",
    category: "MOVIES",
    subgenre: "Horror",
    difficulty: "Medium",
    funFact: "The film contains only roughly 25 spoken lines of dialogue throughout the whole movie.",
  },
  {
    id: "m-h-5",
    word: "POLTERGEIST",
    clue: "A suburban family's home is invaded by spirits communicating through their glowing TV screen.",
    category: "MOVIES",
    subgenre: "Horror",
    difficulty: "Hard",
    funFact: "Famous for the iconic line: 'They're heee-re!'",
  },
  {
    id: "m-h-6",
    word: "HEREDITARY",
    clue: "A grieving family unearths dark, occult secrets about their ancestry after their grandmother passes away.",
    category: "MOVIES",
    subgenre: "Horror",
    difficulty: "Hard",
    funFact: "Ari Aster's critically acclaimed modern horror masterpiece featuring King Paimon.",
  },
  {
    id: "m-h-7",
    word: "THE CONJURING",
    clue: "Paranormal investigators Ed and Lorraine Warren battle a malevolent witch entity at a Rhode Island farmhouse.",
    category: "MOVIES",
    subgenre: "Horror",
    difficulty: "Medium",
    funFact: "Based on the real-life files of the Warren demonologists.",
  },

  // --- MOVIES: SCI-FI ---
  {
    id: "m-sf-1",
    word: "INTERSTELLAR",
    clue: "A team of astronauts travel through a mysterious wormhole near Saturn searching for a new habitable world.",
    category: "MOVIES",
    subgenre: "Sci-Fi",
    difficulty: "Medium",
    funFact: "Physicist Kip Thorne calculated the gravitational lensing of the Gargantua black hole for this film.",
  },
  {
    id: "m-sf-2",
    word: "THE MATRIX",
    clue: "A computer hacker discovers our reality is an artificial simulation controlled by sinister machine overlords.",
    category: "MOVIES",
    subgenre: "Sci-Fi",
    difficulty: "Easy",
    funFact: "Pioneered 'bullet time' visual effects using circular camera arrays.",
  },
  {
    id: "m-sf-3",
    word: "BLADE RUNNER",
    clue: "In a rain-soaked neon dystopian Los Angeles, a detective hunts rogue synthetic bio-engineered replicants.",
    category: "MOVIES",
    subgenre: "Sci-Fi",
    difficulty: "Medium",
    funFact: "Based on Philip K. Dick's novel 'Do Androids Dream of Electric Sheep?'.",
  },
  {
    id: "m-sf-4",
    word: "INCEPTION",
    clue: "A skilled espionage thief steals corporate secrets by infiltrating the subconscious minds of sleeping targets.",
    category: "MOVIES",
    subgenre: "Sci-Fi",
    difficulty: "Medium",
    funFact: "The spinning totem top leaves the audience questioning whether the ending is reality or a dream.",
  },
  {
    id: "m-sf-5",
    word: "JURASSIC PARK",
    clue: "Genetically resurrected prehistoric dinosaurs break loose on a secluded island theme park during a tropical storm.",
    category: "MOVIES",
    subgenre: "Sci-Fi",
    difficulty: "Easy",
    funFact: "Steven Spielberg's ground-breaking CGI and animatronic blockbuster.",
  },
  {
    id: "m-sf-6",
    word: "TERMINATOR",
    clue: "A relentless cyborg assassin is sent backward through time from the apocalyptic future to eliminate Sarah Connor.",
    category: "MOVIES",
    subgenre: "Sci-Fi",
    difficulty: "Easy",
    funFact: "Arnold Schwarzenegger only speaks 58 words in the entire original film.",
  },

  // --- BOOKS: CLASSICAL ---
  {
    id: "b-c-1",
    word: "MOBY DICK",
    clue: "Captain Ahab embarks on a monomaniacal, vengeful pursuit across the oceans against a legendary great white whale.",
    category: "BOOKS",
    subgenre: "Classical",
    difficulty: "Medium",
    funFact: "Begins with the immortal opening line: 'Call me Ishmael.'",
  },
  {
    id: "b-c-2",
    word: "THE ODYSSEY",
    clue: "Homer's ancient Greek epic following Odysseus on his perilous ten-year voyage home to Ithaca after the Trojan War.",
    category: "BOOKS",
    subgenre: "Classical",
    difficulty: "Medium",
    funFact: "Composed near the end of the 8th century BC and one of the oldest extant works of Western literature.",
  },
  {
    id: "b-c-3",
    word: "THE GREAT GATSBY",
    clue: "F. Scott Fitzgerald's Roaring Twenties portrait of lavish Long Island parties, tragic obsession, and a green dock light.",
    category: "BOOKS",
    subgenre: "Classical",
    difficulty: "Medium",
    funFact: "Originally a commercial disappointment during Fitzgerald's lifetime before becoming an American classic.",
  },
  {
    id: "b-c-4",
    word: "HAMLET",
    clue: "Shakespeare's prince of Denmark is haunted by his murdered father's ghost and contemplates vengeance and madness.",
    category: "BOOKS",
    subgenre: "Classical",
    difficulty: "Easy",
    funFact: "Contains the immortal soliloquy: 'To be, or not to be: that is the question.'",
  },
  {
    id: "b-c-5",
    word: "WAR AND PEACE",
    clue: "Leo Tolstoy's sweeping Russian literary epic intertwining the lives of aristocratic families during Napoleon's invasion.",
    category: "BOOKS",
    subgenre: "Classical",
    difficulty: "Hard",
    funFact: "Spans over 1,200 pages and contains hundreds of distinct characters.",
  },
  {
    id: "b-c-6",
    word: "PRIDE AND PREJUDICE",
    clue: "Jane Austen's witty novel following the turbulent relationship between Elizabeth Bennet and the wealthy Mr. Darcy.",
    category: "BOOKS",
    subgenre: "Classical",
    difficulty: "Medium",
    funFact: "The novel was originally titled 'First Impressions' when drafted in 1796.",
  },

  // --- BOOKS: HORROR ---
  {
    id: "b-h-1",
    word: "DRACULA",
    clue: "Bram Stoker's gothic epistolary masterpiece about an ancient vampire count moving from Transylvania to London.",
    category: "BOOKS",
    subgenre: "Horror",
    difficulty: "Easy",
    funFact: "Published in 1897, establishing almost all modern vampire folklore conventions.",
  },
  {
    id: "b-h-2",
    word: "FRANKENSTEIN",
    clue: "Mary Shelley's tale of an ambitious young scientist who stitches together human corpses and sparks life with electricity.",
    category: "BOOKS",
    subgenre: "Horror",
    difficulty: "Easy",
    funFact: "Written when Mary Shelley was only 18 years old during a ghost story contest at Lake Geneva.",
  },
  {
    id: "b-h-3",
    word: "PET SEMATARY",
    clue: "Stephen King's chilling novel where a grieving father buries loved ones in a sinister Micmac sour burial ground.",
    category: "BOOKS",
    subgenre: "Horror",
    difficulty: "Medium",
    funFact: "King himself considered this the most terrifying novel he ever wrote, shelving it for years.",
  },
  {
    id: "b-h-4",
    word: "CARRIE",
    clue: "A severely bullied telekinetic teenager is pushed to her limits at high school prom with catastrophic consequences.",
    category: "BOOKS",
    subgenre: "Horror",
    difficulty: "Easy",
    funFact: "King threw the first three pages into the garbage, but his wife Tabitha rescued them from the trash.",
  },
  {
    id: "b-h-5",
    word: "THE HAUNTING OF HILL HOUSE",
    clue: "Shirley Jackson's psychological horror novel about four seekers staying in a deeply supernatural Victorian mansion.",
    category: "BOOKS",
    subgenre: "Horror",
    difficulty: "Hard",
    funFact: "Widely regarded by critics as one of the best literary ghost stories ever published.",
  },
  {
    id: "b-h-6",
    word: "CORALINE",
    clue: "Neil Gaiman's eerie dark fantasy about a bored girl who unlocks a bricked doorway leading to an Other Mother with button eyes.",
    category: "BOOKS",
    subgenre: "Horror",
    difficulty: "Medium",
    funFact: "Adapted into a celebrated stop-motion animated film by Henry Selick.",
  },

  // --- CHARACTERS: FICTIONAL ---
  {
    id: "c-f-1",
    word: "SHERLOCK HOLMES",
    clue: "The razor-sharp consulting detective who cracks impossible Victorian mysteries from 221B Baker Street.",
    category: "CHARACTERS",
    subgenre: "Fictional",
    difficulty: "Medium",
    funFact: "The most portrayed literary human character in film and television history.",
  },
  {
    id: "c-f-2",
    word: "LORD VOLDEMORT",
    clue: "The dark wizard who fractured his soul into Horcruxes and whose dreaded name magical folk fear to speak aloud.",
    category: "CHARACTERS",
    subgenre: "Fictional",
    difficulty: "Easy",
    funFact: "An anagram for 'Tom Marvolo Riddle'.",
  },
  {
    id: "c-f-3",
    word: "DARTH VADER",
    clue: "The fearsome black-armored Sith Lord with mechanical respiration who wields a crimson lightsaber.",
    category: "CHARACTERS",
    subgenre: "Fictional",
    difficulty: "Easy",
    funFact: "Voiced with legendary resonance by James Earl Jones.",
  },
  {
    id: "c-f-4",
    word: "CAPTAIN JACK SPARROW",
    clue: "The wily, eccentric pirate captain of the Black Pearl known for rum, dreadlocks, and escaping impossible odds.",
    category: "CHARACTERS",
    subgenre: "Fictional",
    difficulty: "Medium",
    funFact: "Johnny Depp based his flamboyant mannerisms partly on Rolling Stones guitarist Keith Richards.",
  },
  {
    id: "c-f-5",
    word: "SEVERUS SNAPE",
    clue: "The brooding potions master of Hogwarts whose true heroic loyalty to Lily was revealed through the word 'Always'.",
    category: "CHARACTERS",
    subgenre: "Fictional",
    difficulty: "Medium",
    funFact: "J.K. Rowling shared Snape's full secret backstory only with actor Alan Rickman before it was published.",
  },
  {
    id: "c-f-6",
    word: "GANDALF THE GREY",
    clue: "The wise wandering wizard who declared 'You shall not pass!' against the terrifying subterranean Balrog.",
    category: "CHARACTERS",
    subgenre: "Fictional",
    difficulty: "Medium",
    funFact: "An ancient Maia spirit named Olorin sent to Middle-earth to inspire resistance against Sauron.",
  },
  {
    id: "c-f-7",
    word: "HANNIBAL LECTER",
    clue: "The brilliant yet chilling cannibalistic forensic psychiatrist imprisoned in a maximum-security glass cell.",
    category: "CHARACTERS",
    subgenre: "Fictional",
    difficulty: "Hard",
    funFact: "Anthony Hopkins won an Oscar for only 16 minutes of screen time in The Silence of the Lambs.",
  },
  {
    id: "c-f-8",
    word: "WOLVERINE",
    clue: "A gruff Marvel mutant with retractable adamantium claws, heightened animal senses, and an accelerated healing factor.",
    category: "CHARACTERS",
    subgenre: "Fictional",
    difficulty: "Easy",
    funFact: "Also known by his human moniker James Howlett or Logan.",
  },
];

export const CATEGORY_CONFIG: Record<
  Category,
  {
    label: string;
    icon: string;
    color: string;
    glowColor: string;
    subgenres: Subgenre[];
    description: string;
  }
> = {
  BOOKS: {
    label: "Books",
    icon: "📖",
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.8)",
    subgenres: ["Classical", "Horror"],
    description: "Ancient grimoires of gothic horror and immortal classical epics.",
  },
  CHARACTERS: {
    label: "Characters",
    icon: "🎭",
    color: "#22c55e",
    glowColor: "rgba(34, 197, 94, 0.8)",
    subgenres: ["Fictional"],
    description: "Legendary villains, mysterious sleuths, and mythic heroes.",
  },
  MOVIES: {
    label: "Movies",
    icon: "🎬",
    color: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.8)",
    subgenres: ["Horror", "Sci-Fi"],
    description: "Cinematic nightmares and mind-bending science fiction sagas.",
  },
};

export function getRandomWordForCategory(
  category: Category,
  subgenre?: Subgenre,
  excludedIds: string[] = []
): WordItem {
  let pool = WORD_DATABASE.filter((item) => item.category === category);
  if (subgenre) {
    pool = pool.filter((item) => item.subgenre === subgenre);
  }

  const unplayedPool = pool.filter((item) => !excludedIds.includes(item.id));
  const finalPool = unplayedPool.length > 0 ? unplayedPool : pool;

  const randomIndex = Math.floor(Math.random() * finalPool.length);
  return finalPool[randomIndex];
}
