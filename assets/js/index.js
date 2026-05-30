document.addEventListener("DOMContentLoaded", function () {
  const revealItems = document.querySelectorAll(".index-flow .reveal-item");
  const orbitStage = document.getElementById("orbitStage");
  const backTop = document.querySelector(".pr-footer-backtop, .footer-neo-top");
  const featureCards = document.querySelectorAll(".feature-card-item");
  const trackItems = document.querySelectorAll(".feature-progress-track .track-item");
  const demoCards = document.querySelectorAll(".demos-scroll .demos-card");
  const demosScrollContainer = document.querySelector(".demos-scroll");
  const demosLabel = document.getElementById("demoLabel");
  const demosTitle = document.getElementById("demoTitle");
  const demosDesc = document.getElementById("demoDesc");
  const demosBtn = document.getElementById("demoBtn");
  const leftSticky = document.querySelector(".left-sticky");
  const demosSection = document.querySelector(".demos-domain");
  const demosScrollInner = demosScrollContainer ? demosScrollContainer.querySelector(".demos-scroll-inner") : null;
  const bgScene = document.querySelector(".bg-3d-scene");
  const motionCards = document.querySelectorAll(".showcase-item, .feature-card-item, .why-card-creative, .pricing-card-creative");
  const methodSection = document.querySelector(".work-method-section");
  const methodLine = methodSection ? methodSection.querySelector(".method-flow-line") : null;
  const methodSteps = methodSection ? methodSection.querySelectorAll(".method-step") : [];
  const animatedSections = document.querySelectorAll("section.animate-on-load");
  const fitbeginRevealTargets = document.querySelectorAll(".reveal-on-scroll");
  animatedSections.forEach((section, index) => {
    section.style.setProperty("--section-anim-delay", `${index * 120}ms`);
    section.classList.add("is-animated");
  });
  if (fitbeginRevealTargets.length) {
    const fitbeginRevealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px"
    });
    fitbeginRevealTargets.forEach((target) => fitbeginRevealObserver.observe(target));
  }
  const statCounters = document.querySelectorAll(".masaqy-stat-value[data-count-to]");
  const animateCounter = (counter) => {
    if (counter.dataset.counted === "true") return;
    counter.dataset.counted = "true";
    const target = Number(counter.getAttribute("data-count-to") || 0);
    const suffix = counter.getAttribute("data-count-suffix") || "";
    if (reducedMotion) {
      counter.textContent = `${target}${suffix}`;
      return;
    }
    const duration = 1100;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (statCounters.length) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.35
    });
    statCounters.forEach((counter) => statsObserver.observe(counter));
  }
  if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
        entry.target.classList.toggle("in-view", entry.isIntersecting);
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    });
    revealItems.forEach((item) => revealObserver.observe(item));
  }
  if (orbitStage) {
    orbitStage.addEventListener("pointermove", (event) => {
      const bounds = orbitStage.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      orbitStage.style.setProperty("--ox", `${Math.max(0, Math.min(x, 100))}%`);
      orbitStage.style.setProperty("--oy", `${Math.max(0, Math.min(y, 100))}%`);
    });
    orbitStage.addEventListener("pointerleave", () => {
      orbitStage.style.setProperty("--ox", "50%");
      orbitStage.style.setProperty("--oy", "50%");
    });
  }
  const smoothScrollTo = (top) => {
    window.scrollTo({
      top,
      behavior: "smooth"
    });
  };
  if (backTop) {
    backTop.addEventListener("click", (event) => {
      event.preventDefault();
      smoothScrollTo(0);
    });
  }
  if (featureCards.length && trackItems.length) {
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = entry.target.getAttribute("data-index");
        trackItems.forEach((item) => item.classList.toggle("active", item.getAttribute("data-index") === index));
        featureCards.forEach((card) => card.classList.toggle("active", card.getAttribute("data-index") === index));
      });
    }, {
      threshold: 0.5,
      rootMargin: "-10% 0px -40% 0px"
    });
    featureCards.forEach((card) => featureObserver.observe(card));
    if (!document.querySelector(".feature-card-item.active")) {
      featureCards[0].classList.add("active");
      trackItems[0].classList.add("active");
    }
    trackItems.forEach((item) => {
      item.addEventListener("click", () => {
        const index = item.getAttribute("data-index");
        const targetCard = document.querySelector(`.feature-card-item[data-index="${index}"]`);
        if (!targetCard) return;
        const offsetPosition = targetCard.getBoundingClientRect().top + window.pageYOffset - 140;
        smoothScrollTo(offsetPosition);
      });
    });
  }
  if (demoCards.length && demosScrollContainer) {
    // Logic synchronized with Lenis load block
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (methodSection && methodLine) {
    if (!reducedMotion && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(methodLine, {
        "--method-progress": 1,
        ease: "none",
        scrollTrigger: {
          trigger: methodSection,
          start: "top 72%",
          end: "bottom 45%",
          scrub: .45,
          onEnter: () => methodSection.classList.add("in-view"),
          onEnterBack: () => methodSection.classList.add("in-view"),
          onLeaveBack: () => methodSection.classList.remove("in-view")
        }
      });
      if (methodSteps.length) {
        gsap.fromTo(methodSteps, {
          y: 34,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          duration: .75,
          stagger: .1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: methodSection,
            start: "top 70%",
            once: true
          }
        });
      }
    } else {
      const methodObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          methodSection.classList.toggle("in-view", entry.isIntersecting);
        });
      }, {
        threshold: .22
      });
      methodObserver.observe(methodSection);
    }
  }
  if (motionCards.length) {
    if (!reducedMotion) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("motion-in", entry.isIntersecting);
        });
      }, {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px"
      });
      motionCards.forEach((card) => {
        card.classList.add("motion-card");
        cardObserver.observe(card);
      });
    } else {
      motionCards.forEach((card) => card.classList.add("motion-card", "motion-in"));
    }
  }
  // CTA Magnetic & Stagger Logic
  // const ctaIcons = document.querySelectorAll(".widgetscard");
  // if (ctaIcons.length) {
  // 	ctaIcons.forEach(item => {
  // 		item.addEventListener("mousemove", (e) => {
  // 			const rect = item.getBoundingClientRect();
  // 			const x = e.clientX - rect.left;
  // 			const y = e.clientY - rect.top;
  // 			item.style.setProperty("--mx", `${x}px`);
  // 			item.style.setProperty("--my", `${y}px`);
  // 			// Magnetic pull
  // 			const centerX = rect.width / 2;
  // 			const centerY = rect.height / 2;
  // 			const moveX = (x - centerX) * 0.2;
  // 			const moveY = (y - centerY) * 0.2;
  // 			gsap.to(item, {
  // 				x: moveX,
  // 				y: moveY,
  // 				duration: 0.4,
  // 				ease: "power2.out"
  // 			});
  // 		});
  // 		item.addEventListener("mouseleave", () => {
  // 			gsap.to(item, {
  // 				x: 0,
  // 				y: 0,
  // 				duration: 0.6,
  // 				ease: "elastic.out(1, 0.3)"
  // 			});
  // 		});
  // 	});
  // }
  // Initialize Demos & Lenis logic
  const systemTabs = document.querySelectorAll(".systems-tab");
  const systemsPanel = document.querySelector(".systems-panel");
  const systemsPanelImage = document.getElementById("systemsPanelImage");
  const systemsPanelKicker = document.getElementById("systemsPanelKicker");
  const systemsPanelTitle = document.getElementById("systemsPanelTitle");
  const systemsPanelDesc = document.getElementById("systemsPanelDesc");
  const systemsPanelBtn = document.getElementById("systemsPanelBtn");
  if (systemTabs.length && systemsPanel) {
    const activateSystemTab = (tab) => {
      if (!tab || tab.classList.contains("is-active")) return;
      systemTabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      systemsPanel.classList.add("is-changing");
      window.setTimeout(() => {
        const title = tab.getAttribute("data-title") || "";
        const subtitle = tab.getAttribute("data-subtitle") || "";
        const desc = tab.getAttribute("data-desc") || "";
        const img = tab.getAttribute("data-img") || "";
        const link = tab.getAttribute("data-link") || "#";
        if (systemsPanelImage) {
          systemsPanelImage.src = img;
          systemsPanelImage.alt = title;
        }
        if (systemsPanelKicker) systemsPanelKicker.textContent = title;
        if (systemsPanelTitle) systemsPanelTitle.textContent = subtitle;
        if (systemsPanelDesc) systemsPanelDesc.textContent = desc;
        if (systemsPanelBtn) systemsPanelBtn.setAttribute("href", link);
        systemsPanel.classList.remove("is-changing");
      }, 180);
    };
    systemTabs.forEach((tab) => {
      tab.addEventListener("click", () => activateSystemTab(tab));
    });
  }

  const initDemos = () => {
    const demosLabel = document.getElementById("demoLabel");
    const demosTitle = document.getElementById("demoTitle");
    const demosDesc = document.getElementById("demoDesc");
    const demosBtn = document.getElementById("demoBtn");
    const leftSticky = document.querySelector(".left-sticky");
    document.body.classList.add("loaded");
    // Initialize Main Lenis globally
    if (typeof Lenis !== "undefined") {
      window.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        infinite: false,
        smoothWheel: true,
      });

      function raf(time) {
        if (window.lenis) window.lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
    if (demosScrollContainer && demoCards.length) {
      // Register GSAP Plugin
      if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }
      const updateDemosIntro = (card) => {
        if (!card) return;
        const nextLabel = card.getAttribute("data-label") || "";
        const nextTitle = card.getAttribute("data-title") || "";
        const nextDesc = card.getAttribute("data-desc") || "";
        const nextLink = card.getAttribute("data-link") || "#";
        const nextBg = card.getAttribute("data-bg") || "transparent";
        // Background color updates immediately for better feel
        if (leftSticky) leftSticky.style.backgroundColor = nextBg;
        // Text swap animations
        if (demosLabel) demosLabel.classList.add("is-swapping");
        if (demosTitle) demosTitle.classList.add("is-swapping");
        if (demosDesc) demosDesc.classList.add("is-swapping");
        window.setTimeout(() => {
          if (demosLabel) {
            demosLabel.textContent = nextLabel;
            demosLabel.classList.remove("is-swapping");
          }
          if (demosTitle) {
            demosTitle.textContent = nextTitle;
            demosTitle.classList.remove("is-swapping");
          }
          if (demosDesc) {
            demosDesc.textContent = nextDesc;
            demosDesc.classList.remove("is-swapping");
          }
          if (demosBtn) demosBtn.setAttribute("href", nextLink);
        }, 180);
      };
      let currentActiveCard = null;
      const setActiveDemo = (activeCard) => {
        if (!activeCard || currentActiveCard === activeCard) return;
        currentActiveCard = activeCard;
        demoCards.forEach((card) => card.classList.toggle("active-card", card === activeCard));
        updateDemosIntro(activeCard);
      };
      const syncDemos = () => {
        const triggerLine = window.innerHeight * 0.45;
        let closestCard = null;
        let minDistance = Infinity;
        demoCards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const distance = Math.abs(cardCenter - triggerLine);
          if (distance < minDistance) {
            minDistance = distance;
            closestCard = card;
          }
        });
        if (closestCard) setActiveDemo(closestCard);
      };
      // Bind scroll events
      window.addEventListener("scroll", syncDemos, {
        passive: true
      });
      window.addEventListener("resize", syncDemos, {
        passive: true
      });
      if (window.lenis) {
        window.lenis.on('scroll', syncDemos);
      }
      demoCards.forEach((card) => {
        card.addEventListener("click", (e) => {
          const link = e.target.closest('a');
          if (!link || !link.getAttribute('href').startsWith('http')) {
            if (window.lenis) {
              window.lenis.scrollTo(card, {
                offset: -120
              });
            } else {
              const offsetTop = card.getBoundingClientRect().top + window.pageYOffset - 120;
              window.scrollTo({
                top: offsetTop,
                behavior: "smooth"
              });
            }
          }
        });
      });
      if (demosSection) demosSection.style.minHeight = "";
      // Initial check
      syncDemos();
    }
  };
  // Execute initialization based on page state
  if (document.readyState === "complete") {
    initDemos();
  } else {
    window.addEventListener("load", initDemos);
  }
});
