# Phonics 拼音特訓 — Year 1 Read Write Inc.

A tiny, no-build web app to help a Year 1 child practise the **UK Phonics
Screening Check** (Read Write Inc. style). Shows real words (真字) and alien /
pseudo-words (怪獸字), and lets the child **record their own voice**, **play it
back**, and **hear the correct pronunciation** — then move **prev / next**.

Inspired by the viral "yellowfamily" Threads post (the dad who loaded 10 years
of past papers for his daughter). The screenshot showed `queep`; the real 2012
word is **`quemp`** — this app uses the official words.

## Features

- 🟥 **開始錄音** — record the child reading the word (MediaRecorder API)
- 🟧 **聽自己讀音** — play the recording back
- 🟦 **聽正確讀音** — text-to-speech in `en-GB` (Web Speech API)
- 🟪 **聽拆音 (Fred Talk)** — say each sound, highlight it, then blend the word
- ⬅️ ➡️ **上一個 / 下一個** — navigate (also Left/Right arrow keys; Space = speak)
- 🔀 **洗牌** — reshuffle the deck (random order, like the original)

## Tech (all browser-native, no dependencies)

| Need | What it uses |
|------|--------------|
| Logic | Plain vanilla **JavaScript** (no framework, no build step) |
| Record / playback | **MediaRecorder API** + `getUserMedia` (needs HTTPS — GitHub Pages is HTTPS) |
| Correct pronunciation | **Web Speech API** `speechSynthesis` |
| Word display font | **Andika** (literacy font with single-storey `a`/`g`) via Google Fonts |

> The data in `js/words.js` is structured with a `graphemes` breakdown so that
> per-sound **audio clips** can replace TTS later without changing the app.

## Access control (Google sign-in)

The site is gated by **Google Sign-In + an email allowlist** so it can be shared
with a few friends. Config lives at the top of [`js/gate.js`](js/gate.js):

```js
const AUTH_CONFIG = {
  CLIENT_ID: "REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  ALLOWED_EMAILS: ["kinkwai6@gmail.com", /* add friends... */],
};
```

**Until `CLIENT_ID` is set, the gate "fails open"** (site stays usable, shows a
🔓 badge). Once a real Client ID is in place, only allow-listed Google accounts
get in.

### One-time Google setup
1. <https://console.cloud.google.com/> → create a project.
2. **APIs & Services → OAuth consent screen** → *External* → add your email →
   under **Test users** add every email that should have access.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID →
   Web application**.
4. **Authorised JavaScript origins** → add `https://charleskk6.github.io`
   (and `http://localhost:8000` for local testing). Origin only, no path.
5. Copy the **Client ID** into `AUTH_CONFIG.CLIENT_ID`, list the emails in
   `ALLOWED_EMAILS`, commit, and redeploy.

> ⚠️ This is a static site in a public repo, so this gate is **obfuscation, not
> hardened security** — the allowlist check runs in the browser and the source
> is public. For genuinely enforced access, put it behind **Cloudflare Access**
> or a backend.

## Run locally

It's static — any static server works (the mic needs `https://` or
`localhost`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Word bank

`js/words.js` currently contains the **fully verified 2012 check (40 words)**.
The app randomises across **every** entry, so adding more years is just pasting
more objects — see the comments at the top of that file.

Official, free sources for other years' answer sheets:

- https://www.primarytools.co.uk/phonics-check-year-1-and-year-2/
- https://www.sats-papers.co.uk/phonics-screening-tests/
- https://www.gov.uk/government/publications/phonics-screening-check-sample-materials-and-training-video

## Deploy to GitHub Pages (from `main`)

1. Merge this branch into **`main`**.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds & deploys on every push
   to `main`. The live URL appears in the workflow run and in Settings → Pages.

That's it — no build tools, the repo root *is* the site.
