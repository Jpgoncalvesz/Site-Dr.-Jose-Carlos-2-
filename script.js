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
        menu.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        header.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
      }
    });
  }

  if (intro && !reduceMotion) {
    const hasSeenIntro = sessionStorage.getItem("jcIntroSeen") === "true";

    if (hasSeenIntro) {
      intro.classList.add("is-hidden");
    } else {
      body.classList.add("intro-active");
      window.setTimeout(function () {
        intro.classList.add("is-hidden");
        body.classList.remove("intro-active");
        sessionStorage.setItem("jcIntroSeen", "true");
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
    return;
  }

  document.documentElement.classList.add("can-animate");

  const observer = new IntersectionObserver(
    function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
})();
