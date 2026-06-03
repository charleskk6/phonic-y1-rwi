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
- 🟪 **聽拆音 (Fred Talk)** — say each sound, highlight it, then blend the word.
  Uses real audio clips if present in [`audio/sounds/`](audio/sounds/), otherwise
  falls back to browser TTS. See that folder's README to add clips.
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

## Access control (Firebase Auth + Firestore allowlist)

The site is gated by **Firebase Authentication (Google)**, and the list of who
may enter lives in **Firestore** — not in this repo. **Firestore security rules
([`firestore.rules`](firestore.rules)) enforce it server-side**, so editing the
JS in a browser cannot grant access: a signed-in user may only read the
allowlist document matching *their own* email. Doc exists → allowed.

Free on Firebase's **Spark** plan (no Cloud Functions used). Hosting stays on
GitHub Pages; only the Firebase SDK is added.

### Manage who has access (no code change, no redeploy)
Firebase console → **Firestore Database → `allowlist` collection**:
- **Add a document** whose ID is the friend's lowercase email (fields can be
  empty) = invite.
- **Delete that document** = revoke (takes effect on their next page load).

### One-time setup
1. <https://console.firebase.google.com/> → **Add project** (Spark/free).
2. **Authentication → Sign-in method →** enable **Google**.
3. **Authentication → Settings → Authorized domains →** add
   `charleskk6.github.io` (`localhost` is allowed by default).
4. **Firestore Database → Create** (production mode).
5. **Firestore → Rules →** paste [`firestore.rules`](firestore.rules) → Publish.
6. **Firestore → Data →** create collection `allowlist`, add a document per
   allowed email (ID = the email).
7. **Project settings → Your apps → Web app →** copy the config into
   `FIREBASE_CONFIG` at the top of [`js/gate.js`](js/gate.js). Commit & redeploy.

> The `firebaseConfig` values (apiKey etc.) are **public by design** — they're
> identifiers, not secrets. Protection comes from the security rules +
> authorized domains. Until `FIREBASE_CONFIG` is filled in, the gate "fails
> open" (site usable, shows a 🔓 badge).
>
> Note: the app's static files/word-bank are still served publicly by GitHub
> Pages; the *gate and data access* are what Firebase enforces.

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
