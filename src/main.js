import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // Only remove visibility if the element is exiting the BOTTOM of the viewport.
        // If it exits the top, keep it visible so its transform doesn't push it back into the viewport resulting in an infinite flicker loop.
        if (entry.boundingClientRect.top > 0) {
          entry.target.classList.remove('is-visible');
        }
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('.fade-in-section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Scroll-driven Opacity Fade and Scale for Hero Background / Content
  const heroBg = document.getElementById('hero-bg');
  const heroContent = document.getElementById('hero-content');

  if (heroBg || heroContent) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (heroBg) {
        // Calculate opacity: 1 at top, fading to 0 by 60% of viewport height
        const fadeThreshold = viewportHeight * 0.6;
        let opacity = 1 - (scrollY / fadeThreshold);
        heroBg.style.opacity = Math.max(0, Math.min(1, opacity));
      }

      if (heroContent) {
        // Continuous Scroll Velocity for the Hero Text (Scale + Translate + Opacity)
        // Scale down to 0.9, move down 40px, and fade out before being covered
        const contentFadeThreshold = viewportHeight * 0.5;
        let progress = scrollY / contentFadeThreshold;
        progress = Math.max(0, Math.min(1, progress));

        const scale = 1 - (progress * 0.10); // Shrinks 10%
        const translateY = progress * 40; // Moves down 40px
        const opacity = 1 - (progress * 1.5); // Fades completely

        heroContent.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        heroContent.style.opacity = Math.max(0, opacity);
        // Will-change hint purely when active could be added, but this is usually cheap 
      }
    }, { passive: true });
  }
});
