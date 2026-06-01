(() => {
  'use strict';

  const SELECTOR = '.hisi-anim';
  const ANIMATED_CLASS = 'ha--animated';
  const OBSERVED_ATTR = 'data-haObserved';

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.15, 0.3],
  };

  const setDuration = (element) => {
    const transitionDuration = element.dataset.animTime || '1';
    element.style.transitionDuration = `${transitionDuration}s`;
  };



  const init = () => {

    const hasIO = 'IntersectionObserver' in window;
    let observer = null;
    const pending = new Set();

    const activate = (element) => {
      if (element.dataset.haActivated === '1') return;
      element.dataset.haActivated = '1';
      setDuration(element);
      pending.delete(element);
      if (observer) observer.unobserve(element);
      // Forzar que el navegador registre el estado inicial (p. ej. clip-path
      // cerrado) ANTES de activar, para que la transición tenga un punto de
      // partida y anime. Sin esto, los contenedores de Elementor (e-con) se
      // hidratan con el estado inicial sin pintar y saltan al estado final
      // sin animación. El reflow + requestAnimationFrame separa ambos estados.
      void element.offsetWidth;
      requestAnimationFrame(() => {
        element.classList.add(ANIMATED_CLASS);
      });
    };

    const isElementVisible = (element) => {
      const rect = element.getBoundingClientRect();
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;

      if (rect.width <= 0 || rect.height <= 0) return false;
      if (rect.bottom <= 0 || rect.top >= vh || rect.right <= 0 || rect.left >= vw) return false;

      const visibleX = Math.max(0, Math.min(rect.right, vw) - Math.max(rect.left, 0));
      const visibleY = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
      const visibleArea = visibleX * visibleY;
      const totalArea = rect.width * rect.height;
      const ratio = totalArea > 0 ? visibleArea / totalArea : 0;

      return ratio >= 0.15;
    };

    if (hasIO) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const element = entry.target;

          if (entry.isIntersecting) {
            activate(element);
          }
        });
      }, observerOptions);
    }

    const observeElement = (element) => {
      if (element.getAttribute(OBSERVED_ATTR) === '1') return;
      element.setAttribute(OBSERVED_ATTR, '1');
      pending.add(element);

      if (!hasIO) {
        activate(element);
        return;
      }

      observer.observe(element);
      // Fallback inmediato para builders donde IO no dispara bien al primer render
      if (isElementVisible(element)) activate(element);
    };

    const observeNewElements = (root = document) => {
      const candidates = root.querySelectorAll
        ? root.querySelectorAll(SELECTOR)
        : [];

      candidates.forEach((element) => {
        observeElement(element);
      });
    };

    // Initial scan
    observeNewElements(document);

    // For builders that inject DOM after initial load (Bricks/Elementor/etc.)
    if ('MutationObserver' in window) {
      const mo = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;
            if (node.matches(SELECTOR)) {
              observeElement(node);
            }
            observeNewElements(node);
          });
        });
      });

      mo.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Fallback de compatibilidad: comprueba visibilidad en scroll/resize/load
    const fallbackTick = () => {
      pending.forEach((element) => {
        if (isElementVisible(element)) activate(element);
      });
    };

    window.addEventListener('scroll', fallbackTick, { passive: true });
    window.addEventListener('resize', fallbackTick);
    window.addEventListener('load', fallbackTick);

    // Primeras comprobaciones tras render/hydration del builder
    fallbackTick();
    requestAnimationFrame(fallbackTick);
    setTimeout(fallbackTick, 250);
    setTimeout(fallbackTick, 1000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
