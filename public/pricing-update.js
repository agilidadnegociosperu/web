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
    if (!anchor?.href) return;
    try {
      const url = new URL(anchor.href, window.location.href);
      const text = url.searchParams.get('text');
      if (!text || !text.includes(oldText)) return;
      url.searchParams.set('text', text.replace(oldText, newText));
      const nextHref = url.toString();
      if (anchor.href !== nextHref) anchor.href = nextHref;
    } catch (_) {}
  };

  const syncPlans = () => {
    const full = document.querySelector('.plan-card.plan-full');
    const monthly = document.querySelector('.plan-card.plan-rent');
    if (!full || !monthly) return false;

    const fullPrice = full.querySelector('.plan-price');
    const monthlyPrice = monthly.querySelector('.plan-price');

    if (fullPrice) {
      fullPrice.innerHTML = '<small>S/</small><strong>2,499</strong>';
      if (!full.querySelector('.plan-original-price')) {
        fullPrice.insertAdjacentHTML('beforebegin', '<div class="plan-original-price">Precio regular: <s>S/ 2,999</s><span class="plan-current-label">PRECIO PROMOCIONAL</span></div>');
      }
    }

    if (monthlyPrice) {
      monthlyPrice.innerHTML = '<small>S/</small><strong>199</strong>';
      if (!monthly.querySelector('.plan-original-price')) {
        monthlyPrice.insertAdjacentHTML('beforebegin', '<div class="plan-original-price">Precio regular: <s>S/ 299</s><span class="plan-current-label">PRECIO PROMOCIONAL</span></div>');
      }
    }

    const fullCta = full.querySelector('.plan-cta');
    const monthlyCta = monthly.querySelector('.plan-cta');
    if (fullCta) fullCta.textContent = 'Quiero el Plan Full por S/ 2,499 →';
    if (monthlyCta) monthlyCta.textContent = 'Quiero empezar por S/ 199/mes →';

    updateWhatsappHref(fullCta, 'Plan Full de S/ 2,500', 'Plan Full de S/ 2,499');
    updateWhatsappHref(monthlyCta, 'Plan Mensual de S/ 100', 'Plan Mensual de S/ 199');

    return true;
  };

  const observer = new MutationObserver(() => syncPlans());
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });

  document.addEventListener('DOMContentLoaded', syncPlans);
  window.setTimeout(syncPlans, 0);
  window.setTimeout(syncPlans, 300);
  window.setTimeout(syncPlans, 1200);
})();