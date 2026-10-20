(() => {
  const getConfig = (target) => {
    if (!(target instanceof HTMLInputElement) || target.type !== 'number') return null;

    const form = target.closest('#calculadora .loss-form');
    if (!form) return null;

    const inputs = Array.from(form.querySelectorAll('input[type="number"]'));
    const index = inputs.indexOf(target);

    if (index === 0) return { min: 10, max: 2000 };
    if (index === 1) return { min: 1, max: 100 };
    return null;
  };

  // Angular valida estos campos en cada evento input. Durante la escritura de un
  // número de varias cifras (por ejemplo 150), el primer dígito puede quedar
  // temporalmente por debajo del mínimo. Evitamos que ese estado intermedio
  // llegue al validador para que el usuario pueda terminar de escribir.
  document.addEventListener('input', (event) => {
    const input = event.target;
    const config = getConfig(input);
    if (!config) return;

    const rawValue = input.value.trim();
    if (rawValue === '') {
      event.stopPropagation();
      return;
    }

    const value = Number(rawValue);
    if (!Number.isFinite(value) || value < config.min) {
      event.stopPropagation();
    }
  }, true);

  // Al abandonar el campo sí garantizamos un valor válido.
  document.addEventListener('blur', (event) => {
    const input = event.target;
    const config = getConfig(input);
    if (!config) return;

    const value = Number(input.value);
    const normalized = !Number.isFinite(value) || value < config.min
      ? config.min
      : Math.min(Math.round(value), config.max);

    if (input.value !== String(normalized)) {
      input.value = String(normalized);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, true);
})();
