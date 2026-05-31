document.addEventListener("DOMContentLoaded", function () {
  const currentPath = (window.location.pathname || "").toLowerCase();
  const isIndexPage = currentPath.endsWith("/") || currentPath.endsWith("/index.html") || currentPath === "/index.html" || currentPath === "index.html" || currentPath === "";
  document.querySelectorAll(".index-page-only").forEach((item) => {
    item.classList.toggle("d-none", !isIndexPage);
  });
  const header = document.getElementById("mainNavbar");
  const headerShell = header ? header.querySelector(".header-shell") : null;
  const navLinks = document.querySelectorAll(".nav-link-modern");
  const sectionAnchors = Array.from(navLinks).map((link) => link.getAttribute("href")).filter((href) => href && href.startsWith("#") && href.length > 1);
  const sections = sectionAnchors.map((href) => document.querySelector(href)).filter(Boolean);
  const progressBar = document.querySelector(".scroll-progress-bar");
  const navbarCollapse = document.getElementById("prenavbar");
  let ticking = false;
  // Get Lenis instance if available (it should be globally available if initialized in index.html)
  const getLenis = () => window.lenis || null;
  const updateHeaderState = () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (header) {
      header.classList.toggle("scrolled", currentScroll > 50);
    }
    if (progressBar) {
      const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0;
      progressBar.style.setProperty("--progress", Math.min(progress, 100));
    }
  };
  const updateActiveLink = () => {
    let current = "";
    const threshold = 180; // Distance from top to trigger "active"
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    if (isIndexPage) {
      // Bottom check
      if (scrollTop + windowHeight >= scrollHeight - 60) {
        if (sections.length > 0) {
          current = sections[sections.length - 1].getAttribute("id") || "";
        }
      }
      // Top check
      else if (scrollTop < 120) {
        current = ""; // Home
      }
      // Active section detection
      else {
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          if (scrollTop >= sectionTop - threshold) {
            current = section.getAttribute("id") || "";
          }
        });
      }
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;
        const isSectionLink = href.startsWith("#") && href.length > 1;
        if (isSectionLink) {
          const sectionId = href.substring(1);
          link.classList.toggle("active", current === sectionId);
        } else {
          const isHomeLink = href.endsWith("/index.html") || href.endsWith("./index.html") || href === "index.html";
          if (isHomeLink) {
            link.classList.toggle("active", current === "");
          }
        }
      });
    }
  };
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeaderState();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener("scroll", onScroll, {
    passive: true
  });
  updateHeaderState();
  updateActiveLink();
  // Consolidated Smooth Scroll Handler
  document.addEventListener("click", function (event) {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href === "#" || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, {
        offset: -110
      });
    } else {
      const offsetTop = target.offsetTop - 110;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
    // Close mobile navbar if open
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse);
      if (collapseInstance) collapseInstance.hide();
    }
  });
  document.querySelectorAll("#mainNavbar .dropdown").forEach((dropdownElement) => {
    dropdownElement.addEventListener("show.bs.dropdown", () => {
      document.querySelectorAll("#mainNavbar .dropdown.show").forEach((openDropdown) => {
        if (openDropdown !== dropdownElement) {
          const openToggle = openDropdown.querySelector(".dropdown-toggle");
          if (openToggle) {
            const instance = bootstrap.Dropdown.getInstance(openToggle);
            if (instance) {
              instance.hide();
            }
          }
        }
      });
    });
  });
  if (header && headerShell) {
    const updatePointerPosition = (event) => {
      const bounds = headerShell.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;
      header.style.setProperty("--pointer-x", `${Math.max(0, Math.min(pointerX, 100))}%`);
      header.style.setProperty("--pointer-y", `${Math.max(0, Math.min(pointerY, 100))}%`);
    };
    headerShell.addEventListener("pointermove", updatePointerPosition);
    headerShell.addEventListener("pointerleave", () => {
      header.style.setProperty("--pointer-x", "50%");
      header.style.setProperty("--pointer-y", "50%");
    });
  }
});
