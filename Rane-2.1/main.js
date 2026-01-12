const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute(
    "class",
    isOpen ? "ri-close-line" : "ri-menu-3-line"
  );
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-3-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// Header Animations
ScrollReveal().reveal(".header__image img", {
  duration: 1000,
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content .section__description", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__btn", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".header__content .socials", {
  ...scrollRevealOption,
  delay: 2000,
});

// Popular Section Animations
ScrollReveal().reveal(".popular__card", {
  ...scrollRevealOption,
  interval: 500,
});

// Discover/Most Selling Animations
ScrollReveal().reveal(".discover__card img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".discover__card:nth-child(2) img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".discover__card__content h4", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".discover__card__content .section__description", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".discover__card__content h3", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".discover__card__btn", {
  ...scrollRevealOption,
  delay: 2000,
});

// Banner Animations
ScrollReveal().reveal(".banner__content .section__header", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".banner__content .section__description", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".banner__card", {
  ...scrollRevealOption,
  delay: 1000,
  interval: 500,
});

// --- UPDATED: Franchise Section Animations ---
ScrollReveal().reveal(".franchise__container h2", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".franchise__container form", {
  ...scrollRevealOption,
  delay: 500,
});

// --- UPDATED: Franchise Form Logic ---
// ... (Keep all your ScrollReveal code above this line) ...

/* --- FRANCHISE FORM HANDLING WITH VALIDATION --- */
const contactForm = document.getElementById("franchise-form");
const formMessage = document.getElementById("form-message");
const formBtn = contactForm.querySelector("button");
const inputs = contactForm.querySelectorAll("input");

// Helper function to validate email format
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Helper function to show error
const showError = (input, message) => {
  // 1. Highlight the input red
  input.classList.add("input-error");
  
  // 2. Show message at the bottom
  formMessage.innerText = message;
  formMessage.style.display = "block";
  formMessage.style.color = "red";
  
  // 3. Reset button loading state immediately
  formBtn.innerText = "Send Application";
};

// Remove red border when user starts typing again
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("input-error");
    formMessage.style.display = "none";
  });
});

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Stop page reload

  // 1. Get Values
  const nameInput = contactForm.querySelector('input[name="name"]');
  const emailInput = contactForm.querySelector('input[name="email"]');
  const cityInput = contactForm.querySelector('input[name="city"]');
  
  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const cityValue = cityInput.value.trim();

  // 2. CLIENT-SIDE VALIDATION LOGIC

  // Check Name (Must be at least 3 chars)
  if (nameValue.length < 3) {
    showError(nameInput, "Name must be at least 3 characters long.");
    return; // Stop execution
  }

  // Check Email (Regex)
  if (!isValidEmail(emailValue)) {
    showError(emailInput, "Please enter a valid email address.");
    return; // Stop execution
  }

  // Check City (Must be at least 3 chars)
  if (cityValue.length < 3) {
    showError(cityInput, "Please enter a valid city name.");
    return; // Stop execution
  }

  // 3. IF VALIDATION PASSES, SEND DATA
  
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
      // Success!
      formMessage.innerText = "Application sent successfully!";
      formMessage.style.display = "block";
      formMessage.style.color = "var(--primary-color)"; // Purple success message
      contactForm.reset(); 
    } else {
      // Error from API
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
    // Reset button text after 5 seconds
    setTimeout(() => {
      formBtn.innerText = originalBtnText;
      if(formMessage.style.color === "var(--primary-color)"){
          formMessage.style.display = "none";
      }
    }, 5000);
  }
});