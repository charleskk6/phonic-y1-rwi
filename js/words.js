/*
 * Phonics Screening practice word bank — RWI Speed Sounds segmentation.
 *
 * Source: Twinkl "Phonics Screening Practice List" sheets
 *   (Real Words + Nonsense Alien Words), transcribed from the printed sheets.
 *
 * Each entry:
 *   word      - the word as shown to the child (exact spelling)
 *   type      - "real" (真字) or "alien" (怪獸字 / nonsense word)
 *   set       - which practice sheet it came from
 *   graphemes - the word split into RWI Speed Sounds for the
 *               "拆音 / Fred Talk" feature.
 *
 * GRAPHEME RULES (Read Write Inc.):
 *   • Set 1 digraphs are ONE sound: sh ch th ng nk qu  (and ck=/k/, x=/ks/,
 *     double letters ll ss zz = one sound).
 *   • Set 2/3 vowel graphemes are ONE sound: ay ee igh ow oo ar or air ir
 *     ou oy ea oi aw au ai oa ew ue ie ey er ur ure …
 *   • SPLIT DIGRAPHS (a-e, e-e, i-e, o-e, u-e) are written with a tilde:
 *     the vowel as "a~" and the silent magic-e as "~e". They make ONE sound
 *     together but are shown in their real positions, e.g. skate =
 *     ["s","k","a~","t","~e"]  →  displays "skate", sounds out s-k-(a-e)-t.
 *
 * Stripping the "~" and joining the graphemes always reproduces the exact
 * spelling, so the card never mis-renders a word.
 */

