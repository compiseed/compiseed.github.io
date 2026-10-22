(() => {
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return;
  const brands = [...document.querySelectorAll('.site-header .brand')];
  let scheduled = false;

  function alignBottoms() {
    scheduled = false;
    for (const brand of brands) {
      const word = brand.querySelector('.brand-wordmark');
      const image = brand.querySelector('.brand-icon img');
      if (!word || !image) continue;
      let baseline = word.querySelector('.brand-baseline');
      if (!baseline) {
        baseline = document.createElement('span');
        baseline.className = 'brand-baseline';
        baseline.setAttribute('aria-hidden', 'true');
        word.append(baseline);
      }
      word.style.transform = 'none';
      const font = getComputedStyle(word);
      context.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
      const descent = context.measureText('CompiSeed').actualBoundingBoxDescent;
      if (!Number.isFinite(descent)) continue;
      const textBottom = baseline.getBoundingClientRect().top + descent;
      const rect = image.getBoundingClientRect();
      // The supplied 573px logo's diamond ends at source row 438 (bottom edge 439).
      const diamondBottom = rect.top + rect.height * 439 / 573;
      word.style.transform = `translateY(${diamondBottom - textBottom}px)`;
      brand.dataset.logoAligned = 'true';
    }
  }

  function scheduleAlignment() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(alignBottoms);
  }

  document.fonts.ready.then(scheduleAlignment);
  window.addEventListener('resize', scheduleAlignment, {passive: true});
})();
