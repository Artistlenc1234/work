/* =========================================
   1. GLOBAL COMPONENT LOADER (Navbar & Footer)
   ========================================= */
async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (!element) return;

  try {
    const response = await fetch(file);
    if (response.ok) {
      const html = await response.text();
      element.innerHTML = html;

      // Initialize Mobile Menu only after Navbar loads
      if (file.includes('navbar.html')) {
        initMobileMenu();
      }
    } else {
      console.error(`Error loading ${file}`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

// Initialize Loader
document.addEventListener("DOMContentLoaded", () => {
  loadComponent('navbar-placeholder', 'navbar.html');
  loadComponent('footer-placeholder', 'footer.html');
});

/* =========================================
   2. MOBILE MENU LOGIC (Fixed for your HTML)
   ========================================= */
function initMobileMenu() {
  // We use IDs here because your HTML uses id="menu-btn" and id="nav-links"
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      // Toggle the 'open' class defined in your CSS
      navLinks.classList.toggle("open");

      // Optional: Change the icon from 'Menu' to 'X'
      const isOpen = navLinks.classList.contains("open");
      if(menuBtnIcon) {
        menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-3-line");
      }
    });

    // Close menu when a link is clicked
    navLinks.addEventListener("click", () => {
      navLinks.classList.remove("open");
      if(menuBtnIcon) {
        menuBtnIcon.setAttribute("class", "ri-menu-3-line");
      }
    });
  }
}

/* =========================================
   3. SCROLL REVEAL CONFIGURATION
   ========================================= */
const scrollRevealOption = {
  distance: "60px",
  origin: "bottom",
  duration: 1200,
  delay: 200,
  easing: "cubic-bezier(0.23, 1, 0.32, 1)",
  scale: 0.9,
  opacity: 0,
  mobile: true,
  reset: false 
};

/* --- GENERAL SITE ANIMATIONS --- */
ScrollReveal().reveal(".header__image img", { ...scrollRevealOption, origin: "right", scale: 0.8 });
ScrollReveal().reveal(".header__content h1", { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".header__content .section__description", { ...scrollRevealOption, delay: 900 });
ScrollReveal().reveal(".header__btn", { ...scrollRevealOption, delay: 1300 });
ScrollReveal().reveal(".header__content .socials", { ...scrollRevealOption, delay: 1700, origin: "left" });
ScrollReveal().reveal(".popular__card", { ...scrollRevealOption, interval: 200, distance: "40px" });
ScrollReveal().reveal(".flavour__card", { ...scrollRevealOption, interval: 150, scale: 0.8 });
ScrollReveal().reveal(".discover__card img", { ...scrollRevealOption, origin: "left", distance: "100px", duration: 1500 });
ScrollReveal().reveal(".discover__card__content", { ...scrollRevealOption, origin: "right", distance: "100px", duration: 1500, delay: 400 });
ScrollReveal().reveal(".banner__content .section__header", { ...scrollRevealOption, origin: "top" });
ScrollReveal().reveal(".banner__content .section__description", { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".banner__card", { ...scrollRevealOption, interval: 200, scale: 0.5 });
ScrollReveal().reveal(".model__card", { ...scrollRevealOption, interval: 200, distance: "40px", scale: 0.9 });
ScrollReveal().reveal(".franchise__card", { ...scrollRevealOption, interval: 150, origin: "left", distance: "50px" });
ScrollReveal().reveal(".franchise__content h2", { ...scrollRevealOption, origin: "top" });
ScrollReveal().reveal(".franchise__content form", { ...scrollRevealOption, delay: 300, scale: 0.95 });

/* =========================================
   4. OUR STORY PAGE ANIMATIONS
   ========================================= */
const timelineRows = document.querySelectorAll('.event-row');
if (timelineRows.length > 0) {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  timelineRows.forEach((row) => {
    timelineObserver.observe(row);
  });
}

/* =========================================
   5. FRANCHISE FORM VALIDATION
   ========================================= */
const contactForm = document.getElementById("franchise-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {
  const formBtn = contactForm.querySelector("button");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(String(phone));

  const showError = (inputName, message) => {
    const input = contactForm.querySelector(`[name="${inputName}"]`);
    if (input) {
      input.classList.add("input-error");
      input.focus();
    }
    formMessage.innerText = message;
    formMessage.style.display = "block";
    formMessage.style.color = "red";
    formBtn.innerText = "Submit Application";
    formBtn.disabled = false;
  };

  const inputs = contactForm.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      formMessage.style.display = "none";
    });
    input.addEventListener("change", () => input.classList.remove("input-error"));
  });

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formBtn.innerText = "Validating...";
    formBtn.disabled = true;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    if (!data.name || data.name.trim().length < 3) return showError("name", "Please enter your full name.");
    if (!isValidEmail(data.email)) return showError("email", "Please enter a valid email address.");
    if (!isValidPhone(data.phone)) return showError("phone", "Please enter a valid 10-digit phone number.");
    if (!data.address || data.address.trim().length < 5) return showError("address", "Please enter a complete address.");
    
    if (data.owned_business === "Yes" && (!data.business_type || data.business_type.trim() === "")) {
      return showError("business_type", "Please specify the business type.");
    }
    if (!data.city || data.city.trim().length < 2) return showError("city", "Please enter a valid city.");
    if (data.own_space === "Yes" && (!data.shop_description || data.shop_description.trim() === "")) {
      return showError("shop_description", "Please describe your commercial location.");
    }
    if (!contactForm.querySelector("#agreement").checked) return showError("agreement", "You must agree to the terms.");

    formBtn.innerText = "Sending Application...";
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.status === 200) {
        formMessage.innerText = "Application sent successfully! We will contact you soon.";
        formMessage.style.display = "block";
        formMessage.style.color = "var(--primary-color)"; 
        contactForm.reset(); 
      } else {
        formMessage.innerText = result.message;
        formMessage.style.color = "red";
      }
    } catch (error) {
      formMessage.innerText = "Something went wrong! Check connection.";
      formMessage.style.color = "red";
    } finally {
      setTimeout(() => {
        formBtn.innerText = "Submit Application";
        formBtn.disabled = false;
        if(formMessage.style.color === "var(--primary-color)") formMessage.style.display = "none";
      }, 5000);
    }
  });
}


/* =========================================
   6. DYNAMIC TIMELINE LINE (DRIVING EFFECT)
   ========================================= */
function updateTimelineProgress() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  // Get the position of the timeline relative to the viewport
  const rect = timeline.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate the 'start' (center of screen) relative to the timeline top
  // As the timeline moves up, 'rect.top' becomes negative.
  // We want the line to fill as the timeline passes the center of the screen.
  const triggerPoint = windowHeight / 1.5; // Line follows 2/3rds down the screen
  
  // Math to calculate percentage filled
  const value = triggerPoint - rect.top;
  const percentage = (value / timeline.offsetHeight) * 100;

  // Clamp the result between 0% and 100%
  let finalHeight = percentage;
  if (percentage < 0) finalHeight = 0;
  if (percentage > 100) finalHeight = 100;

  // Update the CSS variable
  timeline.style.setProperty('--line-height', `${finalHeight}%`);
}

// Listen to scroll event
window.addEventListener('scroll', updateTimelineProgress);

// Run once on load to set initial state
window.addEventListener('load', updateTimelineProgress);