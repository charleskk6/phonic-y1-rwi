/* ============================================================
 * Login gate — Google Sign-In with an email allowlist.
 *
 * NOTE: This is a static site, so this gate is OBFUSCATION, not
 * hardened security. It restricts the friendly path for casual
 * sharing. Anything truly private needs a backend / Cloudflare Access.
 * ============================================================ */

(function () {
  "use strict";

  // ============================================================
  // CONFIG — edit these two values, then redeploy.
  // ============================================================
  const AUTH_CONFIG = {
    // Google Cloud Console → APIs & Services → Credentials →
    // "OAuth client ID" (Web application). Paste the Client ID here.
    CLIENT_ID: "REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",

    // Only these Google accounts may enter (lowercase). Add friends here.
    ALLOWED_EMAILS: [
      "kinkwai6@gmail.com",
      // "friend1@gmail.com",
      // "friend2@gmail.com",
    ],
  };
  // ============================================================

  const STORAGE_KEY = "pq_user";
  const isConfigured = !/^REPLACE_/.test(AUTH_CONFIG.CLIENT_ID);

  function allowed(email) {
    const e = (email || "").toLowerCase();
    return AUTH_CONFIG.ALLOWED_EMAILS.some((x) => x.toLowerCase() === e);
  }

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
    const email = (data.email || "").toLowerCase();
    if (data.email_verified && allowed(email)) {
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

    // Returning, still-allowed user → straight in.
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && allowed(saved)) {
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
