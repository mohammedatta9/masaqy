document.addEventListener("DOMContentLoaded", function () {
  const revealItems = document.querySelectorAll(".about-page-flow .reveal-item");
  const animatedSections = document.querySelectorAll(".about-page-flow section.animate-on-load");
  const revealOnScrollItems = document.querySelectorAll(".about-page-flow .reveal-on-scroll");

  animatedSections.forEach((section, index) => {
    section.style.setProperty("--section-anim-delay", `${index * 120}ms`);
    section.classList.add("is-animated");
  });

  if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 6, 5) * 80}ms`;
      revealObserver.observe(item);
    });
  }

  if (revealOnScrollItems.length) {
    const revealOnScrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px"
    });

    revealOnScrollItems.forEach((item) => revealOnScrollObserver.observe(item));
  }
});
