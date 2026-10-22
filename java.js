// ============================
// SCRIPT.JS for Solomon Sema Portfolio
// Includes: A) Actions, B) DOM Generation (optional), C) Full Enhancements
// ============================

// ============================
// A) INTERACTIVE ACTIONS FOR EXISTING HTML
// ============================

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('change', () => {
  mobileMenu.classList.toggle('open', menuToggle.checked);
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.checked = false;
    mobileMenu.classList.remove('open');
  });
});

// Scroll-Active Navbar Highlight
window.addEventListener('scroll', () => {
  let sections = document.querySelectorAll('section, .container');
  let scrollY = window.pageYOffset;

  sections.forEach(sec => {
    let top = sec.offsetTop - 200;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
      let activeLink = document.querySelector(`nav a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
});

// Contact Form Validation
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Your message has been sent! Thank you for contacting me.');
  this.reset();
});

// Registration Form Validation
document.querySelector('.registration-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Your registration has been submitted successfully!');
  this.reset();
});

// Typewriter Animation
const typewriter = document.querySelector('.typewriter');
if (typewriter) {
  let text = typewriter.textContent;
  typewriter.textContent = '';
  let index = 0;

  function type() {
    if (index < text.length) {
      typewriter.textContent += text.charAt(index);
      index++;
      setTimeout(type, 60);
    }
  }
  type();
}

// ============================
// B) OPTIONAL — CONVERT HTML SECTIONS USING JS DOM (Example Only)
// ============================
// This is just an example of dynamic element creation.
// You do NOT need this if you prefer HTML.

const dynamicExample = () => {
  const newBox = document.createElement('div');
  newBox.className = 'project-card';
  newBox.innerHTML = `<h3>✨ Dynamic JS Card</h3><p>Created using JavaScript DOM manipulation.</p>`;
  document.querySelector('#projects .project-grid')?.appendChild(newBox);
};

// Run the example once the page loads
window.addEventListener('load', dynamicExample);

// ============================
// C) EXTRA UI FEATURES (Animations & Effects)
// ============================

// Fade-in Animation on Scroll
const fadeElements = document.querySelectorAll('.list, .project-card, .skill-card');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

fadeElements.forEach(el => fadeObserver.observe(el));
