/* ============================================================
 * Phonics 拼音特訓 — app logic (vanilla JS)
 * ============================================================ */

(function () {
  "use strict";

  // ---------- DOM ----------
  const el = {
    progress:   document.getElementById("progress"),
    year:       document.getElementById("year"),
    emoji:      document.getElementById("emoji"),
    word:       document.getElementById("word"),
    category:   document.getElementById("category"),
    status:     document.getElementById("status"),
    recordBtn:  document.getElementById("recordBtn"),
    playOwnBtn: document.getElementById("playOwnBtn"),
    speakBtn:   document.getElementById("speakBtn"),
    segmentBtn: document.getElementById("segmentBtn"),
    prevBtn:    document.getElementById("prevBtn"),
    nextBtn:    document.getElementById("nextBtn"),
    shuffleBtn: document.getElementById("shuffleBtn"),
    progressFill: document.getElementById("progressFill"),
    card: document.getElementById("card"),
  };

  // ---------- State ----------
  let deck = [];          // shuffled copy of the word bank
  let index = 0;          // current position in the deck
  const recordings = {};  // word -> object URL of the child's recording

  // ---------- Deck helpers ----------
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildDeck() {
    deck = shuffle(window.WORD_BANK || []);
    index = 0;
  }

  function current() {
    return deck[index];
  }

  // ---------- Rendering ----------
  function render() {
    const item = current();
    if (!item) return;

    stopPlayback();

    el.progress.textContent = `題目 ${index + 1} / ${deck.length}`;
    el.year.textContent = `${item.set || ""}`;
    el.progressFill.style.width = `${((index + 1) / deck.length) * 100}%`;

    const isAlien = item.type === "alien";
    el.emoji.textContent = isAlien ? "👽" : "📖";
    el.category.textContent = isAlien ? "怪獸字 👽" : "真字 📖";
    el.card.dataset.type = item.type;

    // Replay the entrance animation on each new word.
    el.card.classList.remove("card--enter");
    void el.card.offsetWidth;
    el.card.classList.add("card--enter");

    // Render each grapheme as a span so 拆音 can highlight it.
    // A "~" marks a split digraph (magic-e); strip it for display.
    el.word.innerHTML = "";
    (item.graphemes || [item.word]).forEach((g) => {
      const span = document.createElement("span");
      span.className = "gp";
      span.textContent = g.replace("~", "");
      el.word.appendChild(span);
    });

    // Reset record/playback UI per card.
    const hasRecording = Boolean(recordings[item.word]);
    el.playOwnBtn.disabled = !hasRecording;
    setStatus(hasRecording ? "已有錄音 — 可重錄或回放" : "錄音特訓面版：準備就緒");
  }

  function setStatus(text, recording) {
    el.status.textContent = text;
    el.status.classList.toggle("is-recording", Boolean(recording));
  }

  // ---------- Navigation ----------
  function go(delta) {
    index = (index + delta + deck.length) % deck.length;
    render();
  }

  // ============================================================
  // 3) Correct pronunciation — Web Speech API (speechSynthesis)
  // ============================================================
  function speakWord() {
    const item = current();
    if (!item || !("speechSynthesis" in window)) {
      setStatus("此瀏覽器不支援語音合成 😢");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(item.word);
    u.lang = "en-GB";   // UK phonics
    u.rate = 0.8;
    pickEnglishVoice(u);
    window.speechSynthesis.speak(u);
  }

  // Build RWI "sounds" from the grapheme list. A split digraph is stored as
  // two graphemes ("a~" … "~e") but is ONE sound — merge them, keeping both
  // letter positions so 拆音 highlights the vowel and the magic-e together.
  function buildSounds(graphemes) {
    const sounds = [];
    graphemes.forEach((g, i) => {
      if (g.startsWith("~")) {
        // Silent magic-e: attach its position to the open split-digraph sound.
        const open = sounds.find((s) => s.split && s.eIndex == null);
        if (open) open.indices.push(i), (open.eIndex = i);
        else sounds.push({ speech: graphemeToSpeech(g), indices: [i] });
      } else if (g.endsWith("~")) {
        sounds.push({ speech: graphemeToSpeech(g), indices: [i], split: true });
      } else {
        sounds.push({ speech: graphemeToSpeech(g), indices: [i] });
      }
    });
    return sounds;
  }

  // 拆音 / Fred Talk — say each sound, highlight it, then blend the whole word.
  function segmentWord() {
    const item = current();
    if (!item || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const spans = el.word.querySelectorAll(".gp");
    const sounds = buildSounds(item.graphemes || [item.word]);

    sounds.forEach((s) => {
      const u = new SpeechSynthesisUtterance(s.speech);
      u.lang = "en-GB";
      u.rate = 0.7;
      pickEnglishVoice(u);
      u.onstart = () => highlight(spans, s.indices);
      window.speechSynthesis.speak(u);
    });

    // Blend: read the whole word at the end.
    const whole = new SpeechSynthesisUtterance(item.word);
    whole.lang = "en-GB";
    whole.rate = 0.85;
    pickEnglishVoice(whole);
    whole.onstart = () => highlight(spans, []);
    whole.onend = () => clearHighlight(spans);
    window.speechSynthesis.speak(whole);
  }

  function highlight(spans, indices) {
    spans.forEach((s, idx) => s.classList.toggle("active", indices.includes(idx)));
  }
  function clearHighlight(spans) {
    spans.forEach((s) => s.classList.remove("active"));
  }

  // Nudge TTS toward an RWI Speed Sound rather than a letter NAME.
  // Anything not listed falls back to "<letter>uh" so a stray consonant
  // is never read as its alphabet name (e.g. "t" → "tee").
  function graphemeToSpeech(g) {
    const map = {
      // Short vowels
      a: "ah", e: "eh", i: "ih", o: "o", u: "uh",
      // Single consonants — phonetic spellings TTS reads as the sound
      b: "buh", c: "kuh", d: "duh", f: "ff", g: "guh", h: "huh",
      j: "juh", k: "kuh", l: "ll", m: "mm", n: "nn", p: "puh",
      r: "ruh", s: "sss", t: "tuh", v: "vv", w: "wuh", y: "yuh", z: "zz",
      // Consonant digraphs / special graphemes
      ck: "kuh", ng: " nng", nk: "ngk", th: "th", sh: "shh", ch: "tch",
      qu: "kwuh", ph: "ff", wh: "wuh", x: "ks",
      ll: "ll", ss: "sss", zz: "zz",
      // Long vowels / vowel digraphs
      oo: "oo", ee: "ee", or: "or", er: "er", ar: "ar",
      ur: "ur", ir: "ur", ou: "ow", ow: "ow",
      ai: "ay", ay: "ay", ew: "you", ue: "you", oi: "oy", oy: "oy",
      au: "or", aw: "or", air: "air", igh: "eye", ie: "eye", ey: "ee",
      // Split digraphs (magic-e): the vowel says its long name; ~e is silent.
      "a~": "ay", "e~": "ee", "i~": "eye", "o~": "oh", "u~": "you",
      "~e": "",
    };
    if (g in map) return map[g];
    // Unknown single letter → make a clear consonant sound, not its name.
    return g.length === 1 ? g + "uh" : g;
  }

  let voicesCache = null;
  function pickEnglishVoice(utterance) {
    if (!voicesCache) voicesCache = window.speechSynthesis.getVoices();
    const v =
      voicesCache.find((x) => /en-GB/i.test(x.lang)) ||
      voicesCache.find((x) => /^en/i.test(x.lang));
    if (v) utterance.voice = v;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      voicesCache = window.speechSynthesis.getVoices();
    };
  }

  // ============================================================
  // 2) Record own voice + play own voice — MediaRecorder API
  // ============================================================
  let mediaRecorder = null;
  let chunks = [];
  let stream = null;
  let isRecording = false;
  let currentAudio = null;

  async function toggleRecord() {
    if (isRecording) {
      stopRecording();
      return;
    }
    await startRecording();
  }

  async function startRecording() {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setStatus("此瀏覽器不支援錄音 😢");
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      setStatus("無法取得麥克風權限 🎙️❌");
      return;
    }

    const word = current().word;
    chunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" });
      if (recordings[word]) URL.revokeObjectURL(recordings[word]);
      recordings[word] = URL.createObjectURL(blob);
      el.playOwnBtn.disabled = false;
      setStatus("錄音完成 ✅ — 可回放或重錄");
      releaseStream();
    };

    mediaRecorder.start();
    isRecording = true;
    el.recordBtn.textContent = "⏹️ 停止錄音";
    el.recordBtn.classList.add("is-recording");
    setStatus("錄音中… 請大聲讀出來 🎙️", true);
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    isRecording = false;
    el.recordBtn.textContent = "🎙️ 開始錄音";
    el.recordBtn.classList.remove("is-recording");
  }

  function releaseStream() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
  }

  function playOwn() {
    const url = recordings[current().word];
    if (!url) return;
    stopPlayback();
    currentAudio = new Audio(url);
    currentAudio.play();
    setStatus("正在回放錄音 ▶️");
    currentAudio.onended = () => setStatus("回放完成 — 同正確讀音比較吓 🤔");
  }

  function stopPlayback() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  // ---------- Wire up ----------
  el.recordBtn.addEventListener("click", toggleRecord);
  el.playOwnBtn.addEventListener("click", playOwn);
  el.speakBtn.addEventListener("click", speakWord);
  el.segmentBtn.addEventListener("click", segmentWord);
  el.prevBtn.addEventListener("click", () => { if (isRecording) stopRecording(); go(-1); });
  el.nextBtn.addEventListener("click", () => { if (isRecording) stopRecording(); go(1); });
  el.shuffleBtn.addEventListener("click", () => { if (isRecording) stopRecording(); buildDeck(); render(); });

  // Keyboard: ← prev, → next (matches the original app).
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === " ") { e.preventDefault(); speakWord(); }
  });

  // ---------- Init ----------
  buildDeck();
  render();
})();