const WORD_BANK = [
  // ============ 練習 1 — Real Words ============
  { word: "zoo",       type: "real",  set: "練習 1", graphemes: ["z","oo"] },
  { word: "coin",      type: "real",  set: "練習 1", graphemes: ["c","oi","n"] },
  { word: "sight",     type: "real",  set: "練習 1", graphemes: ["s","igh","t"] },
  { word: "photo",     type: "real",  set: "練習 1", graphemes: ["ph","o","t","o"] },
  { word: "cloud",     type: "real",  set: "練習 1", graphemes: ["c","l","ou","d"] },
  { word: "skate",     type: "real",  set: "練習 1", graphemes: ["s","k","a~","t","~e"] },
  { word: "whip",      type: "real",  set: "練習 1", graphemes: ["wh","i","p"] },
  { word: "flute",     type: "real",  set: "練習 1", graphemes: ["f","l","u~","t","~e"] },
  { word: "oyster",    type: "real",  set: "練習 1", graphemes: ["oy","s","t","er"] },
  { word: "straw",     type: "real",  set: "練習 1", graphemes: ["s","t","r","aw"] },
  { word: "burger",    type: "real",  set: "練習 1", graphemes: ["b","ur","g","er"] },
  { word: "first",     type: "real",  set: "練習 1", graphemes: ["f","ir","s","t"] },
  { word: "text",      type: "real",  set: "練習 1", graphemes: ["t","e","x","t"] },
  { word: "graph",     type: "real",  set: "練習 1", graphemes: ["g","r","a","ph"] },
  { word: "handshake", type: "real",  set: "練習 1", graphemes: ["h","a","n","d","sh","a~","k","~e"] },
  { word: "script",    type: "real",  set: "練習 1", graphemes: ["s","c","r","i","p","t"] },
  { word: "shelf",     type: "real",  set: "練習 1", graphemes: ["sh","e","l","f"] },
  { word: "glass",     type: "real",  set: "練習 1", graphemes: ["g","l","a","ss"] },
  { word: "drawing",   type: "real",  set: "練習 1", graphemes: ["d","r","aw","i","ng"] },
  { word: "haircut",   type: "real",  set: "練習 1", graphemes: ["h","air","c","u","t"] },

  // ============ 練習 1 — Nonsense Alien Words ============
  { word: "woid",      type: "alien", set: "練習 1", graphemes: ["w","oi","d"] },
  { word: "shrop",     type: "alien", set: "練習 1", graphemes: ["sh","r","o","p"] },
  { word: "ump",       type: "alien", set: "練習 1", graphemes: ["u","m","p"] },
  { word: "quape",     type: "alien", set: "練習 1", graphemes: ["qu","a~","p","~e"] },
  { word: "proy",      type: "alien", set: "練習 1", graphemes: ["p","r","oy"] },
  { word: "smizz",     type: "alien", set: "練習 1", graphemes: ["s","m","i","zz"] },
  { word: "yaup",      type: "alien", set: "練習 1", graphemes: ["y","au","p"] },
  { word: "blinch",    type: "alien", set: "練習 1", graphemes: ["b","l","i","n","ch"] },
  { word: "thisk",     type: "alien", set: "練習 1", graphemes: ["th","i","s","k"] },
  { word: "snoul",     type: "alien", set: "練習 1", graphemes: ["s","n","ou","l"] },
  { word: "phode",     type: "alien", set: "練習 1", graphemes: ["ph","o~","d","~e"] },
  { word: "luft",      type: "alien", set: "練習 1", graphemes: ["l","u","f","t"] },
  { word: "scund",     type: "alien", set: "練習 1", graphemes: ["s","c","u","n","d"] },
  { word: "whunkey",   type: "alien", set: "練習 1", graphemes: ["wh","u","nk","ey"] },
  { word: "femb",      type: "alien", set: "練習 1", graphemes: ["f","e","m","b"] },
  { word: "prinker",   type: "alien", set: "練習 1", graphemes: ["p","r","i","nk","er"] },
  { word: "spirl",     type: "alien", set: "練習 1", graphemes: ["s","p","ir","l"] },
  { word: "thunk",     type: "alien", set: "練習 1", graphemes: ["th","u","nk"] },
  { word: "cobweeb",   type: "alien", set: "練習 1", graphemes: ["c","o","b","w","ee","b"] },
  { word: "grelt",     type: "alien", set: "練習 1", graphemes: ["g","r","e","l","t"] },

  // ============ 練習 2 — Real Words ============
  { word: "chain",     type: "real",  set: "練習 2", graphemes: ["ch","ai","n"] },
  { word: "mixer",     type: "real",  set: "練習 2", graphemes: ["m","i","x","er"] },
  { word: "drift",     type: "real",  set: "練習 2", graphemes: ["d","r","i","f","t"] },
  { word: "slide",     type: "real",  set: "練習 2", graphemes: ["s","l","i~","d","~e"] },
  { word: "pound",     type: "real",  set: "練習 2", graphemes: ["p","ou","n","d"] },
  { word: "light",     type: "real",  set: "練習 2", graphemes: ["l","igh","t"] },
  { word: "jazz",      type: "real",  set: "練習 2", graphemes: ["j","a","zz"] },
  { word: "newt",      type: "real",  set: "練習 2", graphemes: ["n","ew","t"] },
  { word: "brick",     type: "real",  set: "練習 2", graphemes: ["b","r","i","ck"] },
  { word: "clown",     type: "real",  set: "練習 2", graphemes: ["c","l","ow","n"] },
  { word: "crept",     type: "real",  set: "練習 2", graphemes: ["c","r","e","p","t"] },
  { word: "thump",     type: "real",  set: "練習 2", graphemes: ["th","u","m","p"] },
  { word: "fuel",      type: "real",  set: "練習 2", graphemes: ["f","ue","l"] },
  { word: "drank",     type: "real",  set: "練習 2", graphemes: ["d","r","a","nk"] },
  { word: "stroke",    type: "real",  set: "練習 2", graphemes: ["s","t","r","o~","k","~e"] },
  { word: "squawk",    type: "real",  set: "練習 2", graphemes: ["s","qu","aw","k"] },
  { word: "feeling",   type: "real",  set: "練習 2", graphemes: ["f","ee","l","i","ng"] },
  { word: "haystack",  type: "real",  set: "練習 2", graphemes: ["h","ay","s","t","a","ck"] },
  { word: "dolphin",   type: "real",  set: "練習 2", graphemes: ["d","o","l","ph","i","n"] },
  { word: "morning",   type: "real",  set: "練習 2", graphemes: ["m","or","n","i","ng"] },

  // ============ 練習 2 — Nonsense Alien Words ============
  { word: "yoop",      type: "alien", set: "練習 2", graphemes: ["y","oo","p"] },
  { word: "lazz",      type: "alien", set: "練習 2", graphemes: ["l","a","zz"] },
  { word: "olf",       type: "alien", set: "練習 2", graphemes: ["o","l","f"] },
  { word: "quipe",     type: "alien", set: "練習 2", graphemes: ["qu","i~","p","~e"] },
  { word: "smeck",     type: "alien", set: "練習 2", graphemes: ["s","m","e","ck"] },
  { word: "chirt",     type: "alien", set: "練習 2", graphemes: ["ch","ir","t"] },
  { word: "jimp",      type: "alien", set: "練習 2", graphemes: ["j","i","m","p"] },
  { word: "scroy",     type: "alien", set: "練習 2", graphemes: ["s","c","r","oy"] },
  { word: "blies",     type: "alien", set: "練習 2", graphemes: ["b","l","ie","s"] },
  { word: "faum",      type: "alien", set: "練習 2", graphemes: ["f","au","m"] },
  { word: "blate",     type: "alien", set: "練習 2", graphemes: ["b","l","a~","t","~e"] },
  { word: "spreet",    type: "alien", set: "練習 2", graphemes: ["s","p","r","ee","t"] },
  { word: "dox",       type: "alien", set: "練習 2", graphemes: ["d","o","x"] },
  { word: "melp",      type: "alien", set: "練習 2", graphemes: ["m","e","l","p"] },
  { word: "glisp",     type: "alien", set: "練習 2", graphemes: ["g","l","i","s","p"] },
  { word: "shound",    type: "alien", set: "練習 2", graphemes: ["sh","ou","n","d"] },
  { word: "cripe",     type: "alien", set: "練習 2", graphemes: ["c","r","i~","p","~e"] },
  { word: "thoft",     type: "alien", set: "練習 2", graphemes: ["th","o","f","t"] },
  { word: "jigh",      type: "alien", set: "練習 2", graphemes: ["j","igh"] },
  { word: "frue",      type: "alien", set: "練習 2", graphemes: ["f","r","ue"] },

  // ============ 練習 3 — Real Words ============
  { word: "chill",     type: "real",  set: "練習 3", graphemes: ["ch","i","ll"] },
  { word: "blank",     type: "real",  set: "練習 3", graphemes: ["b","l","a","nk"] },
  { word: "start",     type: "real",  set: "練習 3", graphemes: ["s","t","ar","t"] },
  { word: "scribe",    type: "real",  set: "練習 3", graphemes: ["s","c","r","i~","b","~e"] },
  { word: "best",      type: "real",  set: "練習 3", graphemes: ["b","e","s","t"] },
  { word: "phone",     type: "real",  set: "練習 3", graphemes: ["ph","o~","n","~e"] },
  { word: "grit",      type: "real",  set: "練習 3", graphemes: ["g","r","i","t"] },
  { word: "whisk",     type: "real",  set: "練習 3", graphemes: ["wh","i","s","k"] },
  { word: "shin",      type: "real",  set: "練習 3", graphemes: ["sh","i","n"] },
  { word: "dentist",   type: "real",  set: "練習 3", graphemes: ["d","e","n","t","i","s","t"] },
  { word: "gang",      type: "real",  set: "練習 3", graphemes: ["g","a","ng"] },
  { word: "starling",  type: "real",  set: "練習 3", graphemes: ["s","t","ar","l","i","ng"] },
  { word: "week",      type: "real",  set: "練習 3", graphemes: ["w","ee","k"] },
  { word: "day",       type: "real",  set: "練習 3", graphemes: ["d","ay"] },
  { word: "hooks",     type: "real",  set: "練習 3", graphemes: ["h","oo","k","s"] },
  { word: "strap",     type: "real",  set: "練習 3", graphemes: ["s","t","r","a","p"] },
  { word: "trains",    type: "real",  set: "練習 3", graphemes: ["t","r","ai","n","s"] },
  { word: "finger",    type: "real",  set: "練習 3", graphemes: ["f","i","ng","er"] },

  // ============ 練習 3 — Nonsense Alien Words ============
  { word: "steck",     type: "alien", set: "練習 3", graphemes: ["s","t","e","ck"] },
  { word: "bim",       type: "alien", set: "練習 3", graphemes: ["b","i","m"] },
  { word: "hild",      type: "alien", set: "練習 3", graphemes: ["h","i","l","d"] },
  { word: "vap",       type: "alien", set: "練習 3", graphemes: ["v","a","p"] },
  { word: "quemp",     type: "alien", set: "練習 3", graphemes: ["qu","e","m","p"] },
  { word: "spron",     type: "alien", set: "練習 3", graphemes: ["s","p","r","o","n"] },
  { word: "geck",      type: "alien", set: "練習 3", graphemes: ["g","e","ck"] },
  { word: "blurst",    type: "alien", set: "練習 3", graphemes: ["b","l","ur","s","t"] },
  { word: "ulf",       type: "alien", set: "練習 3", graphemes: ["u","l","f"] },
  { word: "voo",       type: "alien", set: "練習 3", graphemes: ["v","oo"] },
  { word: "chom",      type: "alien", set: "練習 3", graphemes: ["ch","o","m"] },
  { word: "snemp",     type: "alien", set: "練習 3", graphemes: ["s","n","e","m","p"] },
  { word: "tord",      type: "alien", set: "練習 3", graphemes: ["t","or","d"] },
  { word: "fape",      type: "alien", set: "練習 3", graphemes: ["f","a~","p","~e"] },
  { word: "thazz",     type: "alien", set: "練習 3", graphemes: ["th","a","zz"] },
  { word: "jound",     type: "alien", set: "練習 3", graphemes: ["j","ou","n","d"] },
  { word: "blan",      type: "alien", set: "練習 3", graphemes: ["b","l","a","n"] },
  { word: "stroft",    type: "alien", set: "練習 3", graphemes: ["s","t","r","o","f","t"] },
  { word: "tox",       type: "alien", set: "練習 3", graphemes: ["t","o","x"] },
  { word: "terg",      type: "alien", set: "練習 3", graphemes: ["t","er","g"] },
];

// Expose to the app (works as a plain <script>, no modules needed).
window.WORD_BANK = WORD_BANK;
