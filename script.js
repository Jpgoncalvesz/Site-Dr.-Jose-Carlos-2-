(function () {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const intro = document.querySelector("[data-intro]");
  const year = document.querySelector("[data-year]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  function closeMenu() {
    if (!menu || !menuToggle || !header) return;
    menu.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    header.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (menu && menuToggle && header) {
    menuToggle.addEventListener("click", function () {
      const isOpen = menu.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      header.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  if (intro && !reduceMotion) {
    const hasSeenIntro = sessionStorage.getItem("jccrIntroSeen") === "true";

    if (hasSeenIntro) {
      intro.classList.add("is-hidden");
    } else {
      body.classList.add("intro-active");
      window.setTimeout(function () {
        intro.classList.add("is-hidden");
        body.classList.remove("intro-active");
        sessionStorage.setItem("jccrIntroSeen", "true");
      }, 1180);
    }
  } else if (intro) {
    intro.classList.add("is-hidden");
  }

  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    document.documentElement.classList.add("can-animate");

    const revealObserver = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
  const sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const activeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      {
        threshold: 0.32,
        rootMargin: "-22% 0px -58% 0px"
      }
    );

    sections.forEach(function (section) {
      activeObserver.observe(section);
    });
  }
})();
