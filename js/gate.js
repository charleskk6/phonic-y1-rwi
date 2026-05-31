/* ============================================================
 * Login gate — Firebase Auth (Google) + Firestore allowlist.
 *
 * WHO CAN GET IN is a list in Firestore, NOT in this repo:
 *   collection "allowlist", one document per allowed email
 *   (document ID = the lowercase email; the doc can be empty).
 *
 * Firestore SECURITY RULES enforce the check server-side, so editing
 * this JS in a browser cannot grant access (see firestore.rules):
 *   a signed-in user may only read allowlist/{their-own-email}.
 *   Doc exists  -> allowed.   Doc missing -> denied.
 *
 * Manage friends in the Firebase console (Firestore → allowlist):
 *   add a document  = invite      delete a document = revoke
 * No code change, no redeploy.
 *
 * The firebaseConfig values below are PUBLIC by design (safe to ship);
 * real protection comes from the security rules + Authorized domains.
 *
 * ---- SETUP (one time) ----------------------------------------------
 *  1. console.firebase.google.com → Add project (free Spark plan).
 *  2. Build → Authentication → Sign-in method → enable Google.
 *  3. Authentication → Settings → Authorized domains → add
 *       charleskk6.github.io   (localhost is allowed by default).
 *  4. Build → Firestore Database → Create (production mode).
 *  5. Firestore → Rules → paste firestore.rules from this repo →
 *       Publish.
 *  6. Firestore → Data → Start collection "allowlist" → add a
 *       document whose ID is your own Google email (lowercase),
 *       leaving fields empty. Repeat for each friend.
 *  7. Project settings → Your apps → Web app → copy the config and
 *       paste it into FIREBASE_CONFIG below. Commit & redeploy.
 * --------------------------------------------------------------------
 * ============================================================ */

(function () {
  "use strict";

  // Paste your Firebase web config here (Project settings → Your apps).
  const FIREBASE_CONFIG = {
    apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
    authDomain: "REPLACE.firebaseapp.com",
    projectId: "REPLACE",
    appId: "REPLACE",
  };

  const isConfigured = !/^REPLACE/.test(FIREBASE_CONFIG.apiKey);

  function unlock() { document.body.classList.add("unlocked"); }
  function showMsg(t) {
    const m = document.getElementById("gateMsg");
    if (m) m.textContent = t || "";
  }
  function showDevBadge() {
    const b = document.createElement("div");
    b.className = "devbadge";
    b.textContent = "🔓 登入未啟用 (待設定 Firebase)";
    document.body.appendChild(b);
  }

  // Check Firestore allowlist for this email. Returns true if allowed.
  // The security rules only let a user read their own doc, so a denied
  // user gets a permission error here — which we treat as "not allowed".
  async function isAllowed(db, email) {
    try {
      const snap = await db.collection("allowlist").doc(email).get();
      return snap.exists;
    } catch (e) {
      return false; // permission-denied or offline → deny
    }
  }

  function start() {
    const signinBtn = document.getElementById("signinBtn");
    const signoutBtn = document.getElementById("signoutBtn");

    // Fail open until Firebase is configured, so the site stays usable.
    if (!isConfigured || !window.firebase) {
      if (!window.firebase) console.warn("[gate] Firebase SDK not loaded.");
      else console.warn("[gate] Firebase not configured — site is OPEN.");
      showDevBadge();
      if (signinBtn) signinBtn.style.display = "none";
      unlock();
      return;
    }

    firebase.initializeApp(FIREBASE_CONFIG);
    const auth = firebase.auth();
    const db = firebase.firestore();
    const provider = new firebase.auth.GoogleAuthProvider();

    if (signinBtn) {
      signinBtn.addEventListener("click", () => {
        showMsg("");
        auth.signInWithPopup(provider).catch((err) => {
          showMsg("登入失敗，請再試一次。");
          console.error(err);
        });
      });
    }
    if (signoutBtn) {
      signoutBtn.addEventListener("click", () => auth.signOut());
    }

    // Single source of truth: re-checks the allowlist on every load and
    // whenever auth state changes, so revoking in Firestore takes effect.
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        document.body.classList.remove("unlocked");
        return;
      }
      const email = (user.email || "").toLowerCase();
      if (user.emailVerified && (await isAllowed(db, email))) {
        showMsg("");
        unlock();
      } else {
        showMsg(`抱歉，${email} 未獲授權 🙅`);
        await auth.signOut();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
