/* ============================================================
 * Login gate — Google Sign-In, access managed in Google Cloud.
 *
 * WHO CAN GET IN is controlled in the Google Cloud Console, NOT here:
 *   APIs & Services → OAuth consent screen → Test users
 * Only those Google accounts can complete sign-in while the app is in
 * "Testing" mode. Google enforces this server-side, so the friends'
 * emails never appear in this (public) source code.
 *
 * To add/remove a friend: edit the Test users list in GCP. No code
 * change, no redeploy needed.
 *
 * NOTE: Client IDs are not secrets — it is safe for this to be public.
 * For genuinely hardened/private access, front the site with
 * Cloudflare Access or a backend.
 * ============================================================ */

(function () {
  "use strict";

  // ============================================================
  // CONFIG — just the public OAuth Client ID. The allowlist lives
  // in GCP → OAuth consent screen → Test users (see header above).
  // ============================================================
  const AUTH_CONFIG = {
    CLIENT_ID: "193554635172-0k01k1tkem9atv96599gqjnv6tgu2eea.apps.googleusercontent.com",
  };
  // ============================================================

  const STORAGE_KEY = "pq_user";
  const isConfigured = !/^REPLACE_/.test(AUTH_CONFIG.CLIENT_ID);

  function unlock() {
    document.body.classList.add("unlocked");
  }

  function showMsg(text) {
    const m = document.getElementById("gateMsg");
    if (m) m.textContent = text || "";
  }

  // Decode a JWT payload (no signature verification — see NOTE above).
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

  function handleCredential(response) {
    const data = decodeJwt(response.credential);
    if (!data) {
      showMsg("登入失敗，請再試一次。");
      return;
    }
    // Access is enforced by Google (Test users list). Any verified
    // account that Google lets through here is allowed in.
    const email = (data.email || "").toLowerCase();
    if (data.email_verified) {
      localStorage.setItem(STORAGE_KEY, email);
      showMsg("");
      unlock();
    } else {
      showMsg("此 Google 帳戶未經驗證 🙅");
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

  function start() {
    const so = document.getElementById("signoutBtn");
    if (so) so.addEventListener("click", signOut);

    // Fail open until OAuth is configured, so the site stays usable.
    if (!isConfigured) {
      console.warn(
        "[gate] Google OAuth not configured — site is OPEN. " +
          "Set AUTH_CONFIG.CLIENT_ID in js/gate.js to lock it."
      );
      showDevBadge();
      unlock();
      return;
    }

    // Returning user (signed in before on this device) → straight in.
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      unlock();
      return;
    }

    initGoogle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
