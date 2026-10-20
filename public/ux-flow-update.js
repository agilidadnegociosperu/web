(() => {
  const style = document.createElement('style');
  style.textContent = `
    /* Semáforo: centrado, ancho completo y color acorde al nivel */
    #calculadora .agne-inline-urgency {
      width: auto;
      text-align: center;
      border-top: 3px solid var(--urgency);
      transition: background .2s ease, border-color .2s ease;
    }
    #calculadora .agne-inline-urgency.urgency-controlable {
      background: linear-gradient(180deg,#f8fffb 0%,#eefaf3 100%);
    }
    #calculadora .agne-inline-urgency.urgency-atencion {
      background: linear-gradient(180deg,#fffef7 0%,#fff9df 100%);
    }
    #calculadora .agne-inline-urgency.urgency-alto {
      background: linear-gradient(180deg,#fffaf5 0%,#fff1e3 100%);
    }
    #calculadora .agne-inline-urgency.urgency-critico {
      background: linear-gradient(180deg,#fff8f7 0%,#ffebe9 100%);
    }
    #calculadora .agne-inline-urgency-title {
      width: 100%;
      justify-content: center;
      text-align: center;
      position: relative;
      min-height: 26px;
    }
    #calculadora .agne-inline-urgency-title > small {
      color: #536771;
      font-size: 11px;
      letter-spacing: 1.55px;
    }
    #calculadora .agne-inline-urgency-title .agne-info-wrap {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    #calculadora .agne-inline-status {
      width: 100%;
      justify-content: center;
      margin: 12px 0 5px;
    }
    #calculadora .agne-inline-status .urgency-emoji {
      font-size: 38px;
    }
    #calculadora .agne-inline-status .urgency-label {
      font-size: clamp(34px,5vw,48px);
    }
    #calculadora .agne-inline-urgency .urgency-meter {
      width: 100%;
      max-width: none;
      margin: 12px auto 0;
      padding-top: 48px;
    }
    #calculadora .agne-inline-urgency .urgency-scale {
      width: 100%;
      gap: 8px;
    }
    #calculadora .agne-inline-urgency .urgency-scale > span {
      height: 14px;
    }
    #calculadora .agne-inline-urgency .urgency-pointer span {
      background: var(--urgency);
      color: #fff;
      box-shadow: 0 6px 18px rgba(0,35,63,.16);
    }
    #calculadora .agne-inline-urgency .urgency-scale-labels {
      width: 100%;
      gap: 8px;
      margin-top: 9px;
      color: #536771;
      font-size: 9px;
    }

    /* Equipamiento opcional: no bloquea el acceso a precios */
    #calculadora .agne-equipment-details {
      margin: 22px 0 18px;
      border: 1px solid #dfe8ec;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 10px 28px rgba(0,35,63,.07);
      overflow: hidden;
    }
    #calculadora .agne-equipment-details > summary {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 17px 18px;
      cursor: pointer;
      color: #00233f;
      background: #f7fafb;
      user-select: none;
    }
    #calculadora .agne-equipment-details > summary::-webkit-details-marker { display:none; }
    #calculadora .agne-equipment-details > summary:hover { background:#f1f6f8; }
    #calculadora .agne-equipment-summary-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    #calculadora .agne-equipment-summary-copy > small:first-child {
      color:#f57c00;
      font-size:10px;
      font-weight:950;
      letter-spacing:1.35px;
    }
    #calculadora .agne-equipment-summary-copy > strong {
      font-size: 18px;
      line-height: 1.2;
    }
    #calculadora .agne-equipment-summary-copy > small:last-child {
      color:#647783;
      font-size:12px;
      line-height:1.35;
    }
    #calculadora .agne-equipment-toggle {
      flex: 0 0 auto;
      width: 34px;
      height: 34px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #f57c00;
      color: #fff;
      font-size: 23px;
      font-weight: 900;
      line-height: 1;
    }
    #calculadora .agne-equipment-details[open] > summary {
      border-bottom:1px solid #e4ecef;
    }
    #calculadora .agne-equipment-details .requirements-panel {
      margin: 0;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }
    #calculadora .agne-see-plans {
      display: flex;
      width: fit-content;
      margin: 18px auto 0;
      padding: 11px 16px;
      border-radius: 999px;
      background: #00233f;
      color: #fff;
      text-decoration: none;
      font-weight: 900;
      font-size: 13px;
    }

    @media (max-width:560px) {
      #calculadora .agne-inline-urgency-title > small { font-size:10px; }
      #calculadora .agne-inline-status .urgency-emoji { font-size:34px; }
      #calculadora .agne-inline-status .urgency-label { font-size:36px; }
      #calculadora .agne-inline-urgency .urgency-meter { padding-top:46px; }
      #calculadora .agne-inline-urgency .urgency-scale { gap:5px; }
      #calculadora .agne-inline-urgency .urgency-scale > span { height:13px; }
      #calculadora .agne-inline-urgency .urgency-scale-labels { gap:3px;font-size:8px; }
      #calculadora .agne-equipment-details > summary { padding:15px 14px;align-items:flex-start; }
      #calculadora .agne-equipment-summary-copy > strong { font-size:16px; }
      #calculadora .agne-equipment-summary-copy > small:last-child { font-size:11px; }
      #calculadora .agne-equipment-toggle { width:32px;height:32px;font-size:21px; }
    }
  `;
  document.head.appendChild(style);

  const setup = () => {
    const calculator = document.querySelector('#calculadora');
    const plans = calculator?.querySelector('.plans-section');
    const requirements = calculator?.querySelector('.requirements-panel');
    const inlineUrgency = calculator?.querySelector('.agne-inline-urgency');

    if (!calculator || !plans || !requirements || !inlineUrgency) return false;

    const note = plans.querySelector('.plans-note');
    if (note) {
      note.textContent = 'El equipamiento se define según compatibilidad y necesidad. Aprovechamos equipos existentes cuando sea técnicamente viable.';
    }

    if (!calculator.querySelector('.agne-equipment-details')) {
      const details = document.createElement('details');
      details.className = 'agne-equipment-details';
      details.open = false;
      details.innerHTML = `
        <summary>
          <span class="agne-equipment-summary-copy">
            <small>OPCIONAL</small>
            <strong>Aprovechemos lo que ya tienes</strong>
            <small>Despliega solo si ya cuentas con equipos que quieras reutilizar. Si no, continúa directamente a los planes.</small>
          </span>
          <span class="agne-equipment-toggle" aria-hidden="true">+</span>
        </summary>
      `;

      const toggle = details.querySelector('.agne-equipment-toggle');
      details.addEventListener('toggle', () => {
        if (toggle) toggle.textContent = details.open ? '−' : '+';
      });

      plans.parentNode.insertBefore(details, plans);
      details.appendChild(requirements);

      if (!requirements.querySelector('.agne-see-plans')) {
        const link = document.createElement('a');
        link.className = 'agne-see-plans';
        link.href = '#planes';
        link.textContent = 'Ver planes y precios →';
        link.addEventListener('click', (event) => {
          event.preventDefault();
          plans.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        requirements.appendChild(link);
      }
    }

    return true;
  };

  let tries = 0;
  const boot = () => {
    if (setup()) return;
    tries += 1;
    if (tries < 60) window.setTimeout(boot, 100);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
