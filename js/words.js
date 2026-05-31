/*
 * Phonics Screening Check word bank.
 *
 * Each entry:
 *   word      - the word as shown to the child
 *   type      - "real" (真字) or "alien" (怪獸字 / pseudo-word)
 *   year      - the year of the official check
 *   graphemes - the word split into its sounds (graphemes), used by the
 *               "拆音 / Sound it out" feature. A split digraph is written
 *               with an underscore, e.g. "a_e" for the a–e in "fape".
 *
 * SOURCES (official, free to download):
 *   - https://www.primarytools.co.uk/phonics-check-year-1-and-year-2/
 *   - https://www.sats-papers.co.uk/phonics-screening-tests/
 *   - https://www.gov.uk/government/publications/phonics-screening-check-sample-materials-and-training-video
 *
 * TO ADD MORE YEARS:
 *   Open the official answer sheet for a year, then append objects below with
 *   the correct `year` and `type`. The app automatically picks up every entry.
 *   The 2012 set below is cross-verified against the official answer sheet.
 */

const WORD_BANK = [
  // ---------------- 2012 — Section 1 ----------------
  // Alien / pseudo-words (怪獸字)
  { word: "tox",      type: "alien", year: 2012, graphemes: ["t", "o", "x"] },
  { word: "bim",      type: "alien", year: 2012, graphemes: ["b", "i", "m"] },
  { word: "vap",      type: "alien", year: 2012, graphemes: ["v", "a", "p"] },
  { word: "ulf",      type: "alien", year: 2012, graphemes: ["u", "l", "f"] },
  { word: "geck",     type: "alien", year: 2012, graphemes: ["g", "e", "ck"] },
  { word: "chom",     type: "alien", year: 2012, graphemes: ["ch", "o", "m"] },
  { word: "tord",     type: "alien", year: 2012, graphemes: ["t", "or", "d"] },
  { word: "thazz",    type: "alien", year: 2012, graphemes: ["th", "a", "zz"] },
  { word: "blan",     type: "alien", year: 2012, graphemes: ["b", "l", "a", "n"] },
  { word: "steck",    type: "alien", year: 2012, graphemes: ["s", "t", "e", "ck"] },
  { word: "hild",     type: "alien", year: 2012, graphemes: ["h", "i", "l", "d"] },
  { word: "quemp",    type: "alien", year: 2012, graphemes: ["qu", "e", "m", "p"] },
  // Real words (真字)
  { word: "shin",     type: "real",  year: 2012, graphemes: ["sh", "i", "n"] },
  { word: "gang",     type: "real",  year: 2012, graphemes: ["g", "a", "ng"] },
  { word: "week",     type: "real",  year: 2012, graphemes: ["w", "ee", "k"] },
  { word: "chill",    type: "real",  year: 2012, graphemes: ["ch", "i", "ll"] },
  { word: "grit",     type: "real",  year: 2012, graphemes: ["g", "r", "i", "t"] },
  { word: "start",    type: "real",  year: 2012, graphemes: ["s", "t", "ar", "t"] },
  { word: "best",     type: "real",  year: 2012, graphemes: ["b", "e", "s", "t"] },
  { word: "hooks",    type: "real",  year: 2012, graphemes: ["h", "oo", "k", "s"] },

  // ---------------- 2012 — Section 2 ----------------
  // Alien / pseudo-words (怪獸字)
  { word: "voo",      type: "alien", year: 2012, graphemes: ["v", "oo"] },
  { word: "jound",    type: "alien", year: 2012, graphemes: ["j", "ou", "n", "d"] },
  { word: "terg",     type: "alien", year: 2012, graphemes: ["t", "er", "g"] },
  { word: "fape",     type: "alien", year: 2012, graphemes: ["f", "a_e", "p"] },
  { word: "snemp",    type: "alien", year: 2012, graphemes: ["s", "n", "e", "m", "p"] },
  { word: "blurst",   type: "alien", year: 2012, graphemes: ["b", "l", "ur", "s", "t"] },
  { word: "spron",    type: "alien", year: 2012, graphemes: ["s", "p", "r", "o", "n"] },
  { word: "stroft",   type: "alien", year: 2012, graphemes: ["s", "t", "r", "o", "f", "t"] },
  // Real words (真字)
  { word: "day",      type: "real",  year: 2012, graphemes: ["d", "ay"] },
  { word: "slide",    type: "real",  year: 2012, graphemes: ["s", "l", "i_e", "d"] },
  { word: "newt",     type: "real",  year: 2012, graphemes: ["n", "ew", "t"] },
  { word: "phone",    type: "real",  year: 2012, graphemes: ["ph", "o_e", "n"] },
  { word: "blank",    type: "real",  year: 2012, graphemes: ["b", "l", "a", "n", "k"] },
  { word: "trains",   type: "real",  year: 2012, graphemes: ["t", "r", "ai", "n", "s"] },
  { word: "strap",    type: "real",  year: 2012, graphemes: ["s", "t", "r", "a", "p"] },
  { word: "scribe",   type: "real",  year: 2012, graphemes: ["s", "c", "r", "i_e", "b"] },
  { word: "rusty",    type: "real",  year: 2012, graphemes: ["r", "u", "s", "t", "y"] },
  { word: "finger",   type: "real",  year: 2012, graphemes: ["f", "i", "ng", "er"] },
  { word: "dentist",  type: "real",  year: 2012, graphemes: ["d", "e", "n", "t", "i", "s", "t"] },
  { word: "starling", type: "real",  year: 2012, graphemes: ["s", "t", "ar", "l", "i", "ng"] },
];

// Expose to the app (works as a plain <script>, no modules needed).
window.WORD_BANK = WORD_BANK;
