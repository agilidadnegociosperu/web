(() => {
  const style = document.createElement('style');
  style.textContent = `
    .plan-original-price{
      margin:10px 0 2px;
      font-size:14px;
      line-height:1.2;
      font-weight:800;
      opacity:.72;
    }
    .plan-original-price s{
      text-decoration-thickness:2px;
      text-decoration-color:#d83a3a;
    }
    .plan-current-label{
      display:block;
      margin-top:4px;
      font-size:11px;
      font-weight:950;
      letter-spacing:1.2px;
      color:#f57c00;
    }
  `;
  document.head.appendChild(style);

  const updateWhatsappHref = (anchor, oldText, newText) => {
    if (!anchor || !anchor.href) return;
    try {
      const url = new URL(anchor.href, window.location.href);
      const text = url.searchParams.get('text');
      if (!text || !text.includes(oldText)) return;
      url.searchParams.set('text', text.replace(oldText, newText));
      anchor.href = url.toString();
    } catch (_) {}
  };

  const syncPlans = () => {
    const full = document.querySelector('.plan-card.plan-full');
    const monthly = document.querySelector('.plan-card.plan-rent');
    if (!full || !monthly) return false;

    const fullPrice = full.querySelector('.plan-price');
    const monthlyPrice = monthly.querySelector('.plan-price');

    if (fullPrice && fullPrice.textContent.trim() !== 'S/2,499') {
      fullPrice.innerHTML = '<small>S/</small><strong>2,499</strong>';
    }
    if (fullPrice && !full.querySelector('.plan-original-price')) {
      fullPrice.insertAdjacentHTML('beforebegin', '<div class="plan-original-price">Precio regular: <s>S/ 2,999</s><span class="plan-current-label">PRECIO PROMOCIONAL</span></div>');
    }

    if (monthlyPrice && monthlyPrice.textContent.trim() !== 'S/199') {
      monthlyPrice.innerHTML = '<small>S/</small><strong>199</strong>';
    }
    if (monthlyPrice && !monthly.querySelector('.plan-original-price')) {
      monthlyPrice.insertAdjacentHTML('beforebegin', '<div class="plan-original-price">Precio regular: <s>S/ 299</s><span class="plan-current-label">PRECIO PROMOCIONAL</span></div>');
    }

    const fullCta = full.querySelector('.plan-cta');
    const monthlyCta = monthly.querySelector('.plan-cta');
    if (fullCta && fullCta.textContent !== 'Quiero el Plan Full por S/ 2,499 →') fullCta.textContent = 'Quiero el Plan Full por S/ 2,499 →';
    if (monthlyCta && monthlyCta.textContent !== 'Quiero empezar por S/ 199/mes →') monthlyCta.textContent = 'Quiero empezar por S/ 199/mes →';

    updateWhatsappHref(fullCta, 'Plan Full de S/ 2,500', 'Plan Full de S/ 2,499');
    updateWhatsappHref(monthlyCta, 'Plan Mensual de S/ 100', 'Plan Mensual de S/ 199');
    return true;
  };

  let tries = 0;
  const boot = () => {
    if (syncPlans()) return;
    tries += 1;
    if (tries < 40) window.setTimeout(boot, 100);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  document.addEventListener('input', (event) => {
    if (event.target && event.target.closest && event.target.closest('#calculadora')) {
      window.setTimeout(syncPlans, 0);
    }
  });

  document.addEventListener('click', (event) => {
    const anchor = event.target && event.target.closest ? event.target.closest('.plan-card .plan-cta') : null;
    if (!anchor) return;
    if (anchor.closest('.plan-full')) updateWhatsappHref(anchor, 'Plan Full de S/ 2,500', 'Plan Full de S/ 2,499');
    if (anchor.closest('.plan-rent')) updateWhatsappHref(anchor, 'Plan Mensual de S/ 100', 'Plan Mensual de S/ 199');
  }, true);
})();