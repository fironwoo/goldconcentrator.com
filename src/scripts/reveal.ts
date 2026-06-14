import { getRevealDelay, REVEAL_SELECTOR } from '../lib/motion';

function setupRevealMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)).filter(
    (target) => !target.closest('[data-no-reveal]'),
  );

  if (targets.length === 0) return;

  const parentCounts = new Map<Element, number>();
  targets.forEach((target) => {
    const parent = target.parentElement ?? document.body;
    const index = parentCounts.get(parent) ?? 0;
    parentCounts.set(parent, index + 1);
    target.classList.add('reveal-item');
    target.style.setProperty('--reveal-delay', `${getRevealDelay(index)}ms`);
  });

  document.documentElement.classList.add('motion-ready');

  if (!('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-revealed'));
    return;
  }

  let remaining = targets.length;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
        remaining -= 1;
      });

      if (remaining === 0) observer.disconnect();
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
    },
  );

  targets.forEach((target) => observer.observe(target));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupRevealMotion, { once: true });
} else {
  setupRevealMotion();
}
