/* ==========================================================================
   Sign up + Log in pages (both pages load this file; it wires whichever form is present)
   Depends on js/common.js (Auth helpers)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const form = signupForm || loginForm;
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const next = Auth.safeNext(params.get("next"));
  const notice = document.getElementById("authNotice");
  const submitBtn = document.getElementById("submitBtn");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Keep the "where were you going" target when switching between Log in and Sign up.
  document.querySelectorAll("[data-switch-link]").forEach((a) => {
    if (params.get("next")) a.href += "?next=" + encodeURIComponent(params.get("next"));
  });

  /* ---------- helpers ---------- */
  function showNotice(html, isError) {
    notice.innerHTML = html;
    notice.classList.toggle("is-error", Boolean(isError));
    notice.hidden = !html;
  }

  function setError(name, message) {
    const input = document.getElementById(name);
    const el = form.querySelector('[data-error-for="' + name + '"]');
    if (input && input.type !== "checkbox") input.classList.toggle("has-error", Boolean(message));
    if (el) el.textContent = message || "";
  }

  // Clear a field's error as soon as the person starts fixing it.
  form.addEventListener("input", (e) => {
    if (e.target.name || e.target.id) setError(e.target.id, "");
    showNotice("", false);
  });
  form.addEventListener("change", (e) => { if (e.target.id === "terms") setError("terms", ""); });

  // Show / hide password.
  form.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.togglePassword);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      btn.querySelector("img").src = "../../assets/icons/" + (show ? "eye-off.svg" : "eye.svg");
    });
  });

  function busy(isBusy, label) {
    submitBtn.disabled = isBusy;
    submitBtn.textContent = label;
  }

  /* ---------- first visit / returning visitor messaging ---------- */
  if (signupForm) {
    if (Auth.users().length === 0) {
      showNotice("Welcome! Create your account to start exploring and booking events.", false);
    }
  } else if (params.get("next")) {
    showNotice("Please log in to continue.", false);
  }

  /* ---------- sign up ---------- */
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirm = document.getElementById("confirm").value;
      const terms = document.getElementById("terms").checked;
      let ok = true;

      if (name.length < 2) { setError("name", "Please enter your full name."); ok = false; } else setError("name", "");
      if (!EMAIL_RE.test(email)) { setError("email", "Enter a valid email address."); ok = false; } else setError("email", "");
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        setError("password", "Use at least 8 characters, including a letter and a number."); ok = false;
      } else setError("password", "");
      if (confirm !== password) { setError("confirm", "The two passwords don't match."); ok = false; } else setError("confirm", "");
      if (!terms) { setError("terms", "Please accept the terms to continue."); ok = false; } else setError("terms", "");
      if (!ok) return;

      busy(true, "Creating account…");
      const result = await Auth.signup({ name, email, password });
      if (!result.ok) {
        busy(false, "Create account");
        if (result.code === "exists") {
          setError("email", "This email is already registered.");
          showNotice('You already have an account. <a href="login.html' + (params.get("next") ? "?next=" + encodeURIComponent(params.get("next")) : "") + '">Log in instead</a>.', true);
        } else {
          showNotice(result.error, true);
        }
        return;
      }
      window.location.replace(next);
    });
  }

  /* ---------- log in ---------- */
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      let ok = true;

      if (!EMAIL_RE.test(email)) { setError("email", "Enter a valid email address."); ok = false; } else setError("email", "");
      if (!password) { setError("password", "Enter your password."); ok = false; } else setError("password", "");
      if (!ok) return;

      busy(true, "Logging in…");
      const result = await Auth.login({ email, password });
      if (!result.ok) {
        busy(false, "Log in");
        if (result.code === "no-account") {
          setError("email", "No account found for this email.");
          showNotice('New here? <a href="signup.html' + (params.get("next") ? "?next=" + encodeURIComponent(params.get("next")) : "") + '">Create an account</a>.', true);
        } else {
          setError("password", result.error);
        }
        return;
      }
      window.location.replace(next);
    });
  }

  const firstEmpty = form.querySelector("input:not([type=checkbox])");
  if (firstEmpty) firstEmpty.focus();
});
