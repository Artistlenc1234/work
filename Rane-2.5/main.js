/* main.js */

/* NOTE: Navigation (Hamburger Menu) logic is NOT here. 
   Since the navbar is loaded via fetch(), the menu logic is handled 
   inside the <script> tags of your HTML files after the content loads.
*/

/* =========================================
   1. ADVANCED ANIMATION CONFIGURATION
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

/* --- HEADER SECTION --- */
ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
  scale: 0.8,
});

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
  origin: "left",
});

/* --- POPULAR ICE CREAM (Home Page) --- */
ScrollReveal().reveal(".popular__card", {
  ...scrollRevealOption,
  interval: 200, 
  distance: "40px",
});

/* --- FLAVOURS PAGE GRID (New Addition) --- */
/* This ensures your new flavours.html page animates nicely */
ScrollReveal().reveal(".flavour__card", {
  ...scrollRevealOption,
  interval: 150, 
  scale: 0.8,
});

/* --- DISCOVER SECTION --- */
ScrollReveal().reveal(".discover__card img", {
  ...scrollRevealOption,
  origin: "left",
  duration: 1500,
});

ScrollReveal().reveal(".discover__card__content", {
  ...scrollRevealOption,
  origin: "right",
  delay: 400,
});

/* --- BANNER SECTION --- */
ScrollReveal().reveal(".banner__content .section__header", {
  ...scrollRevealOption,
  origin: "top",
});
ScrollReveal().reveal(".banner__content .section__description", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".banner__card", {
  ...scrollRevealOption,
  interval: 200,
  scale: 0.5,
});

/* --- FRANCHISE SECTION (If present) --- */
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
   2. FRANCHISE FORM VALIDATION LOGIC
   (Only runs if form exists on the current page)
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