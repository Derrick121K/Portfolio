(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");
  const projectCards = Array.from(document.querySelectorAll(".project-card[data-category]"));
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const projectCount = document.getElementById("projectCount");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  // Persist theme where storage is available; fall back gracefully in private browsing.
  let preferredTheme = "dark";
  try {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored === "light" || stored === "dark") preferredTheme = stored;
  } catch (_) {
    // Storage may be disabled by the browser.
  }
  root.dataset.theme = preferredTheme;

  const updateThemeButton = () => {
    if (!themeToggle) return;
    const isDark = root.dataset.theme !== "light";
    themeToggle.textContent = isDark ? "☼" : "◐";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    themeToggle.setAttribute("aria-pressed", String(!isDark));
  };

  updateThemeButton();
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
      try { localStorage.setItem("portfolio-theme", root.dataset.theme); } catch (_) {}
      updateThemeButton();
    });
  }

  const closeMenu = () => {
    if (!menuToggle || !primaryNav) return;
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      primaryNav.classList.toggle("is-open", open);
    });
    primaryNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", event => {
      if (!primaryNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  // Filter projects without hiding any projects until the visitor chooses a filter.
  const setProjectFilter = (filter) => {
    let visible = 0;
    projectCards.forEach(card => {
      const categories = (card.dataset.category || "").split(/\s+/);
      const show = filter === "all" || categories.includes(filter);
      card.hidden = !show;
      if (show) visible += 1;
    });
    filterButtons.forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (projectCount) projectCount.textContent = `Showing ${visible} project${visible === 1 ? "" : "s"}`;
  };

  filterButtons.forEach(button => {
    button.addEventListener("click", () => setProjectFilter(button.dataset.filter || "all"));
  });

  // Smooth anchor navigation with native fallback for reduced-motion preferences.
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
})();
