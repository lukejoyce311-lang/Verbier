// VERBIER bespoke interactions: smooth anchors, reveal on scroll, precise offsets
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Update CSS var for header height to keep anchor scroll precise
  const header = document.querySelector('.site-header .header-inner');
  const root = document.documentElement;
  function updateHeaderHeightVar() {
    const height = header ? header.getBoundingClientRect().height : 72;
    root.style.setProperty('--header-height', `${Math.round(height)}px`);
  }
  updateHeaderHeightVar();
  window.addEventListener('resize', () => { updateHeaderHeightVar(); });

  // Intersection Observer for subtle reveal
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });
    elements.forEach((el) => observer.observe(el));
  } else {
    // Ensure content is visible without motion
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  // Smooth scrolling enhancement for in-page anchors (respects reduced motion)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length === 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(root).getPropertyValue('--header-height')) || 0);
      if (prefersReduced) {
        window.scrollTo(0, top);
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Move focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();

