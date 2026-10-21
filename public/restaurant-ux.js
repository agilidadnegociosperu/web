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

  const wa = (message) => `https://wa.me/51991602920?text=${encodeURIComponent(message)}`;

  const coinStack = () => `
    <span class="tier-coins" aria-hidden="true">
      <i></i><i></i><i></i><i></i><i></i>
    </span>`;

  const infoButton = (content) => `
    <details class="info-pop plan-info">
      <summary aria-label="Ver detalles del plan">i</summary>
      <div>${content}</div>
    </details>`;

  const planList = (items) => `
    <ul class="plan-includes">
      ${items.map(([icon, text]) => `<li><span>${icon}</span><b>${text}</b></li>`).join('')}
    </ul>`;

  const goldItems = [
    ['🍽️', '01 comandera para cocina'],
    ['🧾', '01 ticketera para la caja'],
    ['📱', '01 tablet Xiaomi Redmi Pad 2'],
    ['🔌', 'Cableado de Red y Eléctrico para la conectividad'],
    ['🌐', 'Configuración de la Red'],
    ['⚙️', 'Configuración y puesta en marcha del Sistema'],
    ['👨‍🍳', 'Capacitación para el personal'],
    ['👨‍💼', 'Capacitación para el administrador']
  ];

  const silverItems = [
    ['🍽️', '01 comandera para cocina'],
    ['🔌', 'Cableado de Red y Eléctrico para la conectividad'],
    ['🌐', 'Configuración de la Red'],
    ['⚙️', 'Configuración y puesta en marcha del Sistema'],
    ['👨‍🍳', 'Capacitación para el personal'],
    ['👨‍💼', 'Capacitación para el administrador']
  ];

  const enhancePlans = () => {
    const section = document.querySelector('.restaurant-plans');
    if (!section || section.dataset.plansV2 === 'true') return;

    const goldInfo = `
      <strong class="plan-info-title">Plan Oro · Full Equipamiento</strong>
      ${planList(goldItems)}
      <small>Consulte los términos y condiciones.</small>`;

    const silverInfo = `
      <strong class="plan-info-title">Plan Plata · Medio</strong>
      ${planList(silverItems)}
      <div class="plan-excludes"><span>✕</span><b>No incluye 01 ticketera para la caja</b></div>
      <div class="plan-excludes"><span>✕</span><b>No incluye 01 tablet Xiaomi Redmi Pad 2</b></div>
      <small>Consulte los términos y condiciones.</small>`;

    const bronzeInfo = `
      <strong class="plan-info-title">Plan Bronce · Económico</strong>
      <div class="plan-benefit-line"><span>✓</span><b>Sin costo de implementación inicial</b></div>
      <div class="plan-benefit-line"><span>✓</span><b>Solo pagas la mensualidad</b></div>
      <small>Consulte los términos y condiciones.</small>`;

    section.dataset.plansV2 = 'true';
    section.innerHTML = `
      <div class="plans-heading">
        <span>PLANES · RESTAURANTES</span>
        <h2>Elige cómo implementar AGNE en tu restaurante</h2>
        <p>Tres alternativas según cuánto equipamiento quieres incluir desde el inicio.</p>
      </div>

      <div class="plans-grid plans-grid-three">
        <article class="plan-card restaurant-plan-card plan-tier-gold" data-plan="oro" tabindex="0">
          <div class="plan-tier-head">
            <div class="plan-tier-name"><span>ORO</span>${coinStack()}</div>
            ${infoButton(goldInfo)}
          </div>
          <span class="plan-badge">PAGO ÚNICO · FULL</span>
          <h3>Plan Full Equipamiento</h3>
          <div class="plan-old-price">Antes <s>S/ 2,999</s></div>
          <div class="plan-price"><small>S/</small><strong>2,499</strong></div>
          <p class="plan-period">pago único</p>
          <p>La opción más completa para empezar con equipamiento, conectividad, configuración y capacitación.</p>
          <a class="plan-cta plan-cta-primary" href="${wa('Hola AGNE, tengo un restaurante y quiero información del Plan Oro Full Equipamiento de S/ 2,499.')}" target="_blank" rel="noopener">Quiero el Plan Oro →</a>
        </article>

        <article class="plan-card restaurant-plan-card plan-tier-silver" data-plan="plata" tabindex="0">
          <div class="plan-tier-head">
            <div class="plan-tier-name"><span>PLATA</span>${coinStack()}</div>
            ${infoButton(silverInfo)}
          </div>
          <span class="plan-badge">PAGO ÚNICO · MEDIO</span>
          <h3>Plan Medio</h3>
          <div class="plan-old-price">Antes <s>S/ 1,999</s></div>
          <div class="plan-price"><small>S/</small><strong>1,499</strong></div>
          <p class="plan-period">pago único</p>
          <p>Incluye la implementación completa, excepto la ticketera de caja y la tablet.</p>
          <a class="plan-cta" href="${wa('Hola AGNE, tengo un restaurante y quiero información del Plan Plata Medio de S/ 1,499.')}" target="_blank" rel="noopener">Quiero el Plan Plata →</a>
        </article>

        <article class="plan-card restaurant-plan-card plan-tier-bronze" data-plan="bronce" tabindex="0">
          <div class="plan-tier-head">
            <div class="plan-tier-name"><span>BRONCE</span>${coinStack()}</div>
            ${infoButton(bronzeInfo)}
          </div>
          <span class="plan-badge">SIN IMPLEMENTACIÓN INICIAL</span>
          <h3>Plan Económico</h3>
          <div class="plan-old-price">Antes <s>S/ 299 / mes</s></div>
          <div class="plan-price"><small>S/</small><strong>199</strong></div>
          <p class="plan-period">/ mes</p>
          <p><strong>Sin costo de implementación inicial.</strong> Empiezas pagando únicamente la mensualidad.</p>
          <a class="plan-cta" href="${wa('Hola AGNE, tengo un restaurante y quiero información del Plan Bronce Económico de S/ 199 al mes, sin costo de implementación inicial.')}" target="_blank" rel="noopener">Quiero el Plan Bronce →</a>
        </article>
      </div>

      <small class="plans-note plans-terms">Para todos los planes, consulte los términos y condiciones. El alcance final, compatibilidad y equipamiento se validan antes de la implementación.</small>`;
  };

  const selectPlan = (card) => {
    if (!card) return;
    document.querySelectorAll('.restaurant-plan-card.selected-plan').forEach((el) => {
      if (el !== card) el.classList.remove('selected-plan');
    });
    card.classList.remove('selected-plan');
    void card.offsetWidth;
    card.classList.add('selected-plan');
  };

  const sync = () => window.requestAnimationFrame(() => {
    applyRestaurantDefaults();
    enhancePlans();
  });

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const summary = target.closest('details.info-pop > summary');
    if (summary) {
      closeInfoPops(summary.parentElement);
      return;
    }

    if (!target.closest('details.info-pop')) closeInfoPops();

    const card = target.closest('.restaurant-plan-card');
    if (card && !target.closest('.plan-info')) selectPlan(card);
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeInfoPops();
    const target = event.target instanceof Element ? event.target : null;
    if ((event.key === 'Enter' || event.key === ' ') && target?.matches('.restaurant-plan-card')) {
      event.preventDefault();
      selectPlan(target);
    }
  });

  document.addEventListener('DOMContentLoaded', sync);
  window.addEventListener('hashchange', sync);
  new MutationObserver(sync).observe(document.documentElement, { childList: true, subtree: true });
})();
