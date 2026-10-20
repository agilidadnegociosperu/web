(() => {
  const CONSERVATIVE_FACTOR = 0.5;
  const estimateSelectors = ['.loss-money', '.loss-year', '.loss-recovery strong'];
  const lastRenderedEstimate = new WeakMap();

  const getConfig = (target) => {
    if (!(target instanceof HTMLInputElement) || target.type !== 'number') return null;

    const form = target.closest('#calculadora .loss-form');
    if (!form) return null;

    const inputs = Array.from(form.querySelectorAll('input[type="number"]'));
    const index = inputs.indexOf(target);

    if (index === 0) return { min: 10, max: 2000 };
    if (index === 1) return { min: 1, max: 100 };
    if (index === 2) return { min: 1, max: 500 };
    return null;
  };

  const resetEstimateTracking = () => {
    estimateSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => lastRenderedEstimate.delete(element));
    });
  };

  // Angular valida estos campos en cada evento input. Durante la escritura de un
  // número de varias cifras, el campo puede quedar temporalmente vacío o por debajo
  // del mínimo. Evitamos que ese estado intermedio llegue al validador para que el
  // usuario pueda terminar de escribir sin que el valor vuelva automáticamente a 1.
  document.addEventListener('input', (event) => {
    const input = event.target;
    const config = getConfig(input);
    if (!config) return;

    resetEstimateTracking();

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

  // Los botones de comandas también recalculan sin disparar un evento input.
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest('#calculadora .loss-command-options button')) {
      resetEstimateTracking();
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

  const readFirstNumber = (text) => {
    const match = String(text || '').match(/\d[\d.,]*/);
    if (!match) return null;
    const value = Number(match[0].replace(/\D/g, ''));
    return Number.isFinite(value) ? value : null;
  };

  const replaceFirstNumber = (text, value) => {
    const match = String(text || '').match(/\d[\d.,]*/);
    if (!match || match.index == null) return text;
    const formatted = Math.round(value).toLocaleString('es-PE');
    return `${text.slice(0, match.index)}${formatted}${text.slice(match.index + match[0].length)}`;
  };

  const setTextIfChanged = (element, value) => {
    if (element && element.textContent !== value) element.textContent = value;
  };

  const setUrgencyFromConservativeValue = (monthlyLoss) => {
    const panel = document.querySelector('.urgency-panel');
    const label = panel?.querySelector('.urgency-label');
    const emoji = panel?.querySelector('.urgency-emoji');
    const copy = panel?.querySelector('.urgency-copy');
    if (!panel || !label || !emoji || !copy || !Number.isFinite(monthlyLoss)) return;

    let level = 'controlable';
    let labelText = 'CONTROLABLE';
    let emojiText = '🙂';
    let copyText = 'La fuga estimada todavía es contenida, pero dejarla crecer mes a mes termina convirtiéndola en una pérdida importante.';

    if (monthlyLoss >= 2500) {
      level = 'critico';
      labelText = 'CRÍTICO';
      emojiText = '😣';
      copyText = 'La fuga estimada ya supera un nivel crítico. Cada semana que pasa puede seguir acumulando dinero que el negocio ya generó.';
    } else if (monthlyLoss >= 1200) {
      level = 'alto';
      labelText = 'ALTO';
      emojiText = '😟';
      copyText = 'La fuga estimada ya representa una cantidad importante cada mes. Corregir la operación ahora evita seguir acumulándola.';
    } else if (monthlyLoss >= 500) {
      level = 'atencion';
      labelText = 'ATENCIÓN';
      emojiText = '😕';
      copyText = 'Ya hay suficiente dinero escapándose como para revisar la operación antes de que el problema siga creciendo.';
    }

    panel.classList.remove('urgency-controlable', 'urgency-atencion', 'urgency-alto', 'urgency-critico');
    panel.classList.add(`urgency-${level}`);
    setTextIfChanged(label, labelText);
    setTextIfChanged(emoji, emojiText);
    setTextIfChanged(copy, copyText);
  };

  // La calculadora usa una estimación deliberadamente conservadora. Mostramos el
  // 50% del cálculo base para no prometer al cliente una recuperación exagerada.
  const applyConservativeEstimate = () => {
    estimateSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        const current = element.textContent || '';
        if (lastRenderedEstimate.get(element) === current) return;

        const rawValue = readFirstNumber(current);
        if (rawValue == null) return;

        const rendered = replaceFirstNumber(current, rawValue * CONSERVATIVE_FACTOR);
        lastRenderedEstimate.set(element, rendered);
        if (current !== rendered) element.textContent = rendered;
      });
    });

    const monthly = readFirstNumber(document.querySelector('.loss-money')?.textContent || '');
    if (monthly != null) setUrgencyFromConservativeValue(monthly);
  };

  const planStyle = document.createElement('style');
  planStyle.textContent = `
    .plan-card[data-plan-selectable="true"] {
      cursor: pointer;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, filter .18s ease;
    }
    .plan-card[data-plan-selectable="true"]:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 46px rgba(0,35,63,.16);
    }
    .plan-card[data-plan-selectable="true"]:focus-visible {
      outline: 4px solid rgba(245,124,0,.35);
      outline-offset: 4px;
    }
    .plan-card.plan-selected {
      transform: scale(.985) !important;
      border-color: #16a36a !important;
      box-shadow: 0 0 0 4px rgba(22,163,106,.18), 0 20px 46px rgba(0,35,63,.18) !important;
      filter: saturate(1.08);
    }
    .plan-card.plan-selected::after {
      content: '✓ SELECCIONADO';
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 4;
      padding: 8px 11px;
      border-radius: 999px;
      background: #16a36a;
      color: #fff;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: .8px;
      box-shadow: 0 8px 20px rgba(22,163,106,.28);
      animation: planSelectedPop .22s ease-out;
    }
    @keyframes planSelectedPop {
      from { transform: scale(.7); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(planStyle);

  const enhancePlanCards = () => {
    document.querySelectorAll('#planes .plan-card').forEach((card) => {
      if (!(card instanceof HTMLElement) || card.dataset.planSelectable === 'true') return;

      const link = card.querySelector('.plan-cta[href]');
      if (!(link instanceof HTMLAnchorElement)) return;

      card.dataset.planSelectable = 'true';
      card.setAttribute('role', 'link');
      card.tabIndex = 0;

      const title = card.querySelector('h3')?.textContent?.trim() || 'plan';
      const price = card.querySelector('.plan-price')?.textContent?.replace(/\s+/g, ' ').trim() || '';
      card.setAttribute('aria-label', `Seleccionar ${title} ${price} y continuar por WhatsApp`);
    });
  };

  const selectPlan = (card) => {
    if (!(card instanceof HTMLElement) || card.classList.contains('plan-selected')) return;

    const link = card.querySelector('.plan-cta[href]');
    if (!(link instanceof HTMLAnchorElement)) return;

    document.querySelectorAll('#planes .plan-card.plan-selected').forEach((selected) => {
      selected.classList.remove('plan-selected');
    });

    card.classList.add('plan-selected');
    card.setAttribute('aria-busy', 'true');

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 280);
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const card = target.closest('#planes .plan-card');
    if (!(card instanceof HTMLElement)) return;

    event.preventDefault();
    selectPlan(card);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches('#planes .plan-card[data-plan-selectable="true"]')) return;

    event.preventDefault();
    selectPlan(target);
  });

  enhancePlanCards();
  applyConservativeEstimate();

  const observer = new MutationObserver(() => {
    enhancePlanCards();
    applyConservativeEstimate();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
