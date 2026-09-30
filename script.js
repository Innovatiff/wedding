/* =====================================================================
   Alam & Astrid — Wedding site interactions
   ===================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Wedding date ----------
     June 25 at 4:00 pm local time. The year rolls forward automatically
     so the countdown always targets the next June 25. */
  function nextWeddingDate() {
    const now = new Date();
    let target = new Date(now.getFullYear(), 5, 25, 16, 0, 0);
    // Keep counting to this year's date until the celebration day is fully over.
    const endOfDay = new Date(now.getFullYear(), 5, 26, 0, 0, 0);
    if (now >= endOfDay) target = new Date(now.getFullYear() + 1, 5, 25, 16, 0, 0);
    return target;
  }
  const WEDDING_DATE = nextWeddingDate();
  // Progress ring measures from one year before the wedding.
  const RING_START = new Date(WEDDING_DATE.getFullYear() - 1, 5, 25, 16, 0, 0);

  /* ---------- Loader ---------- */
  const body = document.body;
  const loader = document.getElementById("loader");
  body.classList.add("is-loading");

  function finishLoading() {
    loader.classList.add("is-done");
    body.classList.remove("is-loading");
    body.classList.add("is-ready");
  }
  window.addEventListener("load", () => setTimeout(finishLoading, reduceMotion ? 0 : 900));
  // Safety net if load never fires (e.g. blocked font).
  setTimeout(finishLoading, 4000);

  /* ---------- Navigation ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const navProgress = document.getElementById("navProgress");
  const navIndicator = document.getElementById("navIndicator");
  const navLinkEls = [...navLinks.querySelectorAll(".nav__link")];
  let lastY = window.scrollY;

  function onScrollNav() {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    // Hide when scrolling down past the hero, reveal on any upward scroll.
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (goingDown && y > window.innerHeight * 0.6) nav.classList.add("is-hidden");
    else if (goingUp || y < 80) nav.classList.remove("is-hidden");
    lastY = y;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    navProgress.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    body.style.overflow = open ? "hidden" : "";
  }
  navToggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  // Sliding indicator under the active link (desktop).
  function moveIndicator(link) {
    if (!navIndicator) return;
    if (!link) { navIndicator.classList.remove("is-on"); return; }
    navIndicator.style.width = link.offsetWidth + "px";
    navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
    navIndicator.classList.add("is-on");
  }
  function setActiveLink(id) {
    let active = null;
    navLinkEls.forEach((a) => {
      const on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-active", on);
      if (on) active = a;
    });
    moveIndicator(active);
  }
  const activeLink = () => navLinkEls.find((l) => l.classList.contains("is-active"));
  navLinkEls.forEach((a) => {
    a.addEventListener("mouseenter", () => moveIndicator(a));
    a.addEventListener("mouseleave", () => moveIndicator(activeLink()));
  });
  window.addEventListener("resize", () => moveIndicator(activeLink()));

  /* ---------- Cursor glow ---------- */
  const glow = document.getElementById("cursorGlow");
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      body.classList.add("has-mouse");
    }, { passive: true });
    (function loop() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx - 210}px, ${gy - 210}px)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Hero particles ---------- */
  const canvas = document.getElementById("particles");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, particles = [], dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(140, (w * h) / 9000));
      particles = Array.from({ length: count }, () => spawn(true));
    }

    function spawn(anywhere) {
      const blue = Math.random() < 0.35;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 10,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(Math.random() * 0.35 + 0.12),
        a: Math.random() * Math.PI * 2,
        tw: Math.random() * 0.03 + 0.01,
        color: blue ? "111,146,255" : "230,233,238",
      };
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.a += p.tw;
        const alpha = 0.25 + Math.abs(Math.sin(p.a)) * 0.65;
        if (p.y < -10 || p.x < -10 || p.x > w + 10) particles[i] = spawn(false);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${alpha})`;
        ctx.shadowBlur = 8; ctx.shadowColor = `rgba(${p.color},${alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener("resize", resize);
    draw();
  }

  /* ---------- Hero parallax ---------- */
  const heroContent = document.querySelector(".hero__content");
  if (heroContent && !reduceMotion) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = `translateY(${y * 0.25}px)`;
        heroContent.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
      }
    }, { passive: true });
  }

  /* ---------- Countdown ---------- */
  const els = {
    d: document.getElementById("cdDays"),
    h: document.getElementById("cdHours"),
    m: document.getElementById("cdMinutes"),
    s: document.getElementById("cdSeconds"),
  };
  const note = document.getElementById("countdownNote");
  const ring = document.getElementById("ringProgress");
  const ringLabel = document.getElementById("ringLabel");
  const RING_LEN = 2 * Math.PI * 54;
  const pad = (n) => String(n).padStart(2, "0");

  function setNum(el, value) {
    if (el.textContent === value) return;
    el.textContent = value;
    if (reduceMotion) return;
    el.classList.remove("is-tick");
    void el.offsetWidth; // restart animation
    el.classList.add("is-tick");
  }

  function updateCountdown() {
    const now = new Date();
    let diff = WEDDING_DATE - now;
    if (diff <= 0) {
      setNum(els.d, "00"); setNum(els.h, "00"); setNum(els.m, "00"); setNum(els.s, "00");
      note.textContent = "Today is the day. We're getting married!";
      ring.style.strokeDashoffset = "0";
      ringLabel.textContent = "100%";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setNum(els.d, pad(days));
    setNum(els.h, pad(hours));
    setNum(els.m, pad(minutes));
    setNum(els.s, pad(seconds));
  }

  function updateRing() {
    const total = WEDDING_DATE - RING_START;
    const elapsed = Math.min(Math.max(Date.now() - RING_START, 0), total);
    const pct = elapsed / total;
    ring.style.strokeDashoffset = String(RING_LEN * (1 - pct));
    ringLabel.textContent = Math.round(pct * 100) + "%";
  }

  const weekday = WEDDING_DATE.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = WEDDING_DATE.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  note.textContent = `${weekday}, ${monthDay} · 4:00 in the afternoon`;

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (entry.target.id === "countdownGrid") setTimeout(updateRing, 300);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    updateRing();
  }

  /* ---------- Timeline fill on scroll ---------- */
  const timeline = document.querySelector(".timeline");
  const timelineFill = document.getElementById("timelineFill");
  if (timeline && timelineFill) {
    function fillTimeline() {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh * 0.7 - rect.top) / rect.height;
      const pct = Math.min(Math.max(progress, 0), 1) * 100;
      timelineFill.style.setProperty("--fill", pct + "%");
    }
    fillTimeline();
    window.addEventListener("scroll", fillTimeline, { passive: true });
  }

  /* ---------- 3D tilt on cards ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      let raf = null;
      card.addEventListener("mousemove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateZ(6px)`;
          card.style.transition = "transform .15s ease-out";
          raf = null;
        });
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform .8s cubic-bezier(.22,1,.36,1)";
        card.style.transform = "";
      });
    });
  }

  /* ---------- RSVP form ---------- */
  const form = document.getElementById("rsvpForm");
  const success = document.getElementById("rsvpSuccess");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("input[required]").forEach((input) => {
        const field = input.closest(".field");
        const ok = input.type === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value) : input.value.trim().length > 1;
        field.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        form.querySelector(".is-invalid input").focus();
        return;
      }
      const btn = form.querySelector("button[type=submit]");
      btn.classList.add("is-loading");
      btn.disabled = true;
      // Submit to Netlify Forms (the form is registered via data-netlify in index.html).
      const data = new URLSearchParams(new FormData(form));
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data.toString() })
        .then((res) => { if (!res.ok) throw new Error("Form submission failed: " + res.status); })
        .catch((err) => {
          // Local preview (file:// or a plain static server) has no Netlify backend; still show success.
          if (location.protocol === "http:" || location.protocol === "file:") return;
          throw err;
        })
        .then(() => {
          btn.classList.remove("is-loading");
          success.classList.add("is-visible");
        })
        .catch(() => {
          btn.classList.remove("is-loading");
          btn.disabled = false;
          alert("Sorry, something went wrong sending your reply. Please try again.");
        });
    });
    form.querySelectorAll("input").forEach((input) =>
      input.addEventListener("input", () => input.closest(".field")?.classList.remove("is-invalid"))
    );
  }

  /* ---------- Accordion: close others ---------- */
  document.querySelectorAll(".accordion__item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll(".accordion__item[open]").forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- Active nav link ---------- */
  // Map each section to the nav link that represents it; null clears the indicator.
  const sectionToLink = { intro: "story", story: "story", venue: "venue", details: "details", stay: "stay", faq: "faq", dress: "faq", rsvp: null, closing: null, hero: null, countdown: null };
  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = sectionToLink[entry.target.id];
        setActiveLink(target === undefined ? entry.target.id : target);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => so.observe(s));
  }
})();
