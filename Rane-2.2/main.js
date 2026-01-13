/* main.js */

/* =========================================
   1. NAVIGATION LOGIC
   (Only runs if elements exist - safety check included)
   ========================================= */
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", (e) => {
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-3-line");
  });

  navLinks.addEventListener("click", (e) => {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-3-line");
  });
}

/* =========================================
   2. ADVANCED ANIMATION CONFIGURATION
   ========================================= */
const scrollRevealOption = {
  distance: "60px",          // Elements travel a bit further
  origin: "bottom",          // Default comes from bottom
  duration: 1200,            // Slower duration = smoother feel
  delay: 200,                // Slight pause before starting
  easing: "cubic-bezier(0.23, 1, 0.32, 1)", // The "Premium" smooth curve
  scale: 0.9,                // Starts slightly smaller (90%) and zooms to 100%
  opacity: 0,                // Starts invisible
  mobile: true,              // Works on mobile
  reset: false               // Animations happen only once (cleaner)
};

/* --- HEADER SECTION --- */
// Image slides in from the right
ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
  scale: 0.8, // Slightly more zoom for the main image
});

// Text elements cascade (Staggered effect)
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content .section__description", {
  ...scrollRevealOption,
  delay: 900,
});
ScrollReveal().reveal(".header__btn", {
  ...scrollRevealOption,
  delay: 1300,
});
ScrollReveal().reveal(".header__content .socials", {
  ...scrollRevealOption,
  delay: 1700,
  origin: "left", // Socials slide in from left
});

/* --- POPULAR ICE CREAM (The Grid) --- */
// Uses interval to ripple them in one by one
ScrollReveal().reveal(".popular__card", {
  ...scrollRevealOption,
  interval: 200, // Faster ripple
  distance: "40px",
});

/* --- DISCOVER SECTION (Alternating Sides) --- */
ScrollReveal().reveal(".discover__card img", {
  ...scrollRevealOption,
  origin: "left",
  duration: 1500, // Images take longer to settle
});

ScrollReveal().reveal(".discover__card__content", {
  ...scrollRevealOption,
  origin: "right",
  delay: 400,
});

/* --- BANNER SECTION --- */
ScrollReveal().reveal(".banner__content .section__header", {
  ...scrollRevealOption,
  origin: "top", // Drops down
});
ScrollReveal().reveal(".banner__content .section__description", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".banner__card", {
  ...scrollRevealOption,
  interval: 200, // Ripple effect for icons
  scale: 0.5,    // Icons pop in from small size
});

/* --- FRANCHISE / CONTACT SECTION --- */
ScrollReveal().reveal(".franchise__content h2", {
  ...scrollRevealOption,
  origin: "top",
});
ScrollReveal().reveal(".franchise__content form", {
  ...scrollRevealOption,
  delay: 400,
  scale: 0.95,
});

/* =========================================
   3. FRANCHISE FORM VALIDATION LOGIC
   (Kept exactly as you had it)
   ========================================= */
const contactForm = document.getElementById("franchise-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {
  const formBtn = contactForm.querySelector("button");
  const inputs = contactForm.querySelectorAll("input");

  // Helper function to validate email
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Helper function to show error
  const showError = (input, message) => {
    input.classList.add("input-error");
    formMessage.innerText = message;
    formMessage.style.display = "block";
    formMessage.style.color = "red";
    formBtn.innerText = "Send Application";
  };

  // Remove red border when user types
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      formMessage.style.display = "none";
    });
  });

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = contactForm.querySelector('input[name="name"]');
    const emailInput = contactForm.querySelector('input[name="email"]');
    const cityInput = contactForm.querySelector('input[name="city"]');
    
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const cityValue = cityInput.value.trim();

    if (nameValue.length < 3) {
      showError(nameInput, "Name must be at least 3 characters long.");
      return;
    }

    if (!isValidEmail(emailValue)) {
      showError(emailInput, "Please enter a valid email address.");
      return;
    }

    if (cityValue.length < 3) {
      showError(cityInput, "Please enter a valid city name.");
      return;
    }

    // Sending Data
    const originalBtnText = formBtn.innerText;
    formBtn.innerText = "Sending...";

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const result = await response.json();

      if (response.status === 200) {
        formMessage.innerText = "Application sent successfully!";
        formMessage.style.display = "block";
        formMessage.style.color = "var(--primary-color)"; 
        contactForm.reset(); 
      } else {
        formMessage.innerText = result.message;
        formMessage.style.display = "block";
        formMessage.style.color = "red";
      }
    } catch (error) {
      console.log(error);
      formMessage.innerText = "Something went wrong! Check your internet.";
      formMessage.style.display = "block";
      formMessage.style.color = "red";
    } finally {
      setTimeout(() => {
        formBtn.innerText = originalBtnText;
        if(formMessage.style.color === "var(--primary-color)"){
            formMessage.style.display = "none";
        }
      }, 5000);
    }
  });
}