/* ============================================================
 * Login gate — Google Sign-In + a HASHED email allowlist.
 *
 * IMPORTANT: Google's "Test users" list does NOT restrict plain
 * Sign-In with Google (it only gates the OAuth consent/scopes step).
 * So any Google account can complete sign-in — we must check here.
 *
 * To keep friends' emails OUT of this public source, we store only the
 * SHA-256 hash of each allowed email (normalised: trimmed + lowercase).
 *
 * NOTE: This is a static, public site, so this remains OBFUSCATION, not
 * hardened security — someone who edits the JS could bypass it. For
 * truly enforced access, put the site behind Cloudflare Access.
 *
 * ---- HOW TO ADD A FRIEND --------------------------------------------
 * 1. Open the deployed site, open the browser console, and run:
 *        await pqHash("friend@gmail.com")
 *    (Gmail ignores dots/“+suffix”, so use their exact login email.)
 * 2. Copy the printed hash into ALLOWED_HASHES below.
 * 3. Commit & redeploy. The friend's email never appears in the repo.
 * ---------------------------------------------------------------------
 * ============================================================ */

(function () {
  "use strict";

  const AUTH_CONFIG = {
    // Public OAuth Client ID (not a secret).
    CLIENT_ID: "193554635172-0k01k1tkem9atv96599gqjnv6tgu2eea.apps.googleusercontent.com",

    // SHA-256 hashes of allowed emails (lowercase, trimmed). No plaintext.
    ALLOWED_HASHES: [
      "26bf7f0fdd5ec0ec29fd513a58c49caf7d3529d0df5b80416ed4123f5bfc8e18", // owner
      // add friends' hashes here (generate with pqHash() in the console)
    ],
  };

  const STORAGE_KEY = "pq_user";
  const isConfigured = !/^REPLACE_/.test(AUTH_CONFIG.CLIENT_ID);

  // SHA-256 → hex of a normalised email. Needs HTTPS (GitHub Pages is).
  async function hashEmail(email) {
    const norm = (email || "").trim().toLowerCase();
    const bytes = new TextEncoder().encode(norm);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function isAllowed(email) {
    const h = await hashEmail(email);
    return AUTH_CONFIG.ALLOWED_HASHES.includes(h);
  }

  // Console helper to mint hashes for new friends: await pqHash("a@b.com")
  window.pqHash = async function (email) {
    const h = await hashEmail(email);
    console.log(`${(email || "").trim().toLowerCase()} →\n${h}`);
    return h;
  };

  function unlock() {
    document.body.classList.add("unlocked");
  }

  function showMsg(text) {
    const m = document.getElementById("gateMsg");
    if (m) m.textContent = text || "";
  }

  function decodeJwt(token) {
    try {
      const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(part)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  async function handleCredential(response) {
    const data = decodeJwt(response.credential);
    if (!data) {
      showMsg("登入失敗，請再試一次。");
      return;
    }
    const email = (data.email || "").toLowerCase();
    if (data.email_verified && (await isAllowed(email))) {
      localStorage.setItem(STORAGE_KEY, email);
      showMsg("");
      unlock();
    } else {
      showMsg(`抱歉，${email} 未獲授權 🙅`);
      try { google.accounts.id.disableAutoSelect(); } catch (e) {}
    }
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    try { google.accounts.id.disableAutoSelect(); } catch (e) {}
    location.reload();
  }

  function initGoogle() {
    if (!(window.google && google.accounts && google.accounts.id)) {
      return setTimeout(initGoogle, 150); // wait for the GIS script
    }
    google.accounts.id.initialize({
      client_id: AUTH_CONFIG.CLIENT_ID,
      callback: handleCredential,
      auto_select: true,
    });
    const btn = document.getElementById("gsiButton");
    if (btn) {
      google.accounts.id.renderButton(btn, {
        theme: "filled_blue",
        size: "large",
        shape: "pill",
        text: "signin_with",
        width: 260,
      });
    }
    google.accounts.id.prompt(); // Google One Tap
  }

  function showDevBadge() {
    const b = document.createElement("div");
    b.className = "devbadge";
    b.textContent = "🔓 登入未啟用 (待設定 Google OAuth)";
    document.body.appendChild(b);
  }

  async function start() {
    const so = document.getElementById("signoutBtn");
    if (so) so.addEventListener("click", signOut);

    // Fail open only if no Client ID is set, so the site stays usable.
    if (!isConfigured) {
      console.warn("[gate] OAuth not configured — site is OPEN.");
      showDevBadge();
      unlock();
      return;
    }

    // Returning, still-allowed user → straight in.
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (await isAllowed(saved))) {
      unlock();
      return;
    }
    localStorage.removeItem(STORAGE_KEY); // revoked since last visit

    initGoogle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
