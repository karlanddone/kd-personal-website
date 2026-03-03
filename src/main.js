import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('.fade-in-section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Scroll-driven Opacity Fade for Hero Background
  const heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      // Calculate opacity: 1 at top, fading to 0 by 60% of viewport height
      const fadeThreshold = window.innerHeight * 0.6;
      let opacity = 1 - (window.scrollY / fadeThreshold);

      // Clamp between 0 and 1
      opacity = Math.max(0, Math.min(1, opacity));
      heroBg.style.opacity = opacity;
    }, { passive: true }); // passive flag for scrolling performance
  }
});
