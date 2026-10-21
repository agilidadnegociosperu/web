(() => {
  let defaultsApplied = false;

  const closeInfoPops = (except = null) => {
    document.querySelectorAll('details.info-pop[open]').forEach((details) => {
      if (details !== except) details.removeAttribute('open');
    });
  };

  const applyRestaurantDefaults = () => {
    if (defaultsApplied) return;
    const calculator = document.querySelector('#calculadora');
    if (!calculator) return;

    const inputs = calculator.querySelectorAll('.loss-form input[type="number"]');
    const defaults = ['100', '2', '12'];

    defaults.forEach((value, index) => {
      const input = inputs[index];
      if (!input) return;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    defaultsApplied = true;
  };

  const sync = () => window.requestAnimationFrame(applyRestaurantDefaults);

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const summary = target.closest('details.info-pop > summary');
    if (summary) {
      closeInfoPops(summary.parentElement);
      return;
    }

    if (!target.closest('details.info-pop')) closeInfoPops();
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeInfoPops();
  });

  document.addEventListener('DOMContentLoaded', sync);
  window.addEventListener('hashchange', sync);
  new MutationObserver(sync).observe(document.documentElement, { childList: true, subtree: true });
})();
