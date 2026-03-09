async function loadComponent(id, file, onLoaded) {
  const element = document.getElementById(id);
  if (!element) return;

  try {
    const response = await fetch(file, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${file}: ${response.status}`);
    }
    element.innerHTML = await response.text();
    if (typeof onLoaded === "function") onLoaded();
  } catch (error) {
    console.error(error);
  }
}

function initMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;

  if (!menuBtn || !navLinks) return;
  if (menuBtn.dataset.bound === "true") return;

  const toggleMenu = () => {
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    if (menuBtnIcon) {
      menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-3-line");
    }
  };

  const closeMenu = () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    if (menuBtnIcon) {
      menuBtnIcon.setAttribute("class", "ri-menu-3-line");
    }
  };

  menuBtn.addEventListener("click", toggleMenu);
  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  menuBtn.dataset.bound = "true";
}

function initSharedLayout() {
  loadComponent("navbar-placeholder", "navbar.html", initMobileMenu);
  loadComponent("footer-placeholder", "footer.html");
}

function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides.length) return;

  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  };

  const startTimer = () => {
    slideInterval = window.setInterval(nextSlide, 4000);
  };

  const resetTimer = () => {
    window.clearInterval(slideInterval);
    startTimer();
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetTimer();
    });
  }

  startTimer();
}

function initFlavourFilters() {
  const filterItems = document.querySelectorAll(".filter-item[data-filter]");
  const cards = document.querySelectorAll(".popular__card[data-category]");
  if (!filterItems.length || !cards.length) return;

  const applyFilter = (category, activeItem) => {
    cards.forEach((card) => {
      card.style.display = category === "all" || card.dataset.category === category ? "flex" : "none";
    });

    filterItems.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    activeItem.classList.add("active");
    activeItem.setAttribute("aria-pressed", "true");
  };

  filterItems.forEach((item) => {
    const category = item.dataset.filter;
    item.addEventListener("click", () => applyFilter(category, item));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        applyFilter(category, item);
      }
    });
  });
}

function initGalleryLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lightboxImg = document.getElementById("lightbox-img");
  const captionText = document.getElementById("caption");
  const closeBtn = document.querySelector(".close-lightbox");
  const galleryItems = document.querySelectorAll(".gallery__item");

  if (!lightboxImg || !captionText || !closeBtn || !galleryItems.length) return;

  const closeLightbox = () => {
    lightbox.style.display = "none";
  };

  galleryItems.forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Open image preview");

    const openLightbox = () => {
      const img = item.querySelector("img");
      if (!img) return;
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      captionText.textContent = img.alt;
    };

    item.addEventListener("click", openLightbox);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox();
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === closeBtn) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

function initTimelineAnimations() {
  const timelineRows = document.querySelectorAll(".event-row");
  const timeline = document.querySelector(".timeline");

  if (timelineRows.length && "IntersectionObserver" in window) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    timelineRows.forEach((row) => timelineObserver.observe(row));
  }

  if (!timeline) return;

  const updateTimelineProgress = () => {
    const rect = timeline.getBoundingClientRect();
    const triggerPoint = window.innerHeight / 1.5;
    const value = triggerPoint - rect.top;
    const percentage = (value / timeline.offsetHeight) * 100;
    const finalHeight = Math.max(0, Math.min(100, percentage));
    timeline.style.setProperty("--line-height", `${finalHeight}%`);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateTimelineProgress();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}

function initFranchiseForm() {
  const form = document.getElementById("franchise-form");
  const formMessage = document.getElementById("form-message");
  if (!form || !formMessage) return;

  const formBtn = form.querySelector('button[type="submit"]');
  if (!formBtn) return;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(String(phone));

  const showMessage = (message, isError = true) => {
    formMessage.textContent = message;
    formMessage.style.display = "block";
    formMessage.style.color = isError ? "red" : "var(--primary-color)";
  };

  const showError = (inputName, message) => {
    const input = form.querySelector(`[name="${inputName}"]`);
    if (input) {
      input.classList.add("input-error");
      input.focus();
    }
    showMessage(message, true);
    formBtn.textContent = "Submit Application";
    formBtn.disabled = false;
  };

  form.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      formMessage.style.display = "none";
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formBtn.textContent = "Validating...";
    formBtn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const agreement = form.querySelector("#agreement");

    if (!data.name || data.name.trim().length < 3) return showError("name", "Please enter your full name.");
    if (!isValidEmail(data.email)) return showError("email", "Please enter a valid email address.");
    if (!isValidPhone(data.phone)) return showError("phone", "Please enter a valid 10-digit phone number.");
    if (!data.address || data.address.trim().length < 5) return showError("address", "Please enter a complete address.");
    if (!data.city || data.city.trim().length < 2) return showError("city", "Please enter a valid city.");
    if (data.owned_business === "Yes" && (!data.business_type || data.business_type.trim() === "")) {
      return showError("business_type", "Please specify the business type.");
    }
    if (data.own_space === "Yes" && (!data.shop_description || data.shop_description.trim() === "")) {
      return showError("shop_description", "Please describe your commercial location.");
    }
    if (!agreement || !agreement.checked) return showError("agreement", "You must agree to the terms.");

    data.agreement = "Yes";
    formBtn.textContent = "Sending Application...";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        showMessage("Application sent successfully! We will contact you soon.", false);
        form.reset();
      } else {
        showMessage(result.message || "Failed to submit application.", true);
      }
    } catch (error) {
      console.error(error);
      showMessage("Something went wrong. Please check your internet connection.", true);
    } finally {
      formBtn.textContent = "Submit Application";
      formBtn.disabled = false;
    }
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const messageEl = document.getElementById("contact-form-message");
  if (!form || !messageEl) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const setStatus = (message, isError = true) => {
    messageEl.textContent = message;
    messageEl.style.display = "block";
    messageEl.style.color = isError ? "red" : "var(--primary-color)";
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.name || data.name.trim().length < 2) return setStatus("Please enter your name.", true);
    if (!isValidEmail(data.email)) return setStatus("Please enter a valid email.", true);
    if (!data.message || data.message.trim().length < 5) return setStatus("Please enter your message.", true);

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus("Message sent successfully! We'll get back to you soon.", false);
        form.reset();
      } else {
        setStatus(result.message || "Failed to send your message.", true);
      }
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. Please try again later.", true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

function initScrollRevealAnimations() {
  if (typeof ScrollReveal !== "function") return;

  const base = {
    distance: "60px",
    origin: "bottom",
    duration: 1200,
    delay: 200,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    scale: 0.9,
    opacity: 0,
    mobile: true,
    reset: false,
  };

  const reveals = [
    [".header__image img", { origin: "right", scale: 0.8 }],
    [".header__content h1", { delay: 500 }],
    [".header__content .section__description", { delay: 900 }],
    [".header__btn", { delay: 1300 }],
    [".header__content .socials", { delay: 1700, origin: "left" }],
    [".popular__card", { interval: 200, distance: "40px" }],
    [".flavour__card", { interval: 150, scale: 0.8 }],
    [".discover__card img", { origin: "left", distance: "100px", duration: 1500 }],
    [".discover__card__content", { origin: "right", distance: "100px", duration: 1500, delay: 400 }],
    [".banner__content .section__header", { origin: "top" }],
    [".banner__content .section__description", { delay: 500 }],
    [".banner__card", { interval: 200, scale: 0.5 }],
    [".model__card", { interval: 200, distance: "40px", scale: 0.9 }],
    [".franchise__card", { interval: 150, origin: "left", distance: "50px" }],
    [".franchise__content h2", { origin: "top" }],
    [".franchise__content form", { delay: 300, scale: 0.95 }],
    [".gallery__item", { interval: 150, scale: 0.85 }],
  ];

  const sr = ScrollReveal();
  reveals.forEach(([selector, options]) => {
    if (document.querySelector(selector)) {
      sr.reveal(selector, { ...base, ...options });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSharedLayout();
  initHeroSlider();
  initFlavourFilters();
  initGalleryLightbox();
  initTimelineAnimations();
  initFranchiseForm();
  initContactForm();
  initScrollRevealAnimations();
});
