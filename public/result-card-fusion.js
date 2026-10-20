(() => {
  let mounted = false;
  let syncing = false;

  const style = document.createElement('style');
  style.textContent = `
    #calculadora .loss-result{
      padding:24px;
      justify-content:flex-start;
      overflow:visible;
    }
    #calculadora .loss-result:after{width:170px;height:170px;right:-70px;top:-75px}
    #calculadora .loss-result-kicker{font-size:11px;letter-spacing:1.55px}
    #calculadora .loss-money{font-size:clamp(50px,6.5vw,78px);letter-spacing:-3px;margin:10px 0 0}
    #calculadora .loss-period{font-size:18px}
    #calculadora .loss-year{font-size:16px;margin-top:10px}
    #calculadora .loss-result>p{display:none!important}
    #calculadora .loss-disclaimer{display:none!important}
    #calculadora .conversion-block>.urgency-panel{display:none!important}

    .agne-result-title-row,.agne-inline-urgency-title{display:flex;align-items:center;justify-content:space-between;gap:10px;position:relative;z-index:4}
    .agne-info-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}
    .agne-info-btn{appearance:none;width:26px;height:26px;border-radius:999px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.12);color:#fff;font:inherit;font-size:14px;font-weight:950;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;box-shadow:none;padding:0}
    .agne-info-btn:hover,.agne-info-btn:focus-visible{background:#f57c00;border-color:#f57c00;outline:none}
    .agne-info-tooltip{position:absolute;right:0;top:34px;width:min(310px,calc(100vw - 64px));padding:13px 14px;border-radius:13px;background:#fff;color:#16334a;box-shadow:0 16px 38px rgba(0,0,0,.28);font-size:13px;line-height:1.45;font-weight:500;letter-spacing:0;text-align:left;opacity:0;visibility:hidden;transform:translateY(-5px);transition:.16s ease;z-index:60;pointer-events:none}
    .agne-info-tooltip small{display:block;margin-top:8px;color:#687d89;font-size:11px;line-height:1.4}
    .agne-info-wrap.open .agne-info-tooltip,.agne-info-wrap:focus-within .agne-info-tooltip{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto}
    @media(hover:hover){.agne-info-wrap:hover .agne-info-tooltip{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto}}

    .agne-inline-urgency{--urgency:#2fb36f;margin:18px -24px -24px;padding:18px 20px 20px;border-radius:0 0 20px 20px;background:#fff;color:#00233f;border-top:1px solid rgba(255,255,255,.16);position:relative;z-index:3}
    .agne-inline-urgency.urgency-atencion{--urgency:#d9b51b}.agne-inline-urgency.urgency-alto{--urgency:#ef8b2c}.agne-inline-urgency.urgency-critico{--urgency:#d83a3a}
    .agne-inline-urgency-title small{font-size:10px;letter-spacing:1.45px;font-weight:950;color:#60706a}
    .agne-inline-urgency .agne-info-btn{border-color:#cbd6dc;background:#f4f7f8;color:#26445a}
    .agne-inline-urgency .agne-info-btn:hover,.agne-inline-urgency .agne-info-btn:focus-visible{background:#f57c00;border-color:#f57c00;color:#fff}
    .agne-inline-status{display:flex;align-items:center;justify-content:center;gap:9px;margin:8px 0 2px}
    .agne-inline-status .urgency-emoji{font-size:32px;line-height:1}
    .agne-inline-status .urgency-label{font-size:clamp(28px,3.4vw,38px);line-height:1;color:var(--urgency);letter-spacing:-1px;text-align:center}
    .agne-inline-urgency .urgency-meter{position:relative;padding-top:44px;margin:9px 0 0}
    .agne-inline-urgency .urgency-scale{margin:0;display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
    .agne-inline-urgency .urgency-scale>span{height:12px;border-radius:999px}
    .agne-inline-urgency .urgency-scale>span:nth-child(1){background:#2fb36f}.agne-inline-urgency .urgency-scale>span:nth-child(2){background:#e6c94a}.agne-inline-urgency .urgency-scale>span:nth-child(3){background:#ef8b2c}.agne-inline-urgency .urgency-scale>span:nth-child(4){background:#d83a3a}
    .agne-inline-urgency .urgency-pointer{position:absolute;top:0;left:12.5%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;z-index:5;transition:left .25s ease}
    .agne-inline-urgency.urgency-atencion .urgency-pointer{left:37.5%}.agne-inline-urgency.urgency-alto .urgency-pointer{left:62.5%}.agne-inline-urgency.urgency-critico .urgency-pointer{left:87.5%}
    .agne-inline-urgency .urgency-pointer span{padding:6px 9px;border-radius:999px;background:#00233f;color:#fff;font-size:8px;line-height:1;font-weight:950;letter-spacing:.8px;white-space:nowrap}
    .agne-inline-urgency .urgency-pointer b{display:block;margin-top:1px;color:var(--urgency);font-size:25px;line-height:.8}
    .agne-inline-urgency .urgency-scale-labels{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:7px;color:#6d7f8b;font-size:8px;font-weight:900;letter-spacing:.15px;text-align:center}
    #calculadora .loss-recovery{margin-top:14px;padding:12px}
    #calculadora .loss-recovery small{font-size:11px}
    #calculadora .loss-recovery strong{font-size:18px}

    @media(max-width:560px){
      #calculadora .loss-result{padding:18px;border-radius:16px}
      #calculadora .loss-result-kicker{font-size:10px;letter-spacing:1.25px;max-width:260px}
      #calculadora .loss-money{font-size:52px;letter-spacing:-2.5px;margin-top:8px}
      #calculadora .loss-period{font-size:16px}
      #calculadora .loss-year{font-size:15px;margin-top:8px}
      .agne-inline-urgency{margin:16px -18px -18px;padding:15px 14px 16px;border-radius:0 0 16px 16px}
      .agne-inline-urgency-title small{font-size:9px;letter-spacing:1.2px}
      .agne-inline-status{gap:7px;margin-top:7px}
      .agne-inline-status .urgency-emoji{font-size:28px}
      .agne-inline-status .urgency-label{font-size:28px;letter-spacing:-.7px}
      .agne-inline-urgency .urgency-meter{padding-top:40px;margin-top:6px}
      .agne-inline-urgency .urgency-scale{gap:4px}
      .agne-inline-urgency .urgency-scale>span{height:11px}
      .agne-inline-urgency .urgency-scale-labels{font-size:7px;gap:2px;letter-spacing:0}
      .agne-info-btn{width:24px;height:24px;font-size:13px}
      .agne-info-tooltip{position:fixed;left:18px;right:18px;top:auto;bottom:24px;width:auto;max-width:none;font-size:13px;z-index:9999}
    }
  `;
  document.head.appendChild(style);

  const infoWrap = (label) => {
    const wrap = document.createElement('span');
    wrap.className = 'agne-info-wrap';
    wrap.innerHTML = `<button type="button" class="agne-info-btn" aria-label="${label}" aria-expanded="false">i</button><span class="agne-info-tooltip" role="tooltip"></span>`;
    const btn = wrap.querySelector('.agne-info-btn');
    btn?.addEventListener('click', (event) => {
      event.stopPropagation();
      const next = !wrap.classList.contains('open');
      document.querySelectorAll('.agne-info-wrap.open').forEach(el => el.classList.remove('open'));
      wrap.classList.toggle('open', next);
      btn.setAttribute('aria-expanded', next ? 'true' : 'false');
    });
    return wrap;
  };

  const closeInfos = () => {
    document.querySelectorAll('.agne-info-wrap.open').forEach((wrap) => {
      wrap.classList.remove('open');
      wrap.querySelector('.agne-info-btn')?.setAttribute('aria-expanded', 'false');
    });
  };
  document.addEventListener('click', closeInfos);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeInfos(); });

  const setTextIfChanged = (element, value) => {
    if (element && element.textContent !== value) element.textContent = value;
  };

  const sync = () => {
    if (syncing) return;
    syncing = true;
    try {
      const result = document.querySelector('#calculadora .loss-result');
      const source = document.querySelector('#calculadora .conversion-block .urgency-panel');
      const inline = result?.querySelector('.agne-inline-urgency');
      if (!result || !source || !inline) return;

      const urgencyClasses = ['urgency-controlable','urgency-atencion','urgency-alto','urgency-critico'];
      const activeClass = urgencyClasses.find(c => source.classList.contains(c));
      urgencyClasses.forEach(c => inline.classList.toggle(c, c === activeClass));

      const srcLabel = source.querySelector('.urgency-label')?.textContent || '';
      const srcEmoji = source.querySelector('.urgency-emoji')?.textContent || '';
      const srcCopy = source.querySelector('.urgency-copy')?.textContent || '';
      const srcNote = source.querySelector('.urgency-note')?.textContent || '';
      const resultCopy = result.querySelector(':scope > p')?.textContent || '';

      setTextIfChanged(inline.querySelector('.urgency-label'), srcLabel);
      setTextIfChanged(inline.querySelector('.urgency-emoji'), srcEmoji);
      setTextIfChanged(result.querySelector('.agne-result-title-row .agne-info-tooltip'), resultCopy);

      const urgencyTip = inline.querySelector('.agne-info-tooltip');
      const urgencyHtml = `${srcCopy}${srcNote ? `<small>${srcNote}</small>` : ''}`;
      if (urgencyTip && urgencyTip.innerHTML !== urgencyHtml) urgencyTip.innerHTML = urgencyHtml;
    } finally {
      syncing = false;
    }
  };

  const mount = () => {
    if (mounted) { sync(); return true; }
    const result = document.querySelector('#calculadora .loss-result');
    const source = document.querySelector('#calculadora .conversion-block .urgency-panel');
    const kicker = result?.querySelector('.loss-result-kicker');
    if (!result || !source || !kicker) return false;

    const titleRow = document.createElement('div');
    titleRow.className = 'agne-result-title-row';
    kicker.parentNode.insertBefore(titleRow, kicker);
    titleRow.appendChild(kicker);
    titleRow.appendChild(infoWrap('Información sobre esta estimación'));

    const inline = document.createElement('section');
    inline.className = 'agne-inline-urgency';
    inline.innerHTML = `
      <div class="agne-inline-urgency-title">
        <small>NIVEL DE FUGA ESTIMADA</small>
      </div>
      <div class="agne-inline-status"><span class="urgency-emoji" aria-hidden="true"></span><strong class="urgency-label"></strong></div>
      <div class="urgency-meter" aria-label="Medidor del nivel de fuga estimada">
        <div class="urgency-pointer" aria-hidden="true"><span>TU NIVEL</span><b>▼</b></div>
        <div class="urgency-scale" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        <div class="urgency-scale-labels" aria-hidden="true"><span>CONTROLABLE</span><span>ATENCIÓN</span><span>ALTO</span><span>CRÍTICO</span></div>
      </div>
    `;
    const urgencyTitle = inline.querySelector('.agne-inline-urgency-title');
    urgencyTitle?.appendChild(infoWrap('Información sobre el nivel de fuga'));
    result.appendChild(inline);

    const originalCopy = result.querySelector(':scope > p');
    if (originalCopy) originalCopy.setAttribute('aria-hidden','true');
    source.setAttribute('aria-hidden','true');

    mounted = true;
    sync();
    return true;
  };

  // Solo observamos mientras Angular termina de construir la calculadora.
  // Una vez montada la tarjeta, desconectamos el observer para evitar bucles.
  const mountObserver = new MutationObserver(() => {
    if (mount()) mountObserver.disconnect();
  });
  mountObserver.observe(document.documentElement, { childList:true, subtree:true });

  const scheduleSync = () => window.setTimeout(() => {
    if (!mounted) mount();
    sync();
  }, 0);

  // Los resultados cambian a partir de interacción del usuario; sincronizamos
  // después de que Angular haya procesado el evento.
  document.addEventListener('input', scheduleSync, true);
  document.addEventListener('change', scheduleSync, true);
  document.addEventListener('click', scheduleSync, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (mount()) mountObserver.disconnect();
    }, { once:true });
  } else if (mount()) {
    mountObserver.disconnect();
  }
})();