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

  // Tier 2 Archive Toggle Logic
  const toggleArchiveBtn = document.getElementById('toggle-archive');
  const fullArchiveSection = document.getElementById('full-archive');
  const toggleIcon = document.getElementById('toggle-archive-icon');

  if (toggleArchiveBtn && fullArchiveSection) {
    toggleArchiveBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const isHidden = fullArchiveSection.classList.contains('hidden');

      if (isHidden) {
        // Reveal
        fullArchiveSection.classList.remove('hidden');
        // Small delay to allow display:block to apply before changing opacity for transition
        setTimeout(() => {
          fullArchiveSection.classList.remove('opacity-0');
        }, 50);

        // Update button appearance
        toggleArchiveBtn.querySelector('span').textContent = 'Collapse Historical Loadout';
        if (toggleIcon) {
          toggleIcon.style.transform = 'rotate(180deg)';
        }

        // Smooth scroll to the top of the archive section, offset for breathing room
        setTimeout(() => {
          const y = fullArchiveSection.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 120);

      } else {
        // Hide
        fullArchiveSection.classList.add('opacity-0');

        // Update button appearance
        toggleArchiveBtn.querySelector('span').textContent = 'Access Full Historical Loadout';
        if (toggleIcon) {
          toggleIcon.style.transform = 'rotate(0deg)';
        }

        // Wait for opacity transition before hiding
        setTimeout(() => {
          fullArchiveSection.classList.add('hidden');
          // Scroll back up to the portfolio header
          const portfolioSection = document.getElementById('portfolio');
          if (portfolioSection) {
            const y = portfolioSection.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 700); // matches the duration-700 class from HTML
      }
    });
  }

  // Phase 9 Contact: Random Status Cycler
  const statusDisplay = document.getElementById('status-display');
  if (statusDisplay) {
    const statuses = [
      '<span class="text-neon-cyan animate-pulse mr-2">●</span> <span class="text-slate-200">SYSTEM STATUS: <span class="text-neon-cyan uppercase">Active</span>. Architecting custom deployments. Accepting select diagnostic consults.</span>',
      '<span class="text-neon-orange animate-pulse mr-2">●</span> <span class="text-slate-200">CURRENT FOCUS: Deploying custom compliance & L&D SaaS. <span class="text-neon-orange uppercase">Limited bandwidth</span> available for new architecture audits.</span>',
      '<span class="text-neon-cyan animate-pulse mr-2">●</span> <span class="text-slate-200">STATUS: <span class="text-neon-cyan uppercase">Online</span>. Currently accepting select frontier tech consults.</span>'
    ];

    // Pick a random status on load
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Add a slight delay for "typing" effect simulation, then show it
    setTimeout(() => {
      statusDisplay.innerHTML = randomStatus;
    }, 800);
  }
});

